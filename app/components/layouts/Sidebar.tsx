import { Form, NavLink } from "react-router";
import clsx from "clsx";
import { LogOut } from "lucide-react";

import { BrandLogo } from "~/components/brand/BrandLogo";
import { navigationItems } from "~/config/navigation";
import { hasAnyPermission } from "~/config/permissions";
import type { AdminSessionUser } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

interface SidebarProps {
  user: AdminSessionUser;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar({ user }: SidebarProps) {
  const visibleItems = navigationItems.filter((item) =>
    hasAnyPermission(user.permissions, item.permissions),
  );

  return (
    <aside className="flex h-full w-[272px] flex-col bg-base-100">
      <div className="px-5 pt-6 pb-4">
        <BrandLogo variant="horizontal" imgClassName="h-9" />
        <p className="mt-3 text-xs font-medium tracking-wide text-base-content/45 uppercase">
          Administration
        </p>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 pb-4"
        aria-label="Navigation principale"
      >
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      "amo-nav-item flex items-center gap-3 px-3 py-2.5 text-sm",
                      isActive && "amo-nav-item-active",
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <div className="rounded-2xl border border-base-300/80 bg-base-200/60 p-3 shadow-[0_8px_24px_rgb(11_27_51/0.05)]">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-content"
              aria-hidden
            >
              {initials(user.displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-secondary">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-base-content/55">{user.role}</p>
            </div>
          </div>
          <Form method="post" action="/logout" className="mt-3">
            <CsrfField />
            <button
              type="submit"
              className="btn btn-ghost btn-sm h-9 w-full justify-start gap-2 rounded-xl text-base-content/70"
            >
              <LogOut className="size-4" aria-hidden />
              Déconnexion
            </button>
          </Form>
        </div>
      </div>
    </aside>
  );
}
