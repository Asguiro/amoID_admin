import { redirect } from "react-router";

import { LoginPage } from "~/pages/auth/LoginPage";
import {
  loginAction,
  loginLoader,
} from "~/server/auth/auth.loader.server";
import type { Route } from "./+types/login";

export async function loader({ request }: Route.LoaderArgs) {
  const data = await loginLoader(request);
  if (data.user) {
    throw redirect("/dashboard");
  }

  const url = new URL(request.url);
  return {
    demoAccounts: data.demoAccounts,
    redirectTo: url.searchParams.get("redirectTo") ?? "/dashboard",
  };
}

export async function action({ request }: Route.ActionArgs) {
  return loginAction(request);
}

export function meta() {
  return [{ title: "Connexion — AMO ID Admin" }];
}

export default function LoginRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <LoginPage
      demoAccounts={loaderData.demoAccounts}
      redirectTo={loaderData.redirectTo}
      error={actionData && "error" in actionData ? actionData.error : undefined}
    />
  );
}
