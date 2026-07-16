import { Download } from "lucide-react";

interface ExportButtonProps {
  disabled?: boolean;
  busy?: boolean;
  label?: string;
  variant?: "primary" | "outline";
}

export function ExportButton({
  disabled = false,
  busy = false,
  label = "Exporter",
  variant = "outline",
}: ExportButtonProps) {
  return (
    <button
      type="submit"
      className={`btn rounded-xl ${variant === "primary" ? "btn-primary" : "btn-outline btn-primary"}`}
      disabled={disabled || busy}
      aria-busy={busy}
    >
      {busy ? (
        <span className="loading loading-spinner loading-sm" aria-hidden="true" />
      ) : (
        <Download className="size-4" aria-hidden="true" />
      )}
      {busy ? "Export en cours…" : label}
    </button>
  );
}
