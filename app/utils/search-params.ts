import { z } from "zod";

import type { DashboardPeriod, ListQuery } from "~/types/admin";

const dashboardPeriodSchema = z.enum(["7d", "30d", "90d"]).default("7d");

export function parseDashboardSearchParams(searchParams: URLSearchParams): {
  period: DashboardPeriod;
  empty: boolean;
  forceError: boolean;
} {
  const parsed = dashboardPeriodSchema.safeParse(
    searchParams.get("period") ?? undefined,
  );

  return {
    period: parsed.success ? parsed.data : "7d",
    empty: searchParams.get("empty") === "1",
    forceError: searchParams.get("error") === "1",
  };
}

const listQuerySchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(10),
  status: z.string().optional(),
  sort: z.string().optional(),
  coverageStatus: z.string().optional(),
  dossierStatus: z.string().optional(),
  beneficiaryType: z.string().optional(),
  channel: z.string().optional(),
  decision: z.string().optional(),
  reason: z.string().optional(),
});

export function parseListSearchParams(
  searchParams: URLSearchParams,
): ListQuery {
  const raw = {
    q: searchParams.get("q") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    coverageStatus: searchParams.get("coverageStatus") ?? undefined,
    dossierStatus: searchParams.get("dossierStatus") ?? undefined,
    beneficiaryType: searchParams.get("beneficiaryType") ?? undefined,
    channel: searchParams.get("channel") ?? undefined,
    decision: searchParams.get("decision") ?? undefined,
    reason: searchParams.get("reason") ?? undefined,
  };
  const parsed = listQuerySchema.safeParse(raw);

  if (parsed.success) {
    return normalizeListQuery(parsed.data);
  }

  const page = z.coerce.number().int().min(1).safeParse(raw.page);
  const pageSize = z.coerce.number().int().min(5).max(100).safeParse(raw.pageSize);
  return normalizeListQuery({
    ...raw,
    page: page.success ? page.data : 1,
    pageSize: pageSize.success ? pageSize.data : 10,
  });
}

function normalizeListQuery(query: ListQuery): ListQuery {
  return {
    q: query.q?.trim() || undefined,
    page: query.page,
    pageSize: query.pageSize,
    status: query.status || undefined,
    sort: query.sort || undefined,
    coverageStatus: query.coverageStatus || undefined,
    dossierStatus: query.dossierStatus || undefined,
    beneficiaryType: query.beneficiaryType || undefined,
    channel: query.channel || undefined,
    decision: query.decision || undefined,
    reason: query.reason || undefined,
  };
}

const listQueryKeys: Array<keyof ListQuery> = [
  "q",
  "page",
  "pageSize",
  "status",
  "sort",
  "coverageStatus",
  "dossierStatus",
  "beneficiaryType",
  "channel",
  "decision",
  "reason",
];

export function buildListHref(
  basePath: string,
  query: ListQuery,
  changes: Partial<ListQuery> = {},
): string {
  const next = { ...query, ...changes };
  const params = new URLSearchParams();

  for (const key of listQueryKeys) {
    const value = next[key];
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
}

export function countActiveListFilters(query: ListQuery): number {
  return [
    query.q,
    query.status,
    query.sort,
    query.coverageStatus,
    query.dossierStatus,
    query.beneficiaryType,
    query.channel,
    query.decision,
    query.reason,
  ].filter(Boolean).length;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
} {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}
