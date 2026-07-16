import { createCookieSessionStorage } from "react-router";
import { randomBytes } from "node:crypto";

import { getServerEnv, isProduction } from "~/server/env.server";

type CsrfSessionData = {
  csrfToken: string;
};

const csrfStorage = createCookieSessionStorage<CsrfSessionData>({
  cookie: {
    name: "__amo_admin_csrf",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [getServerEnv().SESSION_SECRET],
    secure: isProduction(),
    maxAge: 60 * 60 * 8,
  },
});

export async function ensureCsrfToken(request: Request): Promise<{
  token: string;
  setCookieHeader?: string;
}> {
  const session = await csrfStorage.getSession(request.headers.get("Cookie"));
  let token = session.get("csrfToken");
  let setCookieHeader: string | undefined;

  if (!token) {
    token = randomBytes(32).toString("hex");
    session.set("csrfToken", token);
    setCookieHeader = await csrfStorage.commitSession(session);
  }

  return { token, setCookieHeader };
}

export async function requireCsrfToken(request: Request): Promise<void> {
  const session = await csrfStorage.getSession(request.headers.get("Cookie"));
  const expected = session.get("csrfToken");
  const formData = await request.clone().formData();
  const provided =
    formData.get("_csrf")?.toString() ??
    request.headers.get("X-CSRF-Token") ??
    "";

  if (!expected || !provided || expected !== provided) {
    throw Response.json(
      {
        message: "Jeton CSRF invalide ou manquant.",
        code: "CSRF_INVALID",
        correlationId: crypto.randomUUID(),
      },
      { status: 403 },
    );
  }
}
