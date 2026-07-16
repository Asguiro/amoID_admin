import clsx from "clsx";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClass = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export function AppCard({
  children,
  className,
  flush = false,
  padding = "md",
}: AppCardProps) {
  return (
    <div
      className={clsx(
        flush ? "amo-card-flush" : "amo-card",
        paddingClass[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
