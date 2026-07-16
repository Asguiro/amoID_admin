import clsx from "clsx";

interface LoadingStateProps {
  label?: string;
  className?: string;
  compact?: boolean;
}

export function LoadingState({
  label = "Chargement des données…",
  className,
  compact = false,
}: LoadingStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 text-center",
        compact ? "py-8" : "py-16",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-sm text-base-content/70">{label}</p>
      {!compact ? (
        <div className="mt-4 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
      ) : null}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Chargement du tableau de bord">
      <span className="sr-only">Chargement du tableau de bord…</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="skeleton h-80 rounded-3xl xl:col-span-2" />
        <div className="skeleton h-80 rounded-3xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      className="amo-card overflow-hidden rounded-3xl"
      role="status"
      aria-label="Chargement du tableau"
    >
      <span className="sr-only">Chargement du tableau…</span>
      <div className="flex h-12 items-center gap-6 border-b border-base-200 px-5">
        <div className="skeleton h-3 w-1/4" />
        <div className="skeleton h-3 w-1/5" />
        <div className="skeleton h-3 w-1/6" />
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex h-14 items-center gap-6 border-b border-base-200 px-5 last:border-0"
        >
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-4 w-1/5" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

