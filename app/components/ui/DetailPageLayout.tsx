import clsx from "clsx";

export function DetailPageLayout({
  children,
  aside,
  className,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "grid min-w-0 gap-6",
        aside && "xl:grid-cols-[minmax(0,1fr)_22rem]",
        className,
      )}
    >
      <div className="min-w-0 space-y-6">{children}</div>
      {aside ? <aside className="min-w-0 space-y-6">{aside}</aside> : null}
    </div>
  );
}
