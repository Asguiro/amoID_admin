interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  nested?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  nested = false,
}: EmptyStateProps) {
  return (
    <div
      className={
        nested
          ? "flex flex-col items-center justify-center gap-3 py-8 text-center"
          : "amo-card flex flex-col items-center justify-center gap-3 p-10 text-center"
      }
    >
      <h2 className="amo-display text-lg font-semibold text-secondary">{title}</h2>
      {description ? (
        <p className="max-w-md text-sm text-base-content/65">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
