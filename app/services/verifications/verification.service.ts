import type {
  ListQuery,
  PaginatedResponse,
  Verification,
  VerificationConfidenceLabel,
  VerificationDecision,
  VerificationDetail,
  VerificationOutcome,
} from "~/types/admin";

import { daysAgo, filterByQuery, toPaginated } from "../_shared/mock.utils";

const verifications: VerificationDetail[] = [
  {
    id: "ver_001",
    beneficiaryMasked: "A•••••• T•••••",
    beneficiaryId: "ben_001",
    outcome: "SUCCESS",
    decision: "CONFIRM",
    confidenceLabel: "HIGH",
    establishmentName: "CSRéf Commune III",
    agentName: "Mamadou Diallo",
    channel: "BIOMETRIC",
    createdAt: daysAgo(0, 1),
    device: "Samsung Tab Active4",
    matchId: "match_001",
    timeline: [
      { id: "t1", label: "Capture faciale validée", actor: "Système", createdAt: daysAgo(0, 1) },
      { id: "t2", label: "Correspondance confirmée", actor: "Mamadou Diallo", createdAt: daysAgo(0, 1) },
    ],
    metadata: { pointDeService: "CSRéf Commune III", versionApplication: "3.4.1" },
  },
  {
    id: "ver_002",
    beneficiaryMasked: "M••••• D•••••",
    beneficiaryId: "ben_002",
    outcome: "DOUBT",
    decision: "MANUAL",
    confidenceLabel: "MEDIUM",
    establishmentName: "Hôpital du Mali",
    agentName: "Awa Konaté",
    channel: "BIOMETRIC",
    createdAt: daysAgo(1, 2),
    device: "Zebra ET40",
    matchId: "match_002",
    manualReason: "Éclairage insuffisant, contrôle manuel demandé",
    manualReference: "CTRL-2026-0142",
    timeline: [
      { id: "t1", label: "Match douteux détecté", actor: "Système", createdAt: daysAgo(1, 2) },
      { id: "t2", label: "Contrôle manuel initié", actor: "Awa Konaté", createdAt: daysAgo(1, 2) },
    ],
    metadata: { pointDeService: "Hôpital du Mali", versionApplication: "3.4.1" },
  },
  {
    id: "ver_003",
    beneficiaryMasked: "F•••••••• K•••",
    beneficiaryId: "ben_003",
    outcome: "FAILURE",
    decision: "REJECT",
    confidenceLabel: "LOW",
    establishmentName: "CSRéf Kati",
    agentName: "Boubacar Keïta",
    channel: "QR",
    createdAt: daysAgo(2, 3),
    device: "Android POS 12",
    matchId: "match_003",
    businessRuleNote: "QR seul insuffisant — vérification faciale requise",
    timeline: [
      { id: "t1", label: "Scan QR enregistré", actor: "Boubacar Keïta", createdAt: daysAgo(2, 3) },
      { id: "t2", label: "Face non confirmée — échec", actor: "Système", createdAt: daysAgo(2, 3) },
    ],
    metadata: { pointDeService: "CSRéf Kati", versionApplication: "3.4.0" },
  },
  {
    id: "ver_004",
    beneficiaryMasked: "I•••••• C••••••••",
    beneficiaryId: "ben_004",
    outcome: "MANUAL_REVIEW",
    decision: "MANUAL",
    confidenceLabel: "MEDIUM",
    establishmentName: "Hôpital Ségou",
    agentName: "Fanta Touré",
    channel: "MANUAL",
    identifierType: "NINA",
    createdAt: daysAgo(3, 4),
    device: "Poste web",
    matchId: "match_004",
    manualReason: "Droits suspendus — contrôle administrateur",
    primaryHolderName: undefined,
    timeline: [
      { id: "t1", label: "Recherche manuelle NINA", actor: "Fanta Touré", createdAt: daysAgo(3, 4) },
      { id: "t2", label: "Revue manuelle ouverte", actor: "Fanta Touré", createdAt: daysAgo(3, 4) },
    ],
    metadata: { pointDeService: "Hôpital Ségou", versionApplication: "3.4.1" },
  },
  {
    id: "ver_005",
    beneficiaryMasked: "M••••• S•••••",
    beneficiaryId: "ben_005",
    outcome: "SUCCESS",
    decision: "CONFIRM",
    confidenceLabel: "HIGH",
    establishmentName: "CSRéf Sikasso",
    agentName: "Seydou Coulibaly",
    channel: "QR",
    createdAt: daysAgo(4, 5),
    device: "Samsung A54",
    matchId: "match_005",
    businessRuleNote: "QR + face confirmés",
    timeline: [
      { id: "t1", label: "Scan QR", actor: "Seydou Coulibaly", createdAt: daysAgo(4, 5) },
      { id: "t2", label: "Face confirmée", actor: "Système", createdAt: daysAgo(4, 5) },
    ],
    metadata: { pointDeService: "CSRéf Sikasso", versionApplication: "3.4.1" },
  },
  {
    id: "ver_006",
    beneficiaryMasked: "O•••• S••••••",
    beneficiaryId: "ben_006",
    outcome: "SUCCESS",
    decision: "CONFIRM",
    confidenceLabel: "HIGH",
    establishmentName: "Hôpital Mopti",
    agentName: "Mariam Cissé",
    channel: "BIOMETRIC",
    createdAt: daysAgo(5, 6),
    device: "Zebra ET40",
    matchId: "match_006",
    timeline: [
      { id: "t1", label: "Correspondance confirmée", actor: "Mariam Cissé", createdAt: daysAgo(5, 6) },
    ],
    metadata: { pointDeService: "Hôpital Mopti", versionApplication: "3.4.1" },
  },
  {
    id: "ver_007",
    beneficiaryMasked: "A•••••• D•••••",
    beneficiaryId: "ben_007",
    outcome: "FAILURE",
    decision: "REJECT",
    confidenceLabel: "LOW",
    establishmentName: "CSRéf Kayes",
    agentName: "Issa Traoré",
    channel: "BIOMETRIC",
    createdAt: daysAgo(6, 7),
    device: "Samsung Tab Active4",
    matchId: "match_007",
    primaryHolderName: "Mariam Sidibé",
    primaryHolderAmoNumberMasked: "AMO-••••-1076",
    timeline: [
      { id: "t1", label: "Multi-match / échec", actor: "Système", createdAt: daysAgo(6, 7) },
    ],
    metadata: { pointDeService: "CSRéf Kayes", versionApplication: "3.4.1" },
  },
  {
    id: "ver_008",
    beneficiaryMasked: "B••••• K••••",
    beneficiaryId: "ben_008",
    outcome: "SUCCESS",
    decision: "CONFIRM",
    confidenceLabel: "HIGH",
    establishmentName: "Hôpital Gao",
    agentName: "Aminata Maïga",
    channel: "MANUAL",
    identifierType: "AMO_NUMBER",
    createdAt: daysAgo(7, 8),
    device: "Android POS 12",
    matchId: "match_008",
    timeline: [
      { id: "t1", label: "Identification manuelle AMO", actor: "Aminata Maïga", createdAt: daysAgo(7, 8) },
      { id: "t2", label: "Décision confirmée", actor: "Aminata Maïga", createdAt: daysAgo(7, 8) },
    ],
    metadata: { pointDeService: "Hôpital Gao", versionApplication: "3.4.1" },
  },
];

