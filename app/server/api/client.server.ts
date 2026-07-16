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
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  headers.set("X-Correlation-Id", correlationId);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
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
