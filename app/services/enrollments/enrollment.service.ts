import type {
  Enrollment,
  EnrollmentStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";

import { daysAgo, filterByQuery, filterByStatus, toPaginated } from "../_shared/mock.utils";

const seed: Enrollment[] = [
  {
    id: "enr_001",
    beneficiaryName: "Aminata Traoré",
    status: "PENDING_VALIDATION",
    establishmentName: "CSRéf Commune III",
    submittedBy: "Mamadou Diallo",
    submittedAt: daysAgo(1),
    duplicateHints: ["NINA proche du dossier ben_014"],
    isProvisional: false,
    syncStatus: "SYNCED",
    healthConsentAccepted: true,
    faceCaptureSessionId: "face_enr_001",
    faceQualityLabel: "GOOD",
    requiredFields: {
      firstName: "Aminata",
      lastName: "Traoré",
      birthDate: "1985-03-12",
      sex: "FEMALE",
      phoneCountryCode: "+223",
      phoneNumber: "70••••41",
      address: "Quartier Hippodrome",
      city: "Bamako",
      beneficiaryType: "PRIMARY",
      ninaMasked: "NINA-••••-2841",
      biometricCardNumberMasked: "CB-••••-9012",
    },
    duplicateCandidates: [
      { beneficiaryId: "ben_009", displayName: "Kadidia Touré", hint: "NINA proche du dossier" },
    ],
    healthSummary: {
      hasEmergencyContact: true,
      hasBloodGroup: true,
      hasAllergies: false,
      hasChronicConditions: false,
      hasTreatments: false,
      consentAccepted: true,
    },
  },
  {
    id: "enr_002",
    beneficiaryName: "Moussa Diarra",
    status: "VALIDATED",
    establishmentName: "Hôpital du Mali",
    submittedBy: "Awa Konaté",
    submittedAt: daysAgo(2),
    duplicateHints: [],
    isProvisional: false,
    syncStatus: "SYNCED",
    healthConsentAccepted: false,
    faceCaptureSessionId: "face_enr_002",
    faceQualityLabel: "ACCEPTABLE",
  },
  {
    id: "enr_003",
    beneficiaryName: "Fatoumata Koné",
    status: "RETURNED",
    establishmentName: "CSRéf Kati",
    submittedBy: "Boubacar Keïta",
    submittedAt: daysAgo(3),
    duplicateHints: ["Téléphone déjà utilisé"],
    isProvisional: false,
    syncStatus: "SYNCED",
    healthConsentAccepted: false,
    faceQualityLabel: "POOR",
    duplicateCandidates: [
      { beneficiaryId: "ben_003", displayName: "Fatoumata Koné", hint: "Téléphone déjà utilisé" },
    ],
  },
  {
    id: "enr_004",
    beneficiaryName: "Ibrahim Coulibaly",
    status: "PENDING_VALIDATION",
    establishmentName: "Hôpital Ségou",
    submittedBy: "Fanta Touré",
    submittedAt: daysAgo(4),
    duplicateHints: ["Nom et date de naissance similaires"],
    isProvisional: true,
    syncStatus: "SYNCED",
    healthConsentAccepted: false,
    requiredFields: {
      firstName: "Ibrahim",
      lastName: "Coulibaly",
      birthDate: "1978-07-21",
      sex: "",
      phoneCountryCode: "+223",
      phoneNumber: "",
      address: "",
      city: "",
      beneficiaryType: "",
      ninaMasked: "",
      biometricCardNumberMasked: "",
    },
    duplicateCandidates: [
      { beneficiaryId: "ben_004", displayName: "Ibrahim Coulibaly", hint: "Nom et date de naissance similaires" },
    ],
  },
  {
    id: "enr_005",
    beneficiaryName: "Mariam Sidibé",
    status: "SUBMITTED",
    establishmentName: "CSRéf Sikasso",
    submittedBy: "Seydou Coulibaly",
    submittedAt: daysAgo(5),
    duplicateHints: [],
    isProvisional: false,
    syncStatus: "PENDING_SYNC",
    healthConsentAccepted: true,
    faceCaptureSessionId: "face_enr_005",
    faceQualityLabel: "GOOD",
  },
  {
    id: "enr_006",
    beneficiaryName: "Oumar Sangaré",
    status: "PENDING_VALIDATION",
    establishmentName: "Hôpital Mopti",
    submittedBy: "Mariam Cissé",
    submittedAt: daysAgo(6),
    duplicateHints: [],
    isProvisional: false,
    syncStatus: "SYNCED",
    healthConsentAccepted: true,
    faceCaptureSessionId: "face_enr_006",
    faceQualityLabel: "GOOD",
  },
  {
    id: "enr_007",
    beneficiaryName: "Aïssata Diallo",
    status: "DRAFT",
    establishmentName: "CSRéf Kayes",
    submittedBy: "Issa Traoré",
    submittedAt: daysAgo(7),
    duplicateHints: [],
    isProvisional: true,
    syncStatus: "PENDING_SYNC",
    healthConsentAccepted: false,
  },
  {
    id: "enr_008",
    beneficiaryName: "Bakary Keïta",
    status: "REJECTED",
    establishmentName: "Hôpital Gao",
    submittedBy: "Aminata Maïga",
    submittedAt: daysAgo(8),
    duplicateHints: ["Document illisible"],
    isProvisional: false,
    syncStatus: "SYNCED",
    healthConsentAccepted: false,
  },
];

let enrollments = seed.map((item) => ({
  ...item,
  duplicateHints: [...item.duplicateHints],
  duplicateCandidates: item.duplicateCandidates
    ? item.duplicateCandidates.map((candidate) => ({ ...candidate }))
    : undefined,
}));
const comments = new Map<string, string[]>();

export async function listEnrollments(
  query: ListQuery,
): Promise<PaginatedResponse<Enrollment>> {
  let items = filterByQuery(enrollments, query.q, [
    (item) => item.beneficiaryName,
    (item) => item.id,
    (item) => item.establishmentName,
  ]);
  items = filterByStatus(items, query.status);
  return toPaginated(
    items.map((item) => ({
      ...item,
      duplicateHints: [...item.duplicateHints],
    })),
    query.page,
    query.pageSize,
  );
}

export async function getEnrollment(id: string): Promise<Enrollment | null> {
  const item = enrollments.find((enrollment) => enrollment.id === id);
  return item
    ? {
        ...item,
        duplicateHints: [...item.duplicateHints],
        duplicateCandidates: item.duplicateCandidates
          ? item.duplicateCandidates.map((candidate) => ({ ...candidate }))
          : undefined,
      }
    : null;
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

export async function returnEnrollmentForCorrection(
  id: string,
  comment: string,
): Promise<Enrollment> {
  if (!comment.trim()) throw new Error("Le commentaire est obligatoire.");
  comments.set(id, [...(comments.get(id) ?? []), comment.trim()]);
  return updateStatus(id, "RETURNED");
}

export async function requestManualReview(
  id: string,
  comment: string,
): Promise<Enrollment> {
  if (!comment.trim()) throw new Error("Le commentaire est obligatoire.");
  comments.set(id, [...(comments.get(id) ?? []), comment.trim()]);
  return updateStatus(id, "PENDING_VALIDATION");
}

export async function rejectEnrollment(
  id: string,
  reason: string,
): Promise<Enrollment> {
  if (!reason.trim()) throw new Error("Le motif de rejet est obligatoire.");
  comments.set(id, [...(comments.get(id) ?? []), reason.trim()]);
  return updateStatus(id, "REJECTED");
}

export function resetEnrollmentsForTests() {
  enrollments = seed.map((item) => ({
    ...item,
    duplicateHints: [...item.duplicateHints],
    duplicateCandidates: item.duplicateCandidates
      ? item.duplicateCandidates.map((candidate) => ({ ...candidate }))
      : undefined,
  }));
  comments.clear();
}

export const list = listEnrollments;
export const get = getEnrollment;
export const validate = validateEnrollment;
export const returnForCorrection = returnEnrollmentForCorrection;
export const reject = rejectEnrollment;
