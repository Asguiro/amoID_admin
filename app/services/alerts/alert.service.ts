import { apiRequest } from "~/server/api/client.server";
import type {
  AlertDetail,
  AlertItem,
  AlertStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";

const ALLOWED_TRANSITIONS: Record<AlertStatus, readonly AlertStatus[]> = {
  NEW: ["ASSIGNED"],
  ASSIGNED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["NEEDS_INFORMATION", "CONFIRMED", "DISMISSED", "ESCALATED"],
  NEEDS_INFORMATION: ["UNDER_REVIEW"],
  CONFIRMED: ["CLOSED"],
  DISMISSED: ["CLOSED"],
  ESCALATED: ["CLOSED"],
  CLOSED: [],
};

export function canTransitionAlertStatus(
  from: AlertStatus,
  to: AlertStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertAlertStatusTransition(
  from: AlertStatus,
  to: AlertStatus,
): void {
  if (!canTransitionAlertStatus(from, to)) {
    throw new Error(`Transition d’alerte invalide : ${from} → ${to}.`);
  }
}

type ApiAlert = {
  id: string;
  type?: string;
  title: string;
  severity: AlertItem["severity"];
  status: AlertStatus;
  establishmentName?: string;
  assigneeName?: string;
  assignee?: string;
  comments?: unknown;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  updatedAt: string;
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
  if (query.status) params.set("status", query.status);
  return params;
}

function mapComments(raw: unknown): AlertDetail["comments"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    if (!item || typeof item !== "object") {
      return {
        id: `comment-${index}`,
        body: String(item),
        actor: "—",
        createdAt: new Date().toISOString(),
      };
    }
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id ?? `comment-${index}`),
      body: String(row.body ?? row.message ?? ""),
      actor: String(row.actor ?? row.by ?? "—"),
      createdAt: String(row.createdAt ?? row.at ?? new Date().toISOString()),
    };
  });
}

function mapAlert(a: ApiAlert): AlertDetail {
  return {
    id: a.id,
    title: a.title,
    severity: a.severity,
    status: a.status,
    assignee: a.assigneeName ?? a.assignee,
    establishmentName: a.establishmentName,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    description: a.type ? `Type : ${a.type}` : "Signal de fraude / conformité.",
    timeline: [
      {
        id: `${a.id}-created`,
        label: "Alerte créée",
        actor: "Système",
        createdAt: a.createdAt,
      },
      ...(a.assigneeName || a.assignee
        ? [
            {
              id: `${a.id}-assigned`,
              label: `Affectée à ${a.assigneeName ?? a.assignee}`,
              actor: "Supervision",
              createdAt: a.updatedAt,
            },
          ]
        : []),
    ],
    comments: mapComments(a.comments),
  };
}

export async function listAlerts(
  query: ListQuery,
  accessToken: string,
): Promise<PaginatedResponse<AlertItem>> {
  const res = await apiRequest<PaginatedResponse<ApiAlert>>(
    `/admin/alerts?${buildQuery(query)}`,
    { accessToken },
  );
  return {
    ...res,
    items: res.items.map((item) => {
      const detail = mapAlert(item);
      const { description: _d, timeline: _t, comments: _c, ...listItem } = detail;
      return listItem;
    }),
  };
}

export async function getAlertDetail(
  id: string,
  accessToken: string,
): Promise<AlertDetail | undefined> {
  try {
    const item = await apiRequest<ApiAlert>(`/admin/alerts/${id}`, {
      accessToken,
    });
    return mapAlert(item);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

export async function assignAlert(
  id: string,
  assignee: string,
  accessToken: string,
): Promise<AlertDetail> {
  if (!assignee.trim()) throw new Error("Le nom de l’analyste est obligatoire.");
  const item = await apiRequest<ApiAlert>(`/admin/alerts/${id}/assign`, {
    method: "POST",
    accessToken,
    body: { assigneeId: assignee.trim() },
  });
  return mapAlert(item);
}

export async function addAlertComment(
  id: string,
  body: string,
  accessToken: string,
): Promise<AlertDetail> {
  if (!body.trim()) throw new Error("Le commentaire ne peut pas être vide.");
  const item = await apiRequest<ApiAlert>(`/admin/alerts/${id}/comment`, {
    method: "POST",
    accessToken,
    body: { message: body.trim() },
  });
  return mapAlert(item);
}

export async function updateAlertStatus(
  id: string,
  status: AlertStatus,
  reason: string,
  accessToken: string,
): Promise<AlertDetail> {
  if (!reason.trim()) throw new Error("Le motif de la décision est obligatoire.");
  const current = await getAlertDetail(id, accessToken);
  if (!current) throw new Error("Alerte introuvable.");
  assertAlertStatusTransition(current.status, status);
  const item = await apiRequest<ApiAlert>(`/admin/alerts/${id}/change-status`, {
    method: "POST",
    accessToken,
    body: { status },
  });
  return mapAlert(item);
}
