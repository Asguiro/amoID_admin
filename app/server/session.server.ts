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

export type RequestAuthState = {
  accessToken: string;
  setCookieHeader?: string;
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

const requestAuthCache = new WeakMap<Request, Promise<RequestAuthState>>();

function loginRedirect(request: Request): never {
  const url = new URL(request.url);
  const redirectTo = `${url.pathname}${url.search}`;
  throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      exp?: number;
    };
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token: string, skewSeconds = 60): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
  const env = getServerEnv();
  const response = await fetch(new URL("/admin/auth/refresh", env.API_URL), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("INVALID_REFRESH");
  }

  return (await response.json()) as RefreshResponse;
}

async function resolveRequestAuth(request: Request): Promise<RequestAuthState> {
  const session = await getSession(request.headers.get("Cookie"));
  const refreshToken = session.get("refreshToken");
  let accessToken = session.get("accessToken");

  if (!accessToken && !refreshToken) {
    loginRedirect(request);
  }

  if (!accessToken || isAccessTokenExpired(accessToken)) {
    if (!refreshToken) {
      loginRedirect(request);
    }

    try {
      const refreshed = await refreshTokens(refreshToken);
      session.set("accessToken", refreshed.accessToken);
      session.set("refreshToken", refreshed.refreshToken);
      accessToken = refreshed.accessToken;
      return {
        accessToken,
        setCookieHeader: await commitSession(session),
      };
    } catch {
      loginRedirect(request);
    }
  }

  return { accessToken: accessToken! };
}

export function invalidateRequestAuth(request: Request) {
  requestAuthCache.delete(request);
}

export async function ensureRequestAuth(
  request: Request,
): Promise<RequestAuthState> {
  const cached = requestAuthCache.get(request);
  if (cached) return cached;

  const pending = resolveRequestAuth(request);
  requestAuthCache.set(request, pending);
  return pending;
}

export function mergeSetCookieHeaders(
  ...headers: Array<string | undefined>
): string | undefined {
  const values = headers.filter(Boolean);
  if (!values.length) return undefined;
  return values.join(", ");
}

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
  const accessToken = session.get("accessToken");
  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return accessToken;
  }

  try {
    const auth = await ensureRequestAuth(request);
    return auth.accessToken;
  } catch (error) {
    if (error instanceof Response) throw error;
    return null;
  }
}

export async function requireAccessToken(request: Request): Promise<string> {
  const auth = await ensureRequestAuth(request);
  return auth.accessToken;
}

export async function getRequestAuthCookieHeader(
  request: Request,
): Promise<string | undefined> {
  const auth = await ensureRequestAuth(request);
  return auth.setCookieHeader;
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
