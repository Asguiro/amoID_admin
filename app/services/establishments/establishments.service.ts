import type { Establishment, ListQuery, PaginatedResponse } from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

export type EstablishmentInput = Pick<
  Establishment,
  "name" | "type" | "region" | "city" | "status"
>;

let establishments: Establishment[] = [
  { id: "est-001", name: "Hôpital du Point G", type: "HOSPITAL", region: "Bamako", city: "Bamako", status: "ACTIVE", agentsCount: 3, devicesCount: 4, updatedAt: daysAgo(1) },
  { id: "est-002", name: "CHU Gabriel Touré", type: "HOSPITAL", region: "Bamako", city: "Bamako", status: "ACTIVE", agentsCount: 2, devicesCount: 3, updatedAt: daysAgo(2) },
  { id: "est-003", name: "Clinique Pasteur", type: "CLINIC", region: "Bamako", city: "Bamako", status: "ACTIVE", agentsCount: 2, devicesCount: 2, updatedAt: daysAgo(4) },
  { id: "est-004", name: "Pharmacie du Fleuve", type: "PHARMACY", region: "Kayes", city: "Kayes", status: "ACTIVE", agentsCount: 1, devicesCount: 1, updatedAt: daysAgo(6) },
  { id: "est-005", name: "Antenne AMO Ségou", type: "ANTENNA", region: "Ségou", city: "Ségou", status: "ACTIVE", agentsCount: 1, devicesCount: 1, updatedAt: daysAgo(8) },
  { id: "est-006", name: "Centre médical Sikasso", type: "CLINIC", region: "Sikasso", city: "Sikasso", status: "INACTIVE", agentsCount: 1, devicesCount: 1, updatedAt: daysAgo(14) },
  { id: "est-007", name: "Hôpital régional Mopti", type: "HOSPITAL", region: "Mopti", city: "Mopti", status: "ACTIVE", agentsCount: 1, devicesCount: 1, updatedAt: daysAgo(3) },
  { id: "est-008", name: "Antenne AMO Koulikoro", type: "ANTENNA", region: "Koulikoro", city: "Koulikoro", status: "INACTIVE", agentsCount: 0, devicesCount: 0, updatedAt: daysAgo(30) },
  { id: "est-009", name: "Pharmacie Kénédougou", type: "PHARMACY", region: "Sikasso", city: "Koutiala", status: "ACTIVE", agentsCount: 1, devicesCount: 1, updatedAt: daysAgo(5) },
];

export async function listEstablishments(query: ListQuery): Promise<PaginatedResponse<Establishment>> {
  const filtered = filterByStatus(
    filterByQuery(establishments, query.q, [(item) => item.name, (item) => item.region, (item) => item.city]),
    query.status,
  );
  return toPaginated(filtered, query.page, query.pageSize);
}

export async function getEstablishment(id: string): Promise<Establishment | undefined> {
  return establishments.find((item) => item.id === id);
}

export async function createEstablishment(input: EstablishmentInput): Promise<Establishment> {
  const establishment: Establishment = {
    ...input,
    id: `est-${crypto.randomUUID()}`,
    agentsCount: 0,
    devicesCount: 0,
    updatedAt: new Date().toISOString(),
  };
  establishments = [establishment, ...establishments];
  return establishment;
}

export async function updateEstablishment(id: string, input: EstablishmentInput): Promise<Establishment | undefined> {
  const current = await getEstablishment(id);
  if (!current) return undefined;
  const updated = { ...current, ...input, updatedAt: new Date().toISOString() };
  establishments = establishments.map((item) => (item.id === id ? updated : item));
  return updated;
}
