interface AuditTimelineItem {
  id: string;
  label: string;
  actor?: string;
  createdAt: string;
}

interface AuditTimelineProps {
  items: AuditTimelineItem[];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function AuditTimeline({ items }: AuditTimelineProps) {
  return (
    <ol className="relative space-y-0" aria-label="Historique d’audit">
      {items.map((item, index) => {
        const parsedDate = new Date(item.createdAt);
        const formattedDate = Number.isNaN(parsedDate.getTime())
          ? item.createdAt
          : dateFormatter.format(parsedDate);

        return (
          <li
            key={item.id}
            className={index < items.length - 1
              ? "relative grid grid-cols-[1.25rem_1fr] gap-3 pb-6"
              : "relative grid grid-cols-[1.25rem_1fr] gap-3"}
          >
            {index < items.length - 1 ? (
              <span
                className="absolute top-3 bottom-0 left-[0.34375rem] w-px bg-base-300"
                aria-hidden="true"
              />
            ) : null}
            <span
              className="relative mt-1 size-3 rounded-full border-2 border-primary bg-base-100"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-secondary">{item.label}</p>
              <p className="mt-1 text-xs text-base-content/55">
                {item.actor ? <span>{item.actor} · </span> : null}
                <time dateTime={item.createdAt}>{formattedDate}</time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
