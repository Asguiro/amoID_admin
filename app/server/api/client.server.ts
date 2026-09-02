import { redirect } from "react-router";

import { getServerEnv } from "~/server/env.server";
import {
  ensureRequestAuth,
  getSession,
  commitSession,
  invalidateRequestAuth,
} from "~/server/session.server";

import { ApiClientError, createCorrelationId } from "./errors.server";

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  accessToken?: string;
  request?: Request;
}

/**
 * Server-only HTTP client for the NestJS API.
 * Phase 0 mostly uses mocks via services; this client is ready for real calls.
 */
async function refreshSessionTokens(request: Request): Promise<string | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const refreshToken = session.get("refreshToken");
  if (!refreshToken) return null;

  const response = await fetch(
    new URL("/admin/auth/refresh", getServerEnv().API_URL),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  session.set("accessToken", payload.accessToken);
  session.set("refreshToken", payload.refreshToken);
  invalidateRequestAuth(request);
  await commitSession(session);
  return payload.accessToken;
}

async function executeApiRequest<T>(
  path: string,
  options: ApiRequestOptions,
  accessToken?: string,
): Promise<T> {
  const env = getServerEnv();
  const correlationId = createCorrelationId();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  headers.set("X-Correlation-Id", correlationId);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(new URL(path, env.API_URL), {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let message = response.statusText || "Erreur API";
    let code = `HTTP_${response.status}`;
    let fieldErrors: Record<string, string[]> | undefined;

    try {
      const payload = (await response.json()) as {
        message?: string;
        code?: string;
        fieldErrors?: Record<string, string[]>;
      };
      message = payload.message ?? message;
      code = payload.code ?? code;
      fieldErrors = payload.fieldErrors;
    } catch {
      // ignore JSON parse errors
    }

    throw new ApiClientError(response.status, {
      code,
      message,
      fieldErrors,
      correlationId,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  let accessToken = options.accessToken;

  if (!accessToken && options.request) {
    accessToken = (await ensureRequestAuth(options.request)).accessToken;
  }

  try {
    return await executeApiRequest<T>(path, options, accessToken);
  } catch (error) {
    if (
      options.request &&
      error instanceof ApiClientError &&
      error.status === 401
    ) {
      const refreshed = await refreshSessionTokens(options.request);
      if (!refreshed) {
        const url = new URL(options.request.url);
        throw redirect(
          `/login?redirectTo=${encodeURIComponent(`${url.pathname}${url.search}`)}`,
        );
      }
      return executeApiRequest<T>(path, options, refreshed);
    }
    throw error;
  }
}
