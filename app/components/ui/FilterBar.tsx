import clsx from "clsx";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={clsx(
        "amo-card flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:p-4",
        className,
      )}
      role="search"
    >
      {children}
    </div>
  );
}
