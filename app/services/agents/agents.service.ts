import { apiRequest } from "~/server/api/client.server";
import type {
  Agent,
  AgentStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";
import type { AgentActivityItem } from "./agent-activity";

export type AgentInput = Pick<
  Agent,
  | "displayName"
  | "email"
  | "role"
  | "status"
  | "establishmentId"
  | "establishmentName"
  | "region"
> & {
  password?: string;
};

function buildQuery(query: ListQuery & { establishmentId?: string }) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.establishmentId) params.set("establishmentId", query.establishmentId);
  return params;
}

export async function listAgents(
  query: ListQuery & { establishmentId?: string },
  accessToken: string,
): Promise<PaginatedResponse<Agent>> {
  return apiRequest<PaginatedResponse<Agent>>(
    `/admin/agents?${buildQuery(query)}`,
    { accessToken },
  );
}

export async function getAgent(
  id: string,
  accessToken: string,
): Promise<Agent | undefined> {
  try {
    return await apiRequest<Agent>(`/admin/agents/${id}`, { accessToken });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function createAgent(
  input: AgentInput,
  accessToken: string,
): Promise<Agent> {
  const password = input.password?.trim() || "Demo@2026!";
  return apiRequest<Agent>("/admin/agents", {
    method: "POST",
    accessToken,
    body: {
      email: input.email,
      displayName: input.displayName,
      password,
      role: input.role,
      establishmentId: input.establishmentId,
    },
  });
}

export async function updateAgent(
  id: string,
  input: AgentInput,
  accessToken: string,
): Promise<Agent | undefined> {
  try {
    return await apiRequest<Agent>(`/admin/agents/${id}`, {
      method: "PATCH",
      accessToken,
      body: {
        displayName: input.displayName,
        role: input.role,
        establishmentId: input.establishmentId,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function suspendAgent(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Agent | undefined> {
  try {
    return await apiRequest<Agent>(`/admin/agents/${id}/suspend`, {
      method: "POST",
      accessToken,
      body: { reason },
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function reactivateAgent(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Agent | undefined> {
  try {
    return await apiRequest<Agent>(`/admin/agents/${id}/reactivate`, {
      method: "POST",
      accessToken,
      body: { reason },
    });
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function listAgentActivity(
  id: string,
  accessToken: string,
): Promise<AgentActivityItem[]> {
  const res = await apiRequest<PaginatedResponse<AgentActivityItem>>(
    `/admin/agents/${id}/activity?page=1&pageSize=20`,
    { accessToken },
  );
  return res.items.map((item) => ({
    ...item,
    createdAt:
      typeof item.createdAt === "string"
        ? item.createdAt
        : new Date(String(item.createdAt)).toISOString(),
  }));
}

/** @deprecated mock reset — no-op after API wiring */
export function resetAgentsForTests() {
  // no-op
}

export type { AgentStatus };
export type { AgentActivityItem } from "./agent-activity";
