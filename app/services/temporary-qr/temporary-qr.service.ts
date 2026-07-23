import { apiRequest } from "~/server/api/client.server";
import type {
  ListQuery,
  PaginatedResponse,
  TemporaryQr,
  TemporaryQrDetail,
  TemporaryQrDuration,
  TemporaryQrStatus,
} from "~/types/admin";

type ApiQr = {
  id: string;
  jti?: string;
  status: TemporaryQrStatus;
  reason: TemporaryQr["reason"];
  beneficiaryMasked: string;
  beneficiaryId: string;
  issuerName?: string;
  issuedBy?: string;
  establishmentName?: string;
  expiresAt: string;
  createdAt: string;
  issuedAt?: string;
  printReference?: string;
  attestationUrl?: string;
  faceCaptureSessionId?: string;
  usageCount?: number;
  duration?: TemporaryQrDuration;
  revokeReason?: string;
  audit?: TemporaryQrDetail["audit"];
};

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404,
  );
}

function buildQuery(query: ListQuery & { beneficiaryId?: string }) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.reason) params.set("reason", query.reason);
  if (query.beneficiaryId) params.set("beneficiaryId", query.beneficiaryId);
  return params;
}

function inferDuration(createdAt: string, expiresAt: string): TemporaryQrDuration {
  const hours =
    (new Date(expiresAt).getTime() - new Date(createdAt).getTime()) / 3_600_000;
  if (hours <= 30) return "24H";
  if (hours <= 90) return "72H";
  return "7D";
}

function toListItem(q: ApiQr): TemporaryQr {
  const issuedAt = q.issuedAt ?? q.createdAt;
  return {
    id: q.id,
    beneficiaryMasked: q.beneficiaryMasked,
    status: q.status,
    reason: q.reason,
    duration: q.duration ?? inferDuration(issuedAt, q.expiresAt),
    issuedBy: q.issuedBy ?? q.issuerName ?? "—",
    issuedAt,
    expiresAt: q.expiresAt,
    usageCount: q.usageCount ?? (q.status === "USED" ? 1 : 0),
  };
}

function toDetail(q: ApiQr): TemporaryQrDetail {
  const list = toListItem(q);
  return {
    ...list,
    beneficiaryId: q.beneficiaryId,
    printReference: q.printReference ?? q.attestationUrl,
    faceCaptureSessionId: q.faceCaptureSessionId,
    revokeReason: q.revokeReason,
    audit: q.audit ?? [
      {
        id: `${q.id}-issued`,
        label: `QR émis (${q.reason})`,
        actor: list.issuedBy,
        createdAt: list.issuedAt,
      },
      ...(q.status === "REVOKED"
        ? [
            {
              id: `${q.id}-revoked`,
              label: "QR révoqué",
              actor: "Administrateur",
              createdAt: q.expiresAt,
            },
          ]
        : []),
    ],
  };
}

export async function listTemporaryQrs(
  query: ListQuery & { beneficiaryId?: string },
  accessToken: string,
): Promise<PaginatedResponse<TemporaryQr>> {
  const res = await apiRequest<PaginatedResponse<ApiQr>>(
    `/admin/temporary-qr?${buildQuery(query)}`,
    { accessToken },
  );
  let items = res.items;
  if (query.beneficiaryId) {
    items = items.filter((item) => item.beneficiaryId === query.beneficiaryId);
  }
  if (query.reason) {
    items = items.filter((item) => item.reason === query.reason);
  }
  return {
    ...res,
    items: items.map(toListItem),
  };
}

export async function getTemporaryQr(
  id: string,
  accessToken: string,
): Promise<TemporaryQrDetail | null> {
  try {
    const item = await apiRequest<ApiQr>(`/admin/temporary-qr/${id}`, {
      accessToken,
    });
    return toDetail(item);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function revokeTemporaryQr(
  id: string,
  reason: string,
  accessToken: string,
): Promise<TemporaryQrDetail> {
  if (!reason.trim()) throw new Error("Le motif de révocation est obligatoire.");
  const item = await apiRequest<ApiQr>(`/admin/temporary-qr/${id}/revoke`, {
    method: "POST",
    accessToken,
    body: { reason: reason.trim() },
  });
  return toDetail({ ...item, revokeReason: reason.trim() });
}

export const list = listTemporaryQrs;
export const get = getTemporaryQr;
export const revoke = revokeTemporaryQr;
