import {
  labelForReason,
  type ReasonOption,
} from "~/config/reason-options";

/**
 * Compose un motif API à partir d’un code catalogue + message libre optionnel.
 */
export function composeReasonFromForm(
  formData: FormData,
  options: readonly ReasonOption[],
  {
    codeField = "reasonCode",
    messageField = "reasonMessage",
  }: { codeField?: string; messageField?: string } = {},
): { ok: true; reason: string } | { ok: false; error: string } {
  const code = String(formData.get(codeField) ?? "").trim();
  const message = String(formData.get(messageField) ?? "").trim();

  if (!code) {
    return { ok: false, error: "Sélectionnez un motif." };
  }

  const label = labelForReason(options, code);
  if (!options.some((option) => option.value === code)) {
    return { ok: false, error: "Motif invalide." };
  }

  const reason = message ? `${label} — ${message}` : label;
  if (reason.length < 3) {
    return { ok: false, error: "Le motif est trop court." };
  }

  return { ok: true, reason };
}
