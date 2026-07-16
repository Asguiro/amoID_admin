import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  trendPercent: number;
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
  icon: Icon,
  featured = false,
  tint = "mint",
  className,
}: MetricCardProps) {
  const positive = trendPercent >= 0;

  return (
    <article
      className={clsx(
        "relative overflow-hidden rounded-3xl p-5",
        featured ? "amo-metric-featured" : clsx("amo-card border-0", tintClass[tint]),
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

      <p
        className={clsx(
          "text-sm font-medium",
          featured ? "text-white/80" : "text-base-content/60",
        )}
      >
        {label}
      </p>

      <p
        className={clsx(
          "amo-display mt-2 text-3xl font-semibold tracking-tight",
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
      </p>

      <p
        className={clsx(
          "mt-3 inline-flex items-center gap-1 text-sm font-medium",
          featured
            ? "text-white/90"
            : positive
              ? "text-success"
              : "text-error",
        )}
      >
        {positive ? (
          <TrendingUp className="size-4" aria-hidden />
        ) : (
          <TrendingDown className="size-4" aria-hidden />
        )}
        {positive ? "+" : ""}
        {trendPercent.toFixed(1)} % vs période précédente
      </p>
    </article>
  );
}
