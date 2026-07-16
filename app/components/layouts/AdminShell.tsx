import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { CsrfProvider } from "~/components/security/CsrfProvider";
import { PendingOutlet } from "~/components/navigation/PendingOutlet";
import type { AdminSessionUser } from "~/types/admin";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AdminShellProps {
  user: AdminSessionUser;
  csrfToken: string;
  alertCount?: number;
}

export function AdminShell({
  user,
  csrfToken,
  alertCount = 0,
}: AdminShellProps) {
  const contentRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <CsrfProvider token={csrfToken}>
      <div className="drawer h-dvh overflow-hidden lg:drawer-open">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex h-dvh min-h-0 flex-col overflow-hidden bg-base-200">
          <Topbar alertCount={alertCount} />
          <main
            ref={contentRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <div className="mx-auto w-full max-w-[1600px] px-4 pt-6 pb-8 sm:px-6 lg:px-8">
              <PendingOutlet />
            </div>
          </main>
        </div>
        <div className="drawer-side z-40 h-dvh">
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
