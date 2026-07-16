import { Outlet, useNavigation } from "react-router";

import { LoadingState } from "~/components/ui/LoadingState";

export function PendingOutlet() {
  const navigation = useNavigation();
  const isPending = navigation.state === "loading";

  return (
    <div
      className="amo-pending-outlet"
      data-pending={isPending ? "true" : "false"}
    >
      {isPending ? <div className="amo-pending-bar" aria-hidden /> : null}
      {isPending ? (
        <div className="relative z-[2]">
          <LoadingState label="Mise à jour de la vue…" />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
