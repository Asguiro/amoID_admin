import type { Enrollment, EnrollmentStatus, ListQuery, PaginatedResponse } from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const seed: Enrollment[] = [
  ["enr_001", "Aminata Traoré", "PENDING_VALIDATION", "CSRéf Commune III", "Mamadou Diallo", ["NINA proche du dossier ben_014"]],
  ["enr_002", "Moussa Diarra", "VALIDATED", "Hôpital du Mali", "Awa Konaté", []],
  ["enr_003", "Fatoumata Koné", "RETURNED", "CSRéf Kati", "Boubacar Keïta", ["Téléphone déjà utilisé"]],
  ["enr_004", "Ibrahim Coulibaly", "PENDING_VALIDATION", "Hôpital Ségou", "Fanta Touré", ["Nom et date de naissance similaires"]],
  ["enr_005", "Mariam Sidibé", "SUBMITTED", "CSRéf Sikasso", "Seydou Coulibaly", []],
  ["enr_006", "Oumar Sangaré", "PENDING_VALIDATION", "Hôpital Mopti", "Mariam Cissé", []],
  ["enr_007", "Aïssata Diallo", "DRAFT", "CSRéf Kayes", "Issa Traoré", []],
  ["enr_008", "Bakary Keïta", "REJECTED", "Hôpital Gao", "Aminata Maïga", ["Document illisible"]],
].map(([id, beneficiaryName, status, establishmentName, submittedBy, duplicateHints], index) => ({
  id: id as string,
  beneficiaryName: beneficiaryName as string,
  status: status as EnrollmentStatus,
  establishmentName: establishmentName as string,
  submittedBy: submittedBy as string,
  submittedAt: daysAgo(index + 1),
  duplicateHints: duplicateHints as string[],
}));

let enrollments = seed.map((item) => ({ ...item, duplicateHints: [...item.duplicateHints] }));
const comments = new Map<string, string[]>();

export async function listEnrollments(query: ListQuery): Promise<PaginatedResponse<Enrollment>> {
  let items = filterByQuery(enrollments, query.q, [
    (item) => item.beneficiaryName,
    (item) => item.id,
    (item) => item.establishmentName,
  ]);
  items = filterByStatus(items, query.status);
  return toPaginated(items, query.page, query.pageSize);
}

export async function getEnrollment(id: string): Promise<Enrollment | null> {
  const item = enrollments.find((enrollment) => enrollment.id === id);
  return item ? { ...item, duplicateHints: [...item.duplicateHints] } : null;
}

function updateStatus(id: string, status: EnrollmentStatus): Enrollment {
  const index = enrollments.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Enrôlement introuvable.");
  const current = enrollments[index]!;
  const updated = { ...current, status };
  enrollments[index] = updated;
  return updated;
}

export async function validateEnrollment(id: string): Promise<Enrollment> {
  return updateStatus(id, "VALIDATED");
}

export async function returnEnrollmentForCorrection(id: string, comment: string): Promise<Enrollment> {
  if (!comment.trim()) throw new Error("Le commentaire est obligatoire.");
  comments.set(id, [...(comments.get(id) ?? []), comment.trim()]);
  return updateStatus(id, "RETURNED");
}

export async function requestManualReview(id: string, comment: string): Promise<Enrollment> {
  if (!comment.trim()) throw new Error("Le commentaire est obligatoire.");
  comments.set(id, [...(comments.get(id) ?? []), comment.trim()]);
  return updateStatus(id, "PENDING_VALIDATION");
}

export function resetEnrollmentsForTests() {
  enrollments = seed.map((item) => ({ ...item, duplicateHints: [...item.duplicateHints] }));
  comments.clear();
}

export const list = listEnrollments;
export const get = getEnrollment;
export const validate = validateEnrollment;
export const returnForCorrection = returnEnrollmentForCorrection;
