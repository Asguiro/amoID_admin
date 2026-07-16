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
});

export function parseListSearchParams(
  searchParams: URLSearchParams,
): ListQuery {
  const parsed = listQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  if (!parsed.success) {
    return { page: 1, pageSize: 10 };
  }

  return {
    q: parsed.data.q?.trim() || undefined,
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
    status: parsed.data.status || undefined,
    sort: parsed.data.sort || undefined,
  };
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
