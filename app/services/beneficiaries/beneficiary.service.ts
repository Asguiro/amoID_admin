import { apiRequest } from "~/server/api/client.server";
import type {
  Beneficiary,
  BeneficiaryDetail,
  ListQuery,
  MediaAsset,
  PaginatedResponse,
} from "~/types/admin";

type BeneficiaryListQuery = ListQuery & {
  regionId?: string;
  establishmentId?: string;
};

type BeneficiaryApiDetail = Omit<
  BeneficiaryDetail,
  "activity" | "coverageHistory"
> & {
  media?: MediaAsset[];
  nina?: string;
  amoNumber?: string;
  biometricCardNumber?: string;
};

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404,
  );
}

function buildQuery(query: BeneficiaryListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.coverageStatus) params.set("coverageStatus", query.coverageStatus);
  if (query.dossierStatus) params.set("dossierStatus", query.dossierStatus);
  if (query.beneficiaryType) params.set("beneficiaryType", query.beneficiaryType);
  if (query.regionId) params.set("regionId", query.regionId);
  if (query.establishmentId) params.set("establishmentId", query.establishmentId);
  return params;
}

function stripSensitive(
  detail: BeneficiaryApiDetail,
): Omit<BeneficiaryApiDetail, "nina" | "amoNumber" | "biometricCardNumber"> {
  const { nina: _n, amoNumber: _a, biometricCardNumber: _b, ...rest } = detail;
  return rest;
}

export async function listBeneficiaries(
  query: BeneficiaryListQuery,
  accessToken: string,
): Promise<PaginatedResponse<Beneficiary>> {
  return apiRequest<PaginatedResponse<Beneficiary>>(
    `/admin/beneficiaries?${buildQuery(query)}`,
    { accessToken },
  );
}

export async function getBeneficiaryDetail(
  id: string,
  accessToken: string,
  includeSensitive = false,
): Promise<BeneficiaryDetail | null> {
  try {
    const [detail, activityRes, coverageRes] = await Promise.all([
      apiRequest<BeneficiaryApiDetail>(`/admin/beneficiaries/${id}`, {
        accessToken,
      }),
      apiRequest<PaginatedResponse<{ id: string; label: string; createdAt: string }>>(
        `/admin/beneficiaries/${id}/activity?page=1&pageSize=20`,
        { accessToken },
      ),
      apiRequest<{
        beneficiaryId: string;
        coverageStatus: string;
        history: BeneficiaryDetail["coverageHistory"];
      }>(`/admin/beneficiaries/${id}/coverage`, { accessToken }),
    ]);

    const base = includeSensitive ? detail : stripSensitive(detail);

    return {
      ...base,
      phoneMasked: detail.phoneMasked ?? "",
      media: detail.media ?? [],
      activity: activityRes.items.map((item) => ({
        ...item,
        createdAt:
          typeof item.createdAt === "string"
            ? item.createdAt
            : new Date(String(item.createdAt)).toISOString(),
      })),
      coverageHistory: coverageRes.history ?? [],
    };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function listBeneficiaryMedia(
  id: string,
  accessToken: string,
): Promise<MediaAsset[]> {
  try {
    return await apiRequest<MediaAsset[]>(`/admin/beneficiaries/${id}/media`, {
      accessToken,
    });
  } catch (error) {
    if (isNotFound(error)) return [];
    throw error;
  }
}

export async function revealSensitive(
  id: string,
  accessToken: string,
): Promise<Pick<BeneficiaryDetail, "nina" | "amoNumber" | "biometricCardNumber"> | null> {
  try {
    const detail = await apiRequest<BeneficiaryApiDetail>(
      `/admin/beneficiaries/${id}`,
      { accessToken },
    );
    return {
      nina: detail.nina,
      amoNumber: detail.amoNumber,
      biometricCardNumber: detail.biometricCardNumber,
    };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export const list = listBeneficiaries;
export const getDetail = getBeneficiaryDetail;
