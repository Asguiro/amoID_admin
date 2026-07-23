export type ReasonOption = { value: string; label: string };

export const ENROLLMENT_RETURN_REASONS: ReasonOption[] = [
  { value: "DOC_ILLEGIBLE", label: "Document illisible ou incomplet" },
  { value: "PHOTO_QUALITY", label: "Qualité de la capture faciale insuffisante" },
  { value: "IDENTITY_MISMATCH", label: "Incohérence d’identité" },
  { value: "MISSING_FIELDS", label: "Champs obligatoires manquants" },
  { value: "DUPLICATE_SUSPECT", label: "Suspicion de doublon à clarifier" },
  { value: "OTHER", label: "Autre motif" },
];

export const ENROLLMENT_REJECT_REASONS: ReasonOption[] = [
  { value: "FRAUD_SUSPECTED", label: "Suspicion de fraude" },
  { value: "IDENTITY_INVALID", label: "Identité non valide" },
  { value: "DUPLICATE_CONFIRMED", label: "Doublon confirmé" },
  { value: "OUT_OF_SCOPE", label: "Hors périmètre AMO" },
  { value: "OTHER", label: "Autre motif" },
];

export const ENROLLMENT_MANUAL_REVIEW_REASONS: ReasonOption[] = [
  { value: "BIOMETRIC_DOUBT", label: "Doute biométrique" },
  { value: "DUPLICATE_REVIEW", label: "Analyse de doublon nécessaire" },
  { value: "DOCUMENT_REVIEW", label: "Vérification documentaire approfondie" },
  { value: "OTHER", label: "Autre motif" },
];

export const DEVICE_REVOKE_REASONS: ReasonOption[] = [
  { value: "LOST_STOLEN", label: "Appareil perdu ou volé" },
  { value: "AGENT_LEFT", label: "Agent parti / plus autorisé" },
  { value: "SECURITY_INCIDENT", label: "Incident de sécurité" },
  { value: "REPLACED", label: "Remplacé par un autre terminal" },
  { value: "OTHER", label: "Autre motif" },
];

export const DEVICE_APPROVE_REASONS: ReasonOption[] = [
  { value: "VERIFIED_AGENT", label: "Agent et terminal vérifiés" },
  { value: "REPLACEMENT", label: "Remplacement d’un appareil révoqué" },
  { value: "OPERATIONAL_NEED", label: "Besoin opérationnel validé" },
  { value: "OTHER", label: "Autre motif" },
];

export const ALERT_DECISION_REASONS: ReasonOption[] = [
  { value: "CONFIRMED_FRAUD", label: "Fraude confirmée" },
  { value: "FALSE_POSITIVE", label: "Faux positif" },
  { value: "INSUFFICIENT_EVIDENCE", label: "Preuves insuffisantes" },
  { value: "ESCALATION_NEEDED", label: "Escalade nécessaire" },
  { value: "OTHER", label: "Autre motif" },
];

export function labelForReason(
  options: readonly ReasonOption[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
