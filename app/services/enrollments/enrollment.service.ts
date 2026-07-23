import { apiRequest } from "~/server/api/client.server";
import type {
  Enrollment,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";

type EnrollmentListQuery = ListQuery & {
  regionId?: string;
  establishmentId?: string;
};

function isNotFound(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404,
  );
}

function buildQuery(query: EnrollmentListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.regionId) params.set("regionId", query.regionId);
  if (query.establishmentId) params.set("establishmentId", query.establishmentId);
  return params;
}

function normalizeEnrollment(item: Enrollment): Enrollment {
  return {
    ...item,
    submittedAt: item.submittedAt ?? "",
    duplicateHints: item.duplicateHints ?? [],
    media: item.media ?? [],
  };
}

export async function listEnrollments(
  query: EnrollmentListQuery,
  accessToken: string,
): Promise<PaginatedResponse<Enrollment>> {
  const res = await apiRequest<PaginatedResponse<Enrollment>>(
    `/admin/enrollments?${buildQuery(query)}`,
    { accessToken },
  );
  return {
    ...res,
    items: res.items.map(normalizeEnrollment),
  };
}

export async function getEnrollment(
  id: string,
  accessToken: string,
): Promise<Enrollment | null> {
  try {
    const item = await apiRequest<Enrollment>(`/admin/enrollments/${id}`, {
      accessToken,
    });
    return normalizeEnrollment(item);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function validateEnrollment(
  id: string,
  accessToken: string,
): Promise<Enrollment> {
  const item = await apiRequest<Enrollment>(`/admin/enrollments/${id}/validate`, {
    method: "POST",
    accessToken,
  });
  return normalizeEnrollment(item);
}

export async function returnEnrollmentForCorrection(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Enrollment> {
  if (!reason.trim()) throw new Error("Le commentaire est obligatoire.");
  const item = await apiRequest<Enrollment>(
    `/admin/enrollments/${id}/return-for-correction`,
    {
      method: "POST",
      accessToken,
      body: { reason: reason.trim() },
    },
  );
  return normalizeEnrollment(item);
}

export async function requestManualReview(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Enrollment> {
  if (!reason.trim()) throw new Error("Le commentaire est obligatoire.");
  const item = await apiRequest<Enrollment>(
    `/admin/enrollments/${id}/request-manual-review`,
    {
      method: "POST",
      accessToken,
      body: { reason: reason.trim() },
    },
  );
  return normalizeEnrollment(item);
}

export async function rejectEnrollment(
  id: string,
  reason: string,
  accessToken: string,
): Promise<Enrollment> {
  if (!reason.trim()) throw new Error("Le motif de rejet est obligatoire.");
  const item = await apiRequest<Enrollment>(`/admin/enrollments/${id}/reject`, {
    method: "POST",
    accessToken,
    body: { reason: reason.trim() },
  });
  return normalizeEnrollment(item);
}

/** @deprecated mock reset — no-op after API wiring */
export function resetEnrollmentsForTests() {
  // no-op
}

export const list = listEnrollments;
export const get = getEnrollment;
export const validate = validateEnrollment;
export const returnForCorrection = returnEnrollmentForCorrection;
export const reject = rejectEnrollment;
