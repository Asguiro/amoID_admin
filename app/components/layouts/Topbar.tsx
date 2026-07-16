import { Link } from "react-router";
import { Bell, Menu, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-[72px] items-center justify-between gap-4 bg-transparent px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-square h-11 w-11 rounded-2xl lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </label>
        <Link
          to="/dashboard"
          className="amo-display font-semibold text-secondary lg:hidden"
        >
          AMO ID
        </Link>

        <label className="relative hidden max-w-lg flex-1 md:block">
          <span className="sr-only">Rechercher</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-base-content/40"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Rechercher un agent, établissement, alerte…"
            className="amo-input h-11 border border-base-300/60 bg-base-100 pl-10 shadow-[0_4px_16px_rgb(11_27_51/0.04)]"
            disabled
            title="Recherche globale — à venir"
          />
        </label>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="btn btn-ghost btn-square h-11 w-11 rounded-2xl"
          aria-label="Notifications"
          disabled
          title="Notifications — à venir"
        >
          <Bell className="size-5 text-base-content/55" />
        </button>
      </div>
    </header>
  );
}
