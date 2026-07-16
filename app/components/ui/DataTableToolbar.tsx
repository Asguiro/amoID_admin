import clsx from "clsx";

interface DataTableToolbarProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DataTableToolbar({
  title,
  children,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-between gap-4",
        className,
      )}
    >
      {title ? (
        <h2 className="amo-display text-lg font-semibold text-secondary">{title}</h2>
      ) : null}
      <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
        {children}
      </div>
    </div>
  );
}
