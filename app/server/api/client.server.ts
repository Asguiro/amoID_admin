import { getServerEnv } from "~/server/env.server";

import { ApiClientError, createCorrelationId } from "./errors.server";

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  accessToken?: string;
}

/**
 * Server-only HTTP client for the NestJS API.
 * Phase 0 mostly uses mocks via services; this client is ready for real calls.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const env = getServerEnv();
  const correlationId = createCorrelationId();
  const requestUrl = new URL(path, env.API_URL).toString();

  // #region agent log
  fetch("http://127.0.0.1:7626/ingest/52f7afb0-b011-458d-8aeb-f7e2b7da4c3a", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "813ef0",
    },
    body: JSON.stringify({
      sessionId: "813ef0",
      runId: "post-fix",
      hypothesisId: "A",
      location: "client.server.ts:apiRequest",
      message: "apiRequest target",
      data: {
        path,
        apiHost: new URL(env.API_URL).hostname,
        isLocalHost: ["localhost", "127.0.0.1"].includes(
          new URL(env.API_URL).hostname,
        ),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  headers.set("X-Correlation-Id", correlationId);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      ...options,
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7626/ingest/52f7afb0-b011-458d-8aeb-f7e2b7da4c3a", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "813ef0",
      },
      body: JSON.stringify({
        sessionId: "813ef0",
        runId: "post-fix",
        hypothesisId: "B",
        location: "client.server.ts:apiRequest:catch",
        message: "fetch failed",
        data: {
          apiHost: new URL(env.API_URL).hostname,
          errorName: error instanceof Error ? error.name : "unknown",
          causeCode:
            error instanceof Error &&
            error.cause &&
            typeof error.cause === "object" &&
            "code" in error.cause
              ? String((error.cause as { code?: string }).code)
              : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw error;
  }

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
