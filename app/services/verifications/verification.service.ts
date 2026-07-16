import type { ListQuery, PaginatedResponse, Verification, VerificationDetail, VerificationOutcome } from "~/types/admin";

import { daysAgo, filterByQuery, toPaginated } from "../_shared/mock.utils";

const verifications: VerificationDetail[] = [
  ["ver_001", "A•••••• T•••••", "SUCCESS", "CSRéf Commune III", "Mamadou Diallo", "BIOMETRIC", "Samsung Tab Active4"],
  ["ver_002", "M••••• D•••••", "DOUBT", "Hôpital du Mali", "Awa Konaté", "BIOMETRIC", "Zebra ET40"],
  ["ver_003", "F•••••••• K•••", "FAILURE", "CSRéf Kati", "Boubacar Keïta", "QR", "Android POS 12"],
  ["ver_004", "I•••••• C••••••••", "MANUAL_REVIEW", "Hôpital Ségou", "Fanta Touré", "MANUAL", "Poste web"],
  ["ver_005", "M••••• S•••••", "SUCCESS", "CSRéf Sikasso", "Seydou Coulibaly", "QR", "Samsung A54"],
  ["ver_006", "O•••• S••••••", "SUCCESS", "Hôpital Mopti", "Mariam Cissé", "BIOMETRIC", "Zebra ET40"],
  ["ver_007", "A•••••• D•••••", "FAILURE", "CSRéf Kayes", "Issa Traoré", "BIOMETRIC", "Samsung Tab Active4"],
  ["ver_008", "B••••• K••••", "SUCCESS", "Hôpital Gao", "Aminata Maïga", "QR", "Android POS 12"],
].map(([id, beneficiaryMasked, outcome, establishmentName, agentName, channel, device], index) => ({
  id, beneficiaryMasked,
  outcome: outcome as VerificationOutcome,
  establishmentName, agentName,
  channel: channel as Verification["channel"],
  createdAt: daysAgo(index, index + 1),
  device,
  metadata: { pointDeService: establishmentName, versionApplication: "3.4.1" },
}));

export async function listVerifications(query: ListQuery): Promise<PaginatedResponse<Verification>> {
  const items: Verification[] = filterByQuery(verifications, query.q, [
    (item) => item.id,
    (item) => item.beneficiaryMasked,
    (item) => item.establishmentName,
  ]).filter((item) => !query.status || item.outcome === query.status)
    .map(({ device: _device, metadata: _metadata, ...item }) => item);
  return toPaginated(items, query.page, query.pageSize);
}

export async function getVerification(id: string): Promise<VerificationDetail | null> {
  return verifications.find((item) => item.id === id) ?? null;
}

export const list = listVerifications;
export const get = getVerification;
