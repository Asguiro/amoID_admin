import { apiRequest } from "~/server/api/client.server";
import type {
  ListQuery,
  PaginatedResponse,
  Verification,
  VerificationConfidenceLabel,
  VerificationDetail,
} from "~/types/admin";

type ApiVerification = Verification & {
  eligibilityLabel?: string;
  device?: string;
  matchId?: string;
  manualReason?: string;
  manualReference?: string;
  primaryHolderName?: string;
  primaryHolderAmoNumberMasked?: string;
  businessRuleNote?: string;
  timeline?: VerificationDetail["timeline"];
  metadata?: VerificationDetail["metadata"];
};

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404,
  );
}

function buildQuery(query: ListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.channel) params.set("channel", query.channel);
  if (query.decision) params.set("decision", query.decision);
  return params;
}

function toDetail(v: ApiVerification): VerificationDetail {
  return {
    id: v.id,
    beneficiaryMasked: v.beneficiaryMasked,
    beneficiaryId: v.beneficiaryId,
    outcome: v.outcome,
    decision: v.decision,
    confidenceLabel: v.confidenceLabel,
    establishmentName: v.establishmentName,
    agentName: v.agentName,
    channel: v.channel,
    identifierType: v.identifierType,
    createdAt: v.createdAt,
    device: v.device ?? "—",
    matchId: v.matchId,
    manualReason: v.manualReason,
    manualReference: v.manualReference,
    primaryHolderName: v.primaryHolderName,
    primaryHolderAmoNumberMasked: v.primaryHolderAmoNumberMasked,
    businessRuleNote: v.businessRuleNote ?? v.eligibilityLabel,
    timeline: v.timeline ?? [
      {
        id: `${v.id}-created`,
        label: `Vérification ${v.outcome}`,
        actor: v.agentName,
        createdAt: v.createdAt,
      },
    ],
    metadata: v.metadata ?? {
      pointDeService: v.establishmentName,
      versionApplication: "—",
    },
  };
}

export async function listVerifications(
  query: ListQuery,
  accessToken: string,
): Promise<PaginatedResponse<Verification>> {
  return apiRequest<PaginatedResponse<Verification>>(
    `/admin/verifications?${buildQuery(query)}`,
    { accessToken },
  );
}

export async function getVerification(
  id: string,
  accessToken: string,
): Promise<VerificationDetail | null> {
  try {
    const item = await apiRequest<ApiVerification>(
      `/admin/verifications/${id}`,
      { accessToken },
    );
    return toDetail(item);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export const list = listVerifications;
export const get = getVerification;

export type { VerificationConfidenceLabel };
