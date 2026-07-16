import type { Device, ListQuery, PaginatedResponse } from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const deviceSeed = [
  ["dev-001", "Samsung Galaxy A54", "TRUSTED", "agt-001", "Aïssata Traoré", "Hôpital du Point G", "Android 14", 0, 120],
  ["dev-002", "Tablette Point G 01", "TRUSTED", "agt-002", "Moussa Diarra", "Hôpital du Point G", "Android 13", 1, 180],
  ["dev-003", "iPhone de Fatoumata", "PENDING", "agt-003", "Fatoumata Koné", "CHU Gabriel Touré", "iOS 18", 3, 5],
  ["dev-004", "Tablette Gabriel Touré", "TRUSTED", "agt-004", "Oumar Coulibaly", "CHU Gabriel Touré", "Android 14", 2, 80],
  ["dev-005", "Terminal Clinique", "REVOKED", "agt-005", "Mariam Diallo", "Clinique Pasteur", "Android 12", 30, 150],
  ["dev-006", "Mobile Pharmacie", "TRUSTED", "agt-006", "Ibrahim Keïta", "Pharmacie du Fleuve", "Android 14", 1, 100],
  ["dev-007", "Tablette Ségou", "TRUSTED", "agt-007", "Nana Sangaré", "Antenne AMO Ségou", "Android 13", 0, 190],
  ["dev-008", "Ancien terminal Sikasso", "REVOKED", "agt-008", "Bakary Sidibé", "Centre médical Sikasso", "Android 11", 80, 280],
  ["dev-009", "Terminal Mopti", "TRUSTED", "agt-009", "Aminata Touré", "Hôpital régional Mopti", "Android 14", 4, 50],
  ["dev-010", "Mobile Pasteur", "TRUSTED", "agt-010", "Modibo Maïga", "Clinique Pasteur", "iOS 18", 1, 60],
  ["dev-011", "Terminal Koutiala", "PENDING", "agt-011", "Kadidia Dembélé", "Pharmacie Kénédougou", "Android 15", 7, 8],
] as const;

let devices: Device[] = deviceSeed.map(([id, label, status, agentId, agentName, establishmentName, platform, seen, enrolled]) => ({
  id,
  label,
  status,
  agentId,
  agentName,
  establishmentName,
  platform,
  lastSeenAt: daysAgo(seen),
  enrolledAt: daysAgo(enrolled),
}));

export async function listDevices(query: ListQuery & { agentId?: string }): Promise<PaginatedResponse<Device>> {
  let filtered = filterByStatus(
    filterByQuery(devices, query.q, [(item) => item.label, (item) => item.agentName, (item) => item.establishmentName]),
    query.status,
  );
  if (query.agentId) filtered = filtered.filter((item) => item.agentId === query.agentId);
  return toPaginated(filtered, query.page, query.pageSize);
}

export async function getDevice(id: string): Promise<Device | undefined> {
  return devices.find((item) => item.id === id);
}

export async function revokeDevice(id: string, _reason: string): Promise<Device | undefined> {
  const current = await getDevice(id);
  if (!current) return undefined;
  const updated: Device = { ...current, status: "REVOKED" };
  devices = devices.map((item) => (item.id === id ? updated : item));
  return updated;
}
