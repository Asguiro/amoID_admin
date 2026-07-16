import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  leading?: React.ReactNode;
  /** Lien de retour — toujours affiché à gauche */
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  leading,
  backTo,
  backLabel = "Retour",
  actions,
  badge,
}: PageHeaderProps) {
  return (
    <header className="mb-7">
      {backTo ? (
        <Link
          to={backTo}
          className="btn btn-ghost -ml-3 mb-3 h-9 gap-2 rounded-xl px-3 text-sm font-medium text-base-content/65 hover:bg-white hover:text-secondary"
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          <span>{backLabel}</span>
        </Link>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {leading ? <div className="shrink-0">{leading}</div> : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="amo-display text-2xl leading-tight font-semibold tracking-tight text-secondary sm:text-[1.75rem]">
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
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
