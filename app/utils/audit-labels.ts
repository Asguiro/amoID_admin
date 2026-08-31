const AUDIT_ACTION_LABELS: Record<string, string> = {
  ENROLLMENT_SUBMIT: "Soumission du dossier",
  ENROLLMENT_VALIDATE: "Enrôlement validé",
  ENROLLMENT_RETURN: "Retour pour correction",
  ENROLLMENT_MANUAL_REVIEW: "Analyse manuelle demandée",
  ENROLLMENT_REJECT: "Enrôlement rejeté",
  ENROLLMENT_FACE_PREVIEW: "Consultation capture faciale",
  ENROLLMENT_PROGRESS_CREATE: "Progression créée",
  ENROLLMENT_STEP_COMPLETE: "Étape complétée",
  ENROLLMENT_HEALTH_SKIPPED: "Santé ignorée",
  ENROLLMENT_FACE_COMPLETE: "Capture faciale terminée",
};

export function auditActionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action;
}
