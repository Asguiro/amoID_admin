import type { EnrollmentProgress } from "~/types/admin";

const STEP_LABELS: Record<EnrollmentProgress["currentStep"], string> = {
  IDENTITY: "Identité",
  MANDATORY_INFO: "Informations obligatoires",
  HEALTH_INFO: "Santé d’urgence",
  FACE: "Capture faciale",
  RECAP: "Récapitulatif",
  PENDING_VALIDATION: "En attente de validation",
  VALIDATED: "Validé",
  CORRECTION_REQUIRED: "Correction requise",
};

const STATUS_LABELS: Record<EnrollmentProgress["progressStatus"], string> = {
  IN_PROGRESS: "En cours",
  SUBMITTED: "Soumis",
  CORRECTION_REQUIRED: "Correction requise",
  COMPLETED: "Terminé",
  ABANDONED: "Abandonné",
};

export function enrollmentStepLabel(step: EnrollmentProgress["currentStep"]) {
  return STEP_LABELS[step] ?? step;
}

export function enrollmentProgressStatusLabel(
  status: EnrollmentProgress["progressStatus"],
) {
  return STATUS_LABELS[status] ?? status;
}
