import { Link } from "react-router";
import { Bell, Menu } from "lucide-react";

export function Topbar({
  alertCount = 0,
}: {
  alertCount?: number;
}) {
  return (
    <header className="relative z-30 flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-base-300/70 bg-white px-4 shadow-[0_1px_12px_rgb(11_27_51/0.04)] sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-square h-11 w-11 rounded-2xl hover:bg-base-200 lg:hidden"
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
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          to="/alerts?status=NEW"
          className="btn btn-ghost btn-square relative h-11 w-11 rounded-2xl hover:bg-base-200"
          aria-label={
            alertCount > 0
              ? `Alertes non lues — ${alertCount}`
              : "Aucune alerte non lue"
          }
          title="Alertes non lues"
        >
          <Bell className="size-5 text-base-content/55" />
          {alertCount > 0 ? (
            <span className="badge badge-error badge-xs absolute top-2 right-2">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
