import { apiRequest } from "~/server/api/client.server";
import type { AuditEvent, ListQuery, PaginatedResponse } from "~/types/admin";

type ApiAuditLog = {
  id: string;
  createdAt: string;
  actorId?: string | null;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: string | null;
  result?: string;
  reason?: string | null;
  correlationId: string;
};

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404,
  );
}

function buildQuery(query: ListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("action", query.status);
  return params;
}

function mapResult(result?: string): AuditEvent["status"] {
  const normalized = (result ?? "OK").toUpperCase();
  if (normalized === "DENIED" || normalized === "FORBIDDEN") return "DENIED";
  if (
    normalized === "FAILED" ||
    normalized === "ERROR" ||
    normalized === "KO"
  ) {
    return "FAILED";
  }
  return "SUCCESS";
}

function mapEvent(row: ApiAuditLog): AuditEvent {
  return {
    id: row.id,
    action: row.action,
    actor: row.actorId ?? row.actorRole ?? "—",
    target: row.entityId ?? row.reason ?? "—",
    scope: row.entityType ?? "—",
    status: mapResult(row.result),
    createdAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : new Date(String(row.createdAt)).toISOString(),
    correlationId: row.correlationId,
  };
}

export async function listAuditEvents(
  query: ListQuery,
  accessToken: string,
): Promise<PaginatedResponse<AuditEvent>> {
  const res = await apiRequest<PaginatedResponse<ApiAuditLog>>(
    `/admin/audit-logs?${buildQuery(query)}`,
    { accessToken },
  );
  return {
    ...res,
    items: res.items.map(mapEvent),
  };
}

export async function getAuditEvent(
  id: string,
  accessToken: string,
): Promise<AuditEvent | undefined> {
  try {
    const row = await apiRequest<ApiAuditLog>(`/admin/audit-logs/${id}`, {
      accessToken,
    });
    return mapEvent({
      ...row,
      createdAt:
        typeof row.createdAt === "string"
          ? row.createdAt
          : new Date(String(row.createdAt)).toISOString(),
      correlationId: row.correlationId ?? "—",
    });
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}
