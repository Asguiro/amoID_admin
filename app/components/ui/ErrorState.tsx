interface ErrorStateProps {
  title?: string;
  message: string;
  correlationId?: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title = "Impossible de charger les données",
  message,
  correlationId,
  action,
}: ErrorStateProps) {
  return (
    <div
      className="amo-card border-error/30 p-8"
      role="alert"
      aria-live="assertive"
    >
      <h2 className="text-lg font-semibold text-error">{title}</h2>
      <p className="mt-2 text-sm text-base-content/80">{message}</p>
      {correlationId ? (
        <p className="mt-3 text-xs text-base-content/50">
          Réf. technique : {correlationId}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
