import clsx from "clsx";

interface ChartCardProps {
  title: string;
  description?: string;
  summary: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  summary,
  children,
  className,
}: ChartCardProps) {
  return (
    <section
      className={clsx("amo-card rounded-3xl p-5 sm:p-6", className)}
      aria-label={title}
    >
      <div className="mb-5">
        <h2 className="amo-display text-lg font-semibold text-secondary">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-base-content/65">{description}</p>
        ) : null}
      </div>
      <div aria-hidden="true">{children}</div>
      <p className="sr-only">{summary}</p>
    </section>
  );
}
