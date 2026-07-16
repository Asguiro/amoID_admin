import type {
  Beneficiary,
  BeneficiaryCoverageStatus,
  BeneficiaryDetail,
  BeneficiaryType,
  DossierCompletenessStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

type SeedRow = [
  id: string,
  displayName: string,
  ninaMasked: string,
  amoNumberMasked: string,
  cardMasked: string,
  status: Beneficiary["status"],
  establishmentName: string,
  region: string,
  coverageStatus: BeneficiaryCoverageStatus,
  beneficiaryType: BeneficiaryType,
  dossierStatus: DossierCompletenessStatus,
  hasBiometrics: boolean,
  hasHealthInfo: boolean,
  primaryHolderId?: string,
  primaryHolderName?: string,
];

const seed: SeedRow[] = [
  ["ben_001", "Aminata Traoré", "NINA-••••-2841", "AMO-••••-4182", "CB-••••-9012", "ACTIVE", "CSRéf Commune III", "Bamako", "ACTIVE", "PRIMARY", "COMPLETE", true, true],
  ["ben_002", "Moussa Diarra", "NINA-••••-7315", "AMO-••••-9054", "CB-••••-3344", "ACTIVE", "Hôpital du Mali", "Bamako", "ACTIVE", "PRIMARY", "COMPLETE", true, false],
  ["ben_003", "Fatoumata Koné", "NINA-••••-1198", "AMO-••••-2207", "CB-••••-7788", "PENDING", "CSRéf Kati", "Koulikoro", "UPDATE_REQUIRED", "DEPENDENT", "INCOMPLETE", false, false, "ben_001", "Aminata Traoré"],
  ["ben_004", "Ibrahim Coulibaly", "NINA-••••-5540", "AMO-••••-6731", "CB-••••-1122", "SUSPENDED", "Hôpital Ségou", "Ségou", "SUSPENDED", "PRIMARY", "COMPLETE", true, true],
  ["ben_005", "Mariam Sidibé", "NINA-••••-8822", "AMO-••••-1076", "CB-••••-5566", "ACTIVE", "CSRéf Sikasso", "Sikasso", "ACTIVE", "PRIMARY", "COMPLETE", true, true],
  ["ben_006", "Oumar Sangaré", "NINA-••••-3409", "AMO-••••-7650", "CB-••••-9900", "ACTIVE", "Hôpital Mopti", "Mopti", "UPDATE_REQUIRED", "PRIMARY", "INCOMPLETE", true, false],
  ["ben_007", "Aïssata Diallo", "NINA-••••-6274", "AMO-••••-3319", "CB-••••-2211", "PENDING", "CSRéf Kayes", "Kayes", "UPDATE_REQUIRED", "DEPENDENT", "INCOMPLETE", false, false, "ben_005", "Mariam Sidibé"],
  ["ben_008", "Bakary Keïta", "NINA-••••-9063", "AMO-••••-5488", "CB-••••-4433", "ACTIVE", "Hôpital Gao", "Gao", "ACTIVE", "PRIMARY", "COMPLETE", true, false],
  ["ben_009", "Kadidia Touré", "NINA-••••-4736", "AMO-••••-8143", "CB-••••-6655", "ACTIVE", "CSRéf Commune V", "Bamako", "ACTIVE", "PRIMARY", "COMPLETE", true, true],
];

const beneficiaries: BeneficiaryDetail[] = seed.map((row, index) => {
  const [
    id,
    displayName,
    ninaMasked,
    amoNumberMasked,
    biometricCardNumberMasked,
    status,
    establishmentName,
    region,
    coverageStatus,
    beneficiaryType,
    dossierStatus,
    hasBiometrics,
    hasHealthInfo,
    primaryHolderId,
    primaryHolderName,
  ] = row;

  return {
    id,
    displayName,
    ninaMasked,
    amoNumberMasked,
    biometricCardNumberMasked,
    status,
    establishmentName,
    region,
    coverageStatus,
    beneficiaryType,
    dossierStatus,
    hasBiometrics,
    hasHealthInfo,
    lastVerifiedAt: hasBiometrics ? daysAgo(index + 2) : undefined,
    updatedAt: daysAgo(index + 1),
    phoneMasked: `+223 •• •• ${20 + index} ${40 + index}`,
    dateOfBirth: `19${70 + index}-0${(index % 9) + 1}-15`,
    sex: index % 2 === 0 ? "FEMALE" : "MALE",
    address: `Quartier ${index + 1}`,
    city: region === "Bamako" ? "Bamako" : region,
    primaryHolderId,
    primaryHolderName,
    healthSummary: hasHealthInfo
      ? {
          hasEmergencyContact: true,
          hasBloodGroup: true,
          hasAllergies: index % 3 === 0,
          hasChronicConditions: index % 4 === 0,
          hasTreatments: index % 5 === 0,
          consentAccepted: true,
        }
      : undefined,
    activity: [
      { id: `${id}_a1`, label: "Vérification d’identité réussie", createdAt: daysAgo(index + 1) },
      { id: `${id}_a2`, label: "Dossier bénéficiaire consulté", createdAt: daysAgo(index + 4) },
    ],
    coverageHistory: [
      {
        id: `${id}_c1`,
        label: "Couverture AMO",
        from: "2025-01-01",
        to: "2026-12-31",
        status: coverageStatus,
      },
    ],
  };
});

export async function listBeneficiaries(
  query: ListQuery,
): Promise<PaginatedResponse<Beneficiary>> {
  let items: Beneficiary[] = filterByQuery(beneficiaries, query.q, [
    (item) => item.displayName,
    (item) => item.ninaMasked,
    (item) => item.amoNumberMasked,
    (item) => item.biometricCardNumberMasked,
  ]);
  items = filterByStatus(items, query.status);
  if (query.coverageStatus) {
    items = items.filter((item) => item.coverageStatus === query.coverageStatus);
  }
  if (query.dossierStatus) {
    items = items.filter((item) => item.dossierStatus === query.dossierStatus);
  }
  if (query.beneficiaryType) {
    items = items.filter((item) => item.beneficiaryType === query.beneficiaryType);
  }
  return toPaginated(items, query.page, query.pageSize);
}

export async function getBeneficiaryDetail(
  id: string,
  includeSensitive = false,
): Promise<BeneficiaryDetail | null> {
  const item = beneficiaries.find((beneficiary) => beneficiary.id === id);
  if (!item) return null;
  return {
    ...item,
    ...(includeSensitive
      ? {
          nina: `NINA-ML-${id.slice(-3)}-2841-95`,
          amoNumber: `AMO-${id.slice(-3)}-4182-ML`,
          biometricCardNumber: `CB-${id.slice(-3)}-9012-ML`,
        }
      : {}),
  };
}

export async function revealSensitive(
  id: string,
): Promise<Pick<BeneficiaryDetail, "nina" | "amoNumber" | "biometricCardNumber"> | null> {
  const detail = await getBeneficiaryDetail(id, true);
  return detail
    ? {
        nina: detail.nina,
        amoNumber: detail.amoNumber,
        biometricCardNumber: detail.biometricCardNumber,
      }
    : null;
}

export const list = listBeneficiaries;
export const getDetail = getBeneficiaryDetail;
