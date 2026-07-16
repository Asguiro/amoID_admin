import type { Agent, AgentStatus, ListQuery, PaginatedResponse } from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

export type AgentInput = Pick<
  Agent,
  "displayName" | "email" | "role" | "status" | "establishmentId" | "establishmentName" | "region"
>;

const seed: Array<Omit<Agent, "lastActiveAt" | "createdAt"> & { lastSeen: number; created: number }> = [
  { id: "agt-001", displayName: "Aïssata Traoré", email: "aissata@amo.ml", role: "Agent d’enrôlement", status: "ACTIVE", establishmentId: "est-001", establishmentName: "Hôpital du Point G", region: "Bamako", lastSeen: 0, created: 180 },
  { id: "agt-002", displayName: "Moussa Diarra", email: "moussa@amo.ml", role: "Superviseur", status: "ACTIVE", establishmentId: "est-001", establishmentName: "Hôpital du Point G", region: "Bamako", lastSeen: 1, created: 220 },
  { id: "agt-003", displayName: "Fatoumata Koné", email: "fatoumata@amo.ml", role: "Agent de soins", status: "PENDING", establishmentId: "est-002", establishmentName: "CHU Gabriel Touré", region: "Bamako", lastSeen: 3, created: 5 },
  { id: "agt-004", displayName: "Oumar Coulibaly", email: "oumar@amo.ml", role: "Agent d’enrôlement", status: "ACTIVE", establishmentId: "est-002", establishmentName: "CHU Gabriel Touré", region: "Bamako", lastSeen: 2, created: 90 },
  { id: "agt-005", displayName: "Mariam Diallo", email: "mariam@amo.ml", role: "Agent de soins", status: "SUSPENDED", establishmentId: "est-003", establishmentName: "Clinique Pasteur", region: "Bamako", lastSeen: 30, created: 160 },
  { id: "agt-006", displayName: "Ibrahim Keïta", email: "ibrahim@amo.ml", role: "Pharmacien", status: "ACTIVE", establishmentId: "est-004", establishmentName: "Pharmacie du Fleuve", region: "Kayes", lastSeen: 1, created: 120 },
  { id: "agt-007", displayName: "Nana Sangaré", email: "nana@amo.ml", role: "Superviseur", status: "ACTIVE", establishmentId: "est-005", establishmentName: "Antenne AMO Ségou", region: "Ségou", lastSeen: 0, created: 200 },
  { id: "agt-008", displayName: "Bakary Sidibé", email: "bakary@amo.ml", role: "Agent d’enrôlement", status: "ARCHIVED", establishmentId: "est-006", establishmentName: "Centre médical Sikasso", region: "Sikasso", lastSeen: 80, created: 300 },
  { id: "agt-009", displayName: "Aminata Touré", email: "aminata@amo.ml", role: "Agent de soins", status: "ACTIVE", establishmentId: "est-007", establishmentName: "Hôpital régional Mopti", region: "Mopti", lastSeen: 4, created: 60 },
  { id: "agt-010", displayName: "Modibo Maïga", email: "modibo@amo.ml", role: "Agent d’enrôlement", status: "ACTIVE", establishmentId: "est-003", establishmentName: "Clinique Pasteur", region: "Bamako", lastSeen: 1, created: 70 },
  { id: "agt-011", displayName: "Kadidia Dembélé", email: "kadidia@amo.ml", role: "Pharmacienne", status: "PENDING", establishmentId: "est-009", establishmentName: "Pharmacie Kénédougou", region: "Sikasso", lastSeen: 7, created: 8 },
];

let agents: Agent[] = seed.map(({ lastSeen, created, ...agent }) => ({
  ...agent,
  lastActiveAt: daysAgo(lastSeen),
  createdAt: daysAgo(created),
}));

export async function listAgents(query: ListQuery & { establishmentId?: string }): Promise<PaginatedResponse<Agent>> {
  let filtered = filterByStatus(
    filterByQuery(agents, query.q, [(item) => item.displayName, (item) => item.email, (item) => item.establishmentName]),
    query.status,
  );
  if (query.establishmentId) filtered = filtered.filter((item) => item.establishmentId === query.establishmentId);
  return toPaginated(filtered, query.page, query.pageSize);
}

export async function getAgent(id: string): Promise<Agent | undefined> {
  return agents.find((item) => item.id === id);
}

export async function createAgent(input: AgentInput): Promise<Agent> {
  const now = new Date().toISOString();
  const agent: Agent = { ...input, id: `agt-${crypto.randomUUID()}`, lastActiveAt: now, createdAt: now };
  agents = [agent, ...agents];
  return agent;
}

export async function updateAgent(id: string, input: AgentInput): Promise<Agent | undefined> {
  const current = await getAgent(id);
  if (!current) return undefined;
  const updated = { ...current, ...input };
  agents = agents.map((item) => (item.id === id ? updated : item));
  return updated;
}

async function setAgentStatus(id: string, status: AgentStatus, _reason: string): Promise<Agent | undefined> {
  const current = await getAgent(id);
  if (!current) return undefined;
  const updated = { ...current, status };
  agents = agents.map((item) => (item.id === id ? updated : item));
  return updated;
}

export function suspendAgent(id: string, reason: string) {
  return setAgentStatus(id, "SUSPENDED", reason);
}

export function reactivateAgent(id: string, reason: string) {
  return setAgentStatus(id, "ACTIVE", reason);
}
