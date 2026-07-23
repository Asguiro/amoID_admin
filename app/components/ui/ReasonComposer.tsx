import { useId, useState } from "react";

import type { ReasonOption } from "~/config/reason-options";
import { FormField } from "~/components/ui/FormField";

interface ReasonComposerProps {
  options: readonly ReasonOption[];
  reasonCodeName?: string;
  reasonMessageName?: string;
  label?: string;
  messageLabel?: string;
  messageHint?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCode?: string;
  defaultMessage?: string;
}

export function ReasonComposer({
  options,
  reasonCodeName = "reasonCode",
  reasonMessageName = "reasonMessage",
  label = "Motif",
  messageLabel = "Précision (optionnel)",
  messageHint = "Ajoutez un détail si nécessaire pour le dossier.",
  required = true,
  disabled = false,
  defaultCode = "",
  defaultMessage = "",
}: ReasonComposerProps) {
  const id = useId();
  const selectId = `${id}-code`;
  const messageId = `${id}-message`;
  const [code, setCode] = useState(defaultCode);
  const showMessage = code.length > 0;

  return (
    <div className="space-y-3">
      <FormField label={label} htmlFor={selectId}>
        <select
          id={selectId}
          name={reasonCodeName}
          required={required}
          disabled={disabled}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="amo-select"
        >
          <option value="" disabled>
            Choisir un motif…
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      {showMessage ? (
        <FormField label={messageLabel} htmlFor={messageId} hint={messageHint}>
          <textarea
            id={messageId}
            name={reasonMessageName}
            disabled={disabled}
            defaultValue={defaultMessage}
            className="amo-textarea"
            rows={3}
            placeholder="Message complémentaire…"
          />
        </FormField>
      ) : null}
    </div>
  );
}
