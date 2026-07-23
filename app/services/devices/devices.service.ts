import { apiRequest } from "~/server/api/client.server";
import { ApiClientError } from "~/server/api/errors.server";
import type {
  Device,
  DeviceStats,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";

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

export async function getDeviceStats(
  accessToken: string,
): Promise<DeviceStats> {
  return apiRequest<DeviceStats>("/admin/devices/stats", { accessToken });
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

export async function enrollDevice(
  input: {
    deviceId: string;
    agentId: string;
    platform: string;
    label?: string;
    fingerprint?: string;
    establishmentId?: string;
  },
  accessToken: string,
): Promise<Device> {
  return apiRequest<Device>("/admin/devices", {
    method: "POST",
    accessToken,
    body: input,
  });
}

/** Approuve un appareil PENDING via /approve (device.trust). */
export async function trustDevice(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Device | undefined> {
  if (!reason.trim()) throw new Error("Le motif d’approbation est obligatoire.");
  try {
    return await apiRequest<Device>(`/admin/devices/${id}/approve`, {
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

export async function restoreDevice(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Device | undefined> {
  if (!reason.trim()) throw new Error("Le motif de restauration est obligatoire.");
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

export async function listPendingSyncDevices(
  accessToken: string,
): Promise<Device[]> {
  try {
    return await apiRequest<Device[]>("/admin/devices/pending-sync", {
      accessToken,
    });
  } catch {
    return [];
  }
}

export function resetDevicesForTests() {
  // no-op
}
