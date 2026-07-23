import { createCookieSessionStorage, redirect } from "react-router";

import type { AdminSessionUser } from "~/types/admin";

import { getServerEnv, isProduction } from "./env.server";

type SessionData = {
  user: AdminSessionUser;
  accessToken: string;
  refreshToken: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__amo_admin_session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [getServerEnv().SESSION_SECRET],
      secure: isProduction(),
      maxAge: 60 * 60 * 8,
    },
  });

export { getSession, commitSession, destroySession };

export async function getUserFromRequest(
  request: Request,
): Promise<AdminSessionUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("user") ?? null;
}

export async function getAccessTokenFromRequest(
  request: Request,
): Promise<string | null> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("accessToken") ?? null;
}

export async function requireAccessToken(request: Request): Promise<string> {
  const token = await getAccessTokenFromRequest(request);
  if (!token) {
    throw redirect(`/login?redirectTo=${encodeURIComponent(new URL(request.url).pathname)}`);
  }
  return token;
}

export async function createUserSession(
  user: AdminSessionUser,
  redirectTo: string,
  tokens: { accessToken: string; refreshToken: string },
) {
  const session = await getSession();
  session.set("user", user);
  session.set("accessToken", tokens.accessToken);
  session.set("refreshToken", tokens.refreshToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
