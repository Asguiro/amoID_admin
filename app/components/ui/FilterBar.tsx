import clsx from "clsx";
import { SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
  activeFilterCount?: number;
  resetHref?: string;
  label?: string;
}

export function FilterBar({
  children,
  className,
  activeFilterCount = 0,
  resetHref,
  label = "Rechercher et filtrer",
}: FilterBarProps) {
  return (
    <div
      className={clsx(
        "amo-card rounded-3xl p-3 sm:p-4",
        className,
      )}
      role="search"
      aria-label={label}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
          <span>Recherche et filtres</span>
          {activeFilterCount > 0 ? (
            <span className="badge badge-primary badge-sm" aria-label={`${activeFilterCount} filtres actifs`}>
              {activeFilterCount}
            </span>
          ) : null}
        </div>
        {resetHref && activeFilterCount > 0 ? (
          <Link className="btn btn-ghost btn-sm rounded-xl" to={resetHref}>
            <X className="size-4" aria-hidden="true" />
            Réinitialiser
          </Link>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        {children}
      </div>
    </div>
  );
}
