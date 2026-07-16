import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Lien de retour — toujours affiché à gauche */
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  backTo,
  backLabel = "Retour",
  actions,
  badge,
}: PageHeaderProps) {
  return (
    <header className="mb-7 space-y-4">
      {(backTo || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {backTo ? (
              <Link
                to={backTo}
                className="btn btn-ghost h-10 gap-2 rounded-xl px-3 text-base-content/70 hover:bg-base-100 hover:text-secondary"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                {backLabel}
              </Link>
            ) : null}
          </div>
          {actions ? (
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="amo-display text-2xl font-semibold tracking-tight text-secondary sm:text-[1.75rem]">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-base-content/65">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
