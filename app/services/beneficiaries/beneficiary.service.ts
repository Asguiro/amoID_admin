import type { Beneficiary, BeneficiaryDetail, ListQuery, PaginatedResponse } from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const beneficiaries: BeneficiaryDetail[] = [
  ["ben_001", "Aminata Traoré", "NINA-••••-2841", "AMO-••••-4182", "ACTIVE", "CSRéf Commune III", "Bamako", "COVERED"],
  ["ben_002", "Moussa Diarra", "NINA-••••-7315", "AMO-••••-9054", "ACTIVE", "Hôpital du Mali", "Bamako", "COVERED"],
  ["ben_003", "Fatoumata Koné", "NINA-••••-1198", "AMO-••••-2207", "PENDING", "CSRéf Kati", "Koulikoro", "LIMITED"],
  ["ben_004", "Ibrahim Coulibaly", "NINA-••••-5540", "AMO-••••-6731", "SUSPENDED", "Hôpital Ségou", "Ségou", "EXPIRED"],
  ["ben_005", "Mariam Sidibé", "NINA-••••-8822", "AMO-••••-1076", "ACTIVE", "CSRéf Sikasso", "Sikasso", "COVERED"],
  ["ben_006", "Oumar Sangaré", "NINA-••••-3409", "AMO-••••-7650", "ACTIVE", "Hôpital Mopti", "Mopti", "LIMITED"],
  ["ben_007", "Aïssata Diallo", "NINA-••••-6274", "AMO-••••-3319", "PENDING", "CSRéf Kayes", "Kayes", "LIMITED"],
  ["ben_008", "Bakary Keïta", "NINA-••••-9063", "AMO-••••-5488", "ACTIVE", "Hôpital Gao", "Gao", "COVERED"],
  ["ben_009", "Kadidia Touré", "NINA-••••-4736", "AMO-••••-8143", "ACTIVE", "CSRéf Commune V", "Bamako", "COVERED"],
].map(([id, displayName, ninaMasked, amoNumberMasked, status, establishmentName, region, coverageStatus], index) => ({
  id, displayName, ninaMasked, amoNumberMasked,
  status: status as Beneficiary["status"],
  establishmentName, region,
  coverageStatus: coverageStatus as Beneficiary["coverageStatus"],
  updatedAt: daysAgo(index + 1),
  phoneMasked: `+223 •• •• ${20 + index} ${40 + index}`,
  dateOfBirth: `19${70 + index}-0${(index % 9) + 1}-15`,
  activity: [
    { id: `${id}_a1`, label: "Vérification d’identité réussie", createdAt: daysAgo(index + 1) },
    { id: `${id}_a2`, label: "Dossier bénéficiaire consulté", createdAt: daysAgo(index + 4) },
  ],
  coverageHistory: [
    { id: `${id}_c1`, label: "Couverture AMO", from: "2025-01-01", to: "2026-12-31", status: coverageStatus },
  ],
}));

export async function listBeneficiaries(query: ListQuery): Promise<PaginatedResponse<Beneficiary>> {
  let items: Beneficiary[] = filterByQuery(beneficiaries, query.q, [
    (item) => item.displayName,
    (item) => item.ninaMasked,
    (item) => item.amoNumberMasked,
  ]);
  items = filterByStatus(items, query.status);
  return toPaginated(items, query.page, query.pageSize);
}

export async function getBeneficiaryDetail(id: string, includeSensitive = false): Promise<BeneficiaryDetail | null> {
  const item = beneficiaries.find((beneficiary) => beneficiary.id === id);
  if (!item) return null;
  return {
    ...item,
    ...(includeSensitive
      ? { nina: `NINA-ML-${id.slice(-3)}-2841-95`, amoNumber: `AMO-${id.slice(-3)}-4182-ML` }
      : {}),
  };
}

export async function revealSensitive(id: string): Promise<Pick<BeneficiaryDetail, "nina" | "amoNumber"> | null> {
  const detail = await getBeneficiaryDetail(id, true);
  return detail ? { nina: detail.nina, amoNumber: detail.amoNumber } : null;
}

export const list = listBeneficiaries;
export const getDetail = getBeneficiaryDetail;
