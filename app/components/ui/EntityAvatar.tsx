import clsx from "clsx";
import { Building2, Cpu, UserRound } from "lucide-react";

type EntityAvatarKind = "person" | "establishment" | "device";

const kindIcon = {
  person: UserRound,
  establishment: Building2,
  device: Cpu,
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function EntityAvatar({
  name,
  src,
  kind = "person",
  size = "lg",
  className,
}: {
  name: string;
  src?: string;
  kind?: EntityAvatarKind;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const Icon = kindIcon[kind];
  const initials = getInitials(name);
  const sizeClass = size === "md" ? "size-12" : size === "xl" ? "size-24" : "size-16";

  return (
    <div className={clsx("avatar", !src && "avatar-placeholder", className)}>
      <div
        className={clsx(
          sizeClass,
          "rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15",
        )}
      >
        {src ? (
          <img src={src} alt={`Portrait de ${name}`} className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-semibold">
            {initials || <Icon className="size-1/2" aria-hidden="true" />}
          </span>
        )}
      </div>
    </div>
  );
}
