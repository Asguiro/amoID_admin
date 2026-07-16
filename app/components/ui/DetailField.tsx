interface DetailFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
}

export function DetailField({
  label,
  children,
  className,
  mono = false,
}: DetailFieldProps) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
        {label}
      </dt>
      <dd
        className={`mt-1.5 text-sm font-medium text-secondary ${mono ? "font-mono text-xs" : ""}`}
      >
        {children}
      </dd>
    </div>
  );
}

interface DetailGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function DetailGrid({ children, columns = 2 }: DetailGridProps) {
  return (
    <dl
      className={
        columns === 3
          ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-5 sm:grid-cols-2"
      }
    >
      {children}
    </dl>
  );
}
