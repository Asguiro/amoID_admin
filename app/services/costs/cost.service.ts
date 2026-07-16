import type {
  BenefitClaim,
  BeneficiaryCostProfile,
  BeneficiaryCostRankingItem,
  CareCategory,
  CostBreakdown,
  CostReport,
  EstablishmentType,
} from "~/types/admin";

export const careCategoryLabels: Record<CareCategory, string> = {
  MEDICINES: "Médicaments",
  CONSULTATION: "Consultations",
  HOSPITALIZATION: "Hospitalisations",
  SURGERY: "Chirurgie",
  LABORATORY: "Biologie médicale",
  IMAGING: "Imagerie médicale",
  MATERNITY: "Maternité",
  DENTAL: "Soins bucco-dentaires",
};

const beneficiaryDirectory = [
  ["ben_001", "Aminata Traoré", "AMO-••••-4182", "Bamako"],
  ["ben_002", "Moussa Diarra", "AMO-••••-9054", "Bamako"],
  ["ben_003", "Fatoumata Koné", "AMO-••••-2207", "Koulikoro"],
  ["ben_004", "Ibrahim Coulibaly", "AMO-••••-6731", "Ségou"],
  ["ben_005", "Mariam Sidibé", "AMO-••••-1076", "Sikasso"],
  ["ben_006", "Oumar Sangaré", "AMO-••••-7650", "Mopti"],
  ["ben_007", "Aïssata Diallo", "AMO-••••-3319", "Kayes"],
  ["ben_008", "Bakary Keïta", "AMO-••••-5488", "Gao"],
  ["ben_009", "Kadidia Touré", "AMO-••••-8143", "Bamako"],
] as const;

const claimBlueprints: Array<{
  category: CareCategory;
  description: string;
  establishmentName: string;
  establishmentType: EstablishmentType;
  region: string;
  careSetting: "AMBULATORY" | "HOSPITAL";
  baseAmount: number;
  code: string;
}> = [
  {
    category: "MEDICINES",
    description: "Délivrance de médicaments AMO",
    establishmentName: "Pharmacie du Fleuve",
    establishmentType: "PHARMACY",
    region: "Bamako",
    careSetting: "AMBULATORY",
    baseAmount: 86_500,
    code: "MED-AMO",
  },
  {
    category: "HOSPITALIZATION",
    description: "Séjour hospitalier et soins associés",
    establishmentName: "Hôpital du Mali",
    establishmentType: "HOSPITAL",
    region: "Bamako",
    careSetting: "HOSPITAL",
    baseAmount: 425_000,
    code: "HOSP-STD",
  },
  {
    category: "LABORATORY",
    description: "Analyses de biologie médicale",
    establishmentName: "CSRéf Commune III",
    establishmentType: "CLINIC",
    region: "Bamako",
    careSetting: "AMBULATORY",
    baseAmount: 27_500,
    code: "BIO-AMO",
  },
  {
    category: "CONSULTATION",
    description: "Consultation de médecine spécialisée",
    establishmentName: "Clinique Pasteur",
    establishmentType: "CLINIC",
    region: "Bamako",
    careSetting: "AMBULATORY",
    baseAmount: 18_000,
    code: "CSP-AMO",
  },
  {
    category: "IMAGING",
    description: "Radiologie et imagerie médicale",
    establishmentName: "Centre d’imagerie du Sahel",
    establishmentType: "CLINIC",
    region: "Bamako",
    careSetting: "AMBULATORY",
    baseAmount: 62_000,
    code: "IMG-AMO",
  },
  {
    category: "DENTAL",
    description: "Soins bucco-dentaires couverts",
    establishmentName: "Cabinet dentaire Kanu",
    establishmentType: "CLINIC",
    region: "Bamako",
    careSetting: "AMBULATORY",
    baseAmount: 34_000,
    code: "DEN-AMO",
  },
];

