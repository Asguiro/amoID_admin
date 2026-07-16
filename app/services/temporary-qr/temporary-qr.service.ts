import type {
  ListQuery,
  PaginatedResponse,
  TemporaryQr,
  TemporaryQrDetail,
  TemporaryQrDuration,
  TemporaryQrReason,
  TemporaryQrStatus,
} from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const reasons: TemporaryQrReason[] = [
  "LOST_CARD",
  "DAMAGED_CARD",
  "RENEWAL_PENDING",
  "OPERATIONAL",
];
const durations: TemporaryQrDuration[] = ["24H", "72H", "7D"];

let temporaryQrs: TemporaryQrDetail[] = [
  ["qr_001", "ben_001", "A•••••• T•••••", "ACTIVE", "Mamadou Diallo", 0, 0],
  ["qr_002", "ben_002", "M••••• D•••••", "USED", "Awa Konaté", 1, 1],
  ["qr_003", "ben_003", "F•••••••• K•••", "EXPIRED", "Boubacar Keïta", 0, 2],
  ["qr_004", "ben_004", "I•••••• C••••••••", "REVOKED", "Fanta Touré", 0, 3],
  ["qr_005", "ben_001", "A•••••• T•••••", "USED", "Mamadou Diallo", 1, 0],
  ["qr_006", "ben_006", "O•••• S••••••", "ACTIVE", "Mariam Cissé", 0, 1],
  ["qr_007", "ben_007", "A•••••• D•••••", "ACTIVE", "Issa Traoré", 0, 2],
  ["qr_008", "ben_008", "B••••• K••••", "EXPIRED", "Aminata Maïga", 0, 3],
].map(([id, beneficiaryId, beneficiaryMasked, status, issuedBy, usageCount, reasonIdx], index) => ({
  id: id as string,
  beneficiaryId: beneficiaryId as string,
  beneficiaryMasked: beneficiaryMasked as string,
  status: status as TemporaryQrStatus,
  reason: reasons[reasonIdx as number]!,
  duration: durations[index % 3]!,
  issuedBy: issuedBy as string,
  issuedAt: daysAgo(index + 1),
  expiresAt: daysAgo(index - 1),
  usageCount: usageCount as number,
  printReference: `PRINT-${id}`,
  faceCaptureSessionId: `face_${id}`,
  revokeReason: status === "REVOKED" ? "Usage frauduleux suspecté" : undefined,
  audit: [
    {
      id: `${id}_issued`,
      label: `QR émis (${reasons[reasonIdx as number]}, ${durations[index % 3]})`,
      actor: issuedBy as string,
      createdAt: daysAgo(index + 1),
    },
    ...(usageCount
      ? [
          {
            id: `${id}_scan`,
            label: "Scan au point de soin",
            actor: "Terminal terrain",
            createdAt: daysAgo(index),
          },
        ]
      : []),
    ...(status === "REVOKED"
      ? [
          {
            id: `${id}_revoked`,
            label: "QR révoqué : Usage frauduleux suspecté",
            actor: "Administrateur",
            createdAt: daysAgo(Math.max(0, index - 1)),
          },
        ]
      : []),
  ],
}));

export async function listTemporaryQrs(
  query: ListQuery & { beneficiaryId?: string },
): Promise<PaginatedResponse<TemporaryQr>> {
  let items = filterByQuery(temporaryQrs, query.q, [
    (item) => item.id,
    (item) => item.beneficiaryMasked,
    (item) => item.issuedBy,
  ]);
  items = filterByStatus(items, query.status);
  if (query.reason) {
    items = items.filter((item) => item.reason === query.reason);
  }
  if (query.beneficiaryId) {
    items = items.filter((item) => item.beneficiaryId === query.beneficiaryId);
  }
  return toPaginated(
    items.map(
      ({
        audit: _audit,
        beneficiaryId: _beneficiaryId,
        printReference: _print,
        faceCaptureSessionId: _face,
        revokeReason: _revoke,
        ...item
      }) => item,
    ),
    query.page,
    query.pageSize,
  );
}

export async function getTemporaryQr(
  id: string,
): Promise<TemporaryQrDetail | null> {
  return temporaryQrs.find((item) => item.id === id) ?? null;
}

export async function revokeTemporaryQr(
  id: string,
  reason: string,
): Promise<TemporaryQrDetail> {
  if (!reason.trim()) throw new Error("Le motif de révocation est obligatoire.");
  const index = temporaryQrs.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("QR temporaire introuvable.");
  const current = temporaryQrs[index]!;
  const updated: TemporaryQrDetail = {
    ...current,
    status: "REVOKED",
    revokeReason: reason.trim(),
    audit: [
      ...current.audit,
      {
        id: `${id}_revoked`,
        label: `QR révoqué : ${reason.trim()}`,
        actor: "Administrateur",
        createdAt: new Date().toISOString(),
      },
    ],
  };
  temporaryQrs[index] = updated;
  return updated;
}

export const list = listTemporaryQrs;
export const get = getTemporaryQr;
export const revoke = revokeTemporaryQr;
