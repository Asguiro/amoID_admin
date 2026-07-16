import type { ApiErrorPayload } from "~/types/admin";

export class ApiClientError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiClientError";
    this.status = status;
    this.payload = payload;
  }
}

export function createCorrelationId(): string {
  return `amo-${crypto.randomUUID()}`;
}

export function toApiErrorPayload(
  error: unknown,
  correlationId = createCorrelationId(),
): ApiErrorPayload {
  if (error instanceof ApiClientError) {
    return error.payload;
  }

  if (error instanceof Error) {
    return {
      code: "INTERNAL_ERROR",
      message: error.message,
      correlationId,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Une erreur inattendue est survenue.",
    correlationId,
  };
}
