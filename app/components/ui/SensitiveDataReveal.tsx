import { Eye, EyeOff } from "lucide-react";
import { Form } from "react-router";
import { CsrfField } from "~/components/security/CsrfProvider";

interface SensitiveDataRevealProps {
  label: string;
  maskedValue: string;
  revealedValue?: string;
  canReveal: boolean;
  onReveal?: () => void;
}

export function SensitiveDataReveal({
  label,
  maskedValue,
  revealedValue,
  canReveal,
  onReveal,
}: SensitiveDataRevealProps) {
  const isRevealed = revealedValue !== undefined;

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-4">
      <p className="text-xs font-semibold tracking-wide text-base-content/55 uppercase">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-sm font-medium" aria-live="polite">
          {isRevealed ? revealedValue : maskedValue}
        </span>
        {canReveal && !isRevealed ? (
          <Form method="post" onSubmit={onReveal}>
            <CsrfField />
            <button
              type="submit"
              name="intent"
              value="reveal"
              className="btn btn-ghost btn-sm rounded-xl text-primary"
              aria-label={`Révéler ${label}`}
            >
              <Eye className="size-4" aria-hidden="true" />
              Révéler
            </button>
          </Form>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-base-content/50">
            <EyeOff className="size-4" aria-hidden="true" />
            {isRevealed ? "Donnée révélée" : "Accès restreint"}
          </span>
        )}
      </div>
    </div>
  );
}
