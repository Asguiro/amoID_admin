import { apiRequest } from "~/server/api/client.server";
import { ApiClientError } from "~/server/api/errors.server";
import type { Device, ListQuery, PaginatedResponse } from "~/types/admin";

function buildQuery(query: ListQuery & { agentId?: string }) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.agentId) params.set("agentId", query.agentId);
  return params;
}

export async function listDevices(
  query: ListQuery & { agentId?: string },
  accessToken: string,
): Promise<PaginatedResponse<Device>> {
  return apiRequest<PaginatedResponse<Device>>(
    `/admin/devices?${buildQuery(query)}`,
    { accessToken },
  );
}

export async function getDevice(
  id: string,
  accessToken: string,
): Promise<Device | undefined> {
  try {
    return await apiRequest<Device>(`/admin/devices/${id}`, { accessToken });
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Approuve un appareil PENDING côté API via restore (réactive / confirme).
 * Le motif reste obligatoire.
 */
export async function trustDevice(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Device | undefined> {
  if (!reason.trim()) throw new Error("Le motif d’approbation est obligatoire.");
  try {
    return await apiRequest<Device>(`/admin/devices/${id}/restore`, {
      method: "POST",
      accessToken,
      body: { reason },
    });
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function revokeDevice(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Device | undefined> {
  if (!reason.trim()) throw new Error("Le motif de révocation est obligatoire.");
  try {
    return await apiRequest<Device>(`/admin/devices/${id}/revoke`, {
      method: "POST",
      accessToken,
      body: { reason },
    });
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

/** Sync offline non branché Phase 1 — liste vide. */
export async function listPendingSyncDevices(
  _accessToken?: string,
): Promise<Device[]> {
  return [];
}

export function resetDevicesForTests() {
  // no-op
}
