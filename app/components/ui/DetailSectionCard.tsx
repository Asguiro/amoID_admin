import clsx from "clsx";

import { AppCard } from "./AppCard";

export function DetailSectionCard({
  title,
  description,
  badge,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppCard padding="lg" className={className}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="amo-display text-lg font-semibold text-secondary">
              {title}
            </h2>
            {badge}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-base-content/55">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={clsx("min-w-0")}>{children}</div>
    </AppCard>
  );
}
