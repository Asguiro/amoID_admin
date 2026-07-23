import { createCookie } from "react-router";

import { getServerEnv, isProduction } from "~/server/env.server";

const MAX_SEEN = 80;

const seenAlertsCookie = createCookie("amo_seen_alerts", {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secrets: [getServerEnv().SESSION_SECRET],
  secure: isProduction(),
  maxAge: 60 * 60 * 24 * 14,
});

function parseIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === "string" && id.length > 0);
}

export async function getSeenAlertIds(request: Request): Promise<string[]> {
  const value = await seenAlertsCookie.parse(request.headers.get("Cookie"));
  return parseIds(value);
}

export async function markAlertSeen(
  request: Request,
  alertId: string,
): Promise<string | null> {
  const current = await getSeenAlertIds(request);
  if (current.includes(alertId)) return null;
  const next = [alertId, ...current.filter((id) => id !== alertId)].slice(
    0,
    MAX_SEEN,
  );
  return seenAlertsCookie.serialize(next);
}

export function countUnseenAlerts(
  alertIds: string[],
  seenIds: string[],
): number {
  if (alertIds.length === 0) return 0;
  const seen = new Set(seenIds);
  return alertIds.filter((id) => !seen.has(id)).length;
}