function buildClaim(
  beneficiary: (typeof beneficiaryDirectory)[number],
  beneficiaryIndex: number,
  claimIndex: number,
): BenefitClaim {
  const blueprint =
    claimBlueprints[(claimIndex + beneficiaryIndex * 2) % claimBlueprints.length];
  const multiplier = 1 + ((beneficiaryIndex * 17 + claimIndex * 11) % 8) / 10;
  const billedAmount = Math.round((blueprint.baseAmount * multiplier) / 500) * 500;
  const partiallyRejected = (beneficiaryIndex + claimIndex) % 7 === 0;
  const rejectedAmount = partiallyRejected ? Math.round(billedAmount * 0.12) : 0;
  const eligibleAmount = billedAmount - rejectedAmount;
  const coverageRate = blueprint.careSetting === "HOSPITAL" ? 80 : 70;
  const coveredAmount = Math.round((eligibleAmount * coverageRate) / 100);
  const copayAmount = eligibleAmount - coveredAmount;
  const month = 7 - ((beneficiaryIndex + claimIndex * 2) % 6);
  const day = 4 + ((beneficiaryIndex * 3 + claimIndex * 5) % 22);
  const serviceDate = `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const anomalySignals =
    (beneficiaryIndex * 3 + claimIndex) % 9 === 0
      ? ["Fréquence inhabituelle à vérifier"]
      : [];

  return {
    id: `claim_${beneficiary[0]}_${claimIndex + 1}`,
    beneficiaryId: beneficiary[0],
    beneficiaryName: beneficiary[1],
    claimNumber: `PS-2026-${String(beneficiaryIndex + 1).padStart(3, "0")}${claimIndex + 1}`,
    invoiceReference: `FAC-${String(beneficiaryIndex + 31).padStart(3, "0")}-${claimIndex + 1}`,
    serviceDate,
    submittedAt: `${serviceDate}T15:20:00.000Z`,
    paidAt: `${serviceDate}T15:20:00.000Z`,
    category: blueprint.category,
    careSetting: blueprint.careSetting,
    description: blueprint.description,
    establishmentName:
      beneficiaryIndex > 1 && claimIndex % 3 === 0
        ? `${blueprint.establishmentName} — ${beneficiary[3]}`
        : blueprint.establishmentName,
    establishmentType: blueprint.establishmentType,
    region: beneficiaryIndex > 1 && claimIndex % 3 === 0 ? beneficiary[3] : blueprint.region,
    prescriberName: blueprint.category === "MEDICINES" ? "Prescripteur AMO #1842" : undefined,
    coverageRate,
    billedAmount,
    eligibleAmount,
    coveredAmount,
    copayAmount,
    rejectedAmount,
    status: partiallyRejected ? "PARTIALLY_REJECTED" : "PAID",
    verificationChannel: claimIndex % 3 === 0 ? "BIOMETRIC" : claimIndex % 3 === 1 ? "QR" : "MANUAL",
    anomalySignals,
    lines: [
      {
        code: blueprint.code,
        label: blueprint.description,
        quantity: 1,
        unitPrice: billedAmount,
        billedAmount,
        eligibleAmount,
      },
    ],
  };
}

const claims = beneficiaryDirectory.flatMap((beneficiary, beneficiaryIndex) =>
  Array.from(
    { length: 4 + (beneficiaryIndex % 3) },
    (_, claimIndex) => buildClaim(beneficiary, beneficiaryIndex, claimIndex),
  ),
);

function sum(items: BenefitClaim[], field: keyof BenefitClaim) {
  return items.reduce((total, item) => total + Number(item[field]), 0);
}

function breakdown(
  items: BenefitClaim[],
  keyOf: (claim: BenefitClaim) => string,
  labelOf: (claim: BenefitClaim) => string,
): CostBreakdown[] {
  const coveredTotal = sum(items, "coveredAmount");
  const groups = new Map<string, { label: string; claims: BenefitClaim[] }>();

  for (const claim of items) {
    const key = keyOf(claim);
    const group = groups.get(key) ?? { label: labelOf(claim), claims: [] };
    group.claims.push(claim);
    groups.set(key, group);
  }

  return [...groups.entries()]
    .map(([key, group]) => {
      const coveredAmount = sum(group.claims, "coveredAmount");
      return {
        key,
        label: group.label,
        claimsCount: group.claims.length,
        billedAmount: sum(group.claims, "billedAmount"),
        coveredAmount,
        sharePercent: coveredTotal ? (coveredAmount / coveredTotal) * 100 : 0,
      };
    })
    .sort((a, b) => b.coveredAmount - a.coveredAmount);
}

export async function getBeneficiaryCostProfile(
  beneficiaryId: string,
): Promise<BeneficiaryCostProfile | null> {
  const beneficiary = beneficiaryDirectory.find(([id]) => id === beneficiaryId);
  if (!beneficiary) return null;
  const items = claims
    .filter((claim) => claim.beneficiaryId === beneficiaryId)
    .sort((a, b) => b.serviceDate.localeCompare(a.serviceDate));
  const establishments = new Set(items.map((claim) => claim.establishmentName));
  const regions = new Set(items.map((claim) => claim.region));
  const months = new Map<string, BenefitClaim[]>();
  for (const claim of items) {
    const month = claim.serviceDate.slice(0, 7);
    months.set(month, [...(months.get(month) ?? []), claim]);
  }

  return {
    beneficiaryId,
    beneficiaryName: beneficiary[1],
    periodLabel: "Janvier à juillet 2026",
    generatedAt: new Date().toISOString(),
    dataSource: "DEMO",
    totals: {
      claimsCount: items.length,
      billedAmount: sum(items, "billedAmount"),
      eligibleAmount: sum(items, "eligibleAmount"),
      coveredAmount: sum(items, "coveredAmount"),
      copayAmount: sum(items, "copayAmount"),
      rejectedAmount: sum(items, "rejectedAmount"),
      establishmentsCount: establishments.size,
      regionsCount: regions.size,
      anomalySignalsCount: items.reduce(
        (total, item) => total + item.anomalySignals.length,
        0,
      ),
    },
    byCategory: breakdown(
      items,
      (claim) => claim.category,
      (claim) => careCategoryLabels[claim.category],
    ),
    byEstablishment: breakdown(
      items,
      (claim) => claim.establishmentName,
      (claim) => claim.establishmentName,
    ),
    monthlyTrend: [...months.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, monthClaims]) => ({
        month,
        claimsCount: monthClaims.length,
        coveredAmount: sum(monthClaims, "coveredAmount"),
      })),
    claims: items,
  };
}

export async function getCostReport(query = ""): Promise<CostReport> {
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");
  const profiles = (
    await Promise.all(beneficiaryDirectory.map(([id]) => getBeneficiaryCostProfile(id)))
  ).filter((profile): profile is BeneficiaryCostProfile => Boolean(profile));
  const ranking: BeneficiaryCostRankingItem[] = profiles
    .map((profile) => {
      const beneficiary = beneficiaryDirectory.find(([id]) => id === profile.beneficiaryId)!;
      return {
        beneficiaryId: profile.beneficiaryId,
        beneficiaryName: profile.beneficiaryName,
        amoNumberMasked: beneficiary[2],
        region: beneficiary[3],
        claimsCount: profile.totals.claimsCount,
        coveredAmount: profile.totals.coveredAmount,
        billedAmount: profile.totals.billedAmount,
        topCategory: profile.byCategory[0]?.key as CareCategory,
        establishmentsCount: profile.totals.establishmentsCount,
        anomalySignalsCount: profile.totals.anomalySignalsCount,
      };
    })
    .filter((item) =>
      normalizedQuery
        ? `${item.beneficiaryName} ${item.amoNumberMasked} ${item.region}`
            .toLocaleLowerCase("fr")
            .includes(normalizedQuery)
        : true,
    )
    .sort((a, b) => b.coveredAmount - a.coveredAmount);
  const visibleIds = new Set(ranking.map((item) => item.beneficiaryId));
  const visibleClaims = claims.filter((claim) => visibleIds.has(claim.beneficiaryId));

  return {
    periodLabel: "Janvier à juillet 2026",
    generatedAt: new Date().toISOString(),
    dataSource: "DEMO",
    totals: {
      beneficiariesCount: ranking.length,
      claimsCount: visibleClaims.length,
      billedAmount: sum(visibleClaims, "billedAmount"),
      coveredAmount: sum(visibleClaims, "coveredAmount"),
      copayAmount: sum(visibleClaims, "copayAmount"),
      rejectedAmount: sum(visibleClaims, "rejectedAmount"),
    },
    byCategory: breakdown(
      visibleClaims,
      (claim) => claim.category,
      (claim) => careCategoryLabels[claim.category],
    ),
    ranking,
  };
}
