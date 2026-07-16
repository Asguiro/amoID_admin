import { Link } from "react-router";
import clsx from "clsx";

import logoHorizontal from "~/assets/brand/amo-id-sante-logo-horizontal.svg";
import mark from "~/assets/icons/svg/amo-id-sante-mark.svg";

type BrandLogoVariant = "horizontal" | "mark" | "stacked";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  imgClassName?: string;
  to?: string | null;
  priority?: boolean;
}

export function BrandLogo({
  variant = "horizontal",
  className,
  imgClassName,
  to = "/dashboard",
  priority = false,
}: BrandLogoProps) {
  const src = variant === "mark" ? mark : logoHorizontal;
  const alt = "AMO ID Santé";

  const image = (
    <img
      src={src}
      alt={alt}
      className={clsx(
        variant === "mark" && "size-10",
        variant === "horizontal" && "h-10 w-auto",
        variant === "stacked" && "h-14 w-auto",
        imgClassName,
      )}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );

  if (to === null) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link
      to={to}
      className={clsx("inline-flex items-center focus-visible:rounded-lg", className)}
      aria-label="AMO ID Santé — Accueil"
    >
      {image}
    </Link>
  );
}
