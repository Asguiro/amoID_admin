import type { Pagination } from "~/types/admin";
import { paginateItems } from "~/utils/search-params";

export function filterByQuery<T>(
  items: T[],
  q: string | undefined,
  fields: Array<(item: T) => string>,
): T[] {
  if (!q) return items;
  const needle = q.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => field(item).toLowerCase().includes(needle)),
  );
}

export function filterByStatus<T extends { status: string }>(
  items: T[],
  status: string | undefined,
): T[] {
  if (!status) return items;
  return items.filter((item) => item.status === status);
}

export function toPaginated<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; pagination: Pagination; generatedAt: string } {
  const result = paginateItems(items, page, pageSize);
  return {
    ...result,
    generatedAt: new Date().toISOString(),
  };
}

export function daysAgo(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}
