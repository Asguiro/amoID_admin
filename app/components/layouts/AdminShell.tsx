import { CsrfProvider } from "~/components/security/CsrfProvider";
import { PendingOutlet } from "~/components/navigation/PendingOutlet";
import type { AdminSessionUser } from "~/types/admin";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AdminShellProps {
  user: AdminSessionUser;
  csrfToken: string;
}

export function AdminShell({ user, csrfToken }: AdminShellProps) {
  return (
    <CsrfProvider token={csrfToken}>
      <div className="drawer lg:drawer-open">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex min-h-screen flex-col bg-base-200">
          <Topbar />
          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-8 sm:px-6 lg:px-8">
            <PendingOutlet />
          </main>
        </div>
        <div className="drawer-side z-40">
          <label
            htmlFor="admin-drawer"
            aria-label="Fermer le menu"
            className="drawer-overlay"
          />
          <Sidebar user={user} />
        </div>
      </div>
    </CsrfProvider>
  );
}
