import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  trendPercent: number;
  trendIntent?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  featured?: boolean;
  tint?: "mint" | "gold" | "sky" | "rose";
  className?: string;
}

const tintClass = {
  mint: "bg-[#E8F5EF]",
  gold: "bg-[#F8F1DE]",
  sky: "bg-[#EAF1FB]",
  rose: "bg-[#F8EDED]",
} as const;

export function MetricCard({
  label,
  value,
  unit,
  trendPercent,
  trendIntent,
  icon: Icon,
  featured = false,
  tint = "mint",
  className,
}: MetricCardProps) {
  const positive = trendPercent >= 0;
  const intent = trendIntent ?? (positive ? "positive" : "negative");
  const trendText =
    intent === "positive"
      ? "Évolution favorable"
      : intent === "negative"
        ? "Évolution à surveiller"
        : "Évolution neutre";

  return (
    <article
      className={clsx(
        "stat relative min-w-0 overflow-hidden rounded-3xl p-5",
        featured ? "amo-metric-featured" : clsx("amo-card border-0", tintClass[tint]),
        featured && "amo-pattern-surface",
        className,
      )}
    >
      {Icon ? (
        <Icon
          className={clsx(
            "pointer-events-none absolute -right-2 -bottom-2 size-24 opacity-[0.12]",
            featured ? "text-white" : "text-primary",
          )}
          aria-hidden
        />
      ) : null}

      <dl className="relative z-[1]">
      <dt
        className={clsx(
          "stat-title whitespace-normal text-sm font-medium",
          featured ? "text-white/80" : "text-base-content/60",
        )}
      >
        {label}
      </dt>

      <dd
        className={clsx(
          "stat-value amo-display mt-2 whitespace-normal text-3xl font-semibold tracking-tight",
          featured ? "text-white" : "text-secondary",
        )}
      >
        {value.toLocaleString("fr-FR")}
        {unit ? (
          <span
            className={clsx(
              "ml-1 text-base font-normal",
              featured ? "text-white/80" : "text-base-content/60",
            )}
          >
            {unit}
          </span>
        ) : null}
      </dd>

      <dd
        className={clsx(
          "stat-desc mt-3 inline-flex whitespace-normal items-center gap-1 text-sm font-medium",
          featured
            ? "text-white/90"
            : intent === "positive"
              ? "text-success"
              : intent === "negative"
                ? "text-error"
                : "text-base-content/60",
        )}
      >
        {positive ? (
          <TrendingUp className="size-4" aria-hidden />
        ) : (
          <TrendingDown className="size-4" aria-hidden />
        )}
        {positive ? "+" : ""}
        {trendPercent.toFixed(1)} % · {trendText}
      </dd>
      </dl>
    </article>
  );
}
