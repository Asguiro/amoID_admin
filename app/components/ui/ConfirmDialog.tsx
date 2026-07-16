import { useEffect, useId, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  reasonRequired?: boolean;
  reasonLabel?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  busy?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  reasonRequired = false,
  reasonLabel = "Motif",
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState("");
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const canConfirm = !reasonRequired || reason.trim().length > 0;

  return (
    <dialog
      className={`modal ${open ? "modal-open" : ""}`}
      open={open}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <div className="modal-box rounded-3xl">
        <h2 id={titleId} className="amo-display text-xl font-semibold">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-base-content/70">
          {description}
        </p>

        {reasonRequired ? (
          <label className="form-control mt-5">
            <span className="label-text mb-2 font-medium">{reasonLabel}</span>
            <textarea
              className="amo-textarea"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              disabled={busy}
              aria-required="true"
            />
          </label>
        ) : null}

        <div className="modal-action">
          <button type="button" className="btn btn-ghost rounded-xl" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-xl"
            onClick={() => onConfirm(reason.trim())}
            disabled={busy || !canConfirm}
          >
            {busy ? <span className="loading loading-spinner loading-sm" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Fermer la boîte de dialogue"
        onClick={onCancel}
        disabled={busy}
      />
    </dialog>
  );
}
