import clsx from "clsx";
import { Download, X } from "lucide-react";

import type { MediaAsset } from "~/types/admin";

export function MediaPreviewDialog({
  asset,
  open,
  onClose,
}: {
  asset?: MediaAsset;
  open: boolean;
  onClose: () => void;
}) {
  if (!asset) return null;

  return (
    <div className={clsx("modal", open && "modal-open")} role="dialog" aria-modal="true" aria-label={`Aperçu de ${asset.label}`}>
      <div className="modal-box max-w-4xl rounded-3xl p-0">
        <div className="flex items-center justify-between gap-3 border-b border-base-300 px-5 py-4">
          <div>
            <h2 className="font-semibold text-secondary">{asset.label}</h2>
            <p className="text-xs text-base-content/55">{asset.fileName ?? asset.referenceId}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-square btn-sm rounded-xl" onClick={onClose} aria-label="Fermer l’aperçu">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex min-h-72 items-center justify-center bg-base-200 p-5">
          {asset.previewUrl ? (
            <img src={asset.previewUrl} alt={asset.label} className="max-h-[70vh] max-w-full rounded-2xl object-contain" />
          ) : (
            <p className="text-sm text-base-content/60">Aucun aperçu disponible.</p>
          )}
        </div>
        {asset.previewUrl && asset.permissions.canDownload ? (
          <div className="flex justify-end p-4">
            <a href={asset.previewUrl} download className="btn btn-primary rounded-xl">
              <Download className="size-4" aria-hidden="true" />
              Télécharger
            </a>
          </div>
        ) : null}
      </div>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Fermer l’aperçu" />
    </div>
  );
}
