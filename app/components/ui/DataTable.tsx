import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { EmptyState } from "./EmptyState";

interface TablePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: TablePagination;
  onPageChange?: (page: number) => void;
  buildPageHref?: (page: number) => string;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  emptyTitle = "Aucune donnée",
  emptyDescription = "Aucun résultat ne correspond aux critères sélectionnés.",
  pagination,
  onPageChange,
  buildPageHref,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const previousPage = pagination ? Math.max(1, pagination.page - 1) : 1;
  const nextPage = pagination
    ? Math.min(pagination.totalPages, pagination.page + 1)
    : 1;
  const hasPreviousPage = Boolean(pagination && pagination.page > 1);
  const hasNextPage = Boolean(
    pagination && pagination.page < pagination.totalPages,
  );

  const renderPaginationControl = (
    direction: "previous" | "next",
    targetPage: number,
    enabled: boolean,
  ) => {
    const label = direction === "previous" ? "Page précédente" : "Page suivante";
    const icon =
      direction === "previous" ? (
        <ChevronLeft className="size-4" aria-hidden="true" />
      ) : (
        <ChevronRight className="size-4" aria-hidden="true" />
      );
    const classes = "btn btn-sm btn-outline rounded-xl";

    if (buildPageHref && enabled) {
      return (
        <Link to={buildPageHref(targetPage)} className={classes} aria-label={label}>
          {icon}
        </Link>
      );
    }

    return (
      <button
        type="button"
        className={classes}
        onClick={() => onPageChange?.(targetPage)}
        disabled={!enabled || !onPageChange}
        aria-label={label}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={clsx("amo-card overflow-hidden rounded-3xl", className)}>
      <div className="max-w-full overflow-x-auto">
        <table className="table w-full">
          <thead className="sticky top-0 z-10 bg-base-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-base-300">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="h-12 bg-base-100 text-xs font-semibold tracking-wide text-base-content/60 uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="h-14 border-b border-base-200 transition-colors last:border-0 hover:bg-base-200/45"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Math.max(columns.length, 1)}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    nested
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 0 ? (
        <nav
          className="flex flex-wrap items-center justify-between gap-3 border-t border-base-200 px-4 py-3"
          aria-label="Pagination du tableau"
        >
          <p className="text-sm text-base-content/65">
            {pagination.totalItems} élément{pagination.totalItems > 1 ? "s" : ""}
            <span className="mx-2" aria-hidden="true">·</span>
            Page {pagination.page} sur {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            {renderPaginationControl("previous", previousPage, hasPreviousPage)}
            {renderPaginationControl("next", nextPage, hasNextPage)}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