function toListItem(detail: VerificationDetail): Verification {
  const {
    device: _device,
    metadata: _metadata,
    timeline: _timeline,
    matchId: _matchId,
    manualReason: _manualReason,
    manualReference: _manualReference,
    primaryHolderName: _primaryHolderName,
    primaryHolderAmoNumberMasked: _primaryHolderAmo,
    businessRuleNote: _businessRuleNote,
    ...item
  } = detail;
  return item;
}

export async function listVerifications(
  query: ListQuery,
): Promise<PaginatedResponse<Verification>> {
  let items = filterByQuery(verifications, query.q, [
    (item) => item.id,
    (item) => item.beneficiaryMasked,
    (item) => item.establishmentName,
    (item) => item.agentName,
  ]);
  if (query.status) {
    items = items.filter((item) => item.outcome === (query.status as VerificationOutcome));
  }
  if (query.channel) {
    items = items.filter((item) => item.channel === query.channel);
  }
  if (query.decision) {
    items = items.filter(
      (item) => item.decision === (query.decision as VerificationDecision),
    );
  }
  return toPaginated(
    items.map(toListItem),
    query.page,
    query.pageSize,
  );
}

export async function getVerification(
  id: string,
): Promise<VerificationDetail | null> {
  return verifications.find((item) => item.id === id) ?? null;
}

export const list = listVerifications;
export const get = getVerification;

export type { VerificationConfidenceLabel };
