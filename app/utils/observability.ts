/**
 * Observability helpers for admin UI error surfaces.
 * Correlation IDs are created server-side and displayed via ErrorState.
 */
export function formatCorrelationRef(correlationId: string): string {
  return `Réf. technique : ${correlationId}`;
}

export function readCorrelationFromError(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { correlationId?: string } }).data?.correlationId ===
      "string"
  ) {
    return (error as { data: { correlationId: string } }).data.correlationId;
  }
  return undefined;
}
