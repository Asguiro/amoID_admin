import clsx from "clsx";
import {
  Camera,
  Download,
  Eye,
  FileText,
  ImageIcon,
  LockKeyhole,
} from "lucide-react";

import type { MediaAsset, MediaAvailability, MediaKind } from "~/types/admin";

const availabilityMeta: Record<
  MediaAvailability,
  { label: string; badge: string; description: string }
> = {
  AVAILABLE: {
    label: "Disponible",
    badge: "badge-success",
    description: "Le média peut être consulté selon vos permissions.",
  },
  MISSING: {
    label: "Absent",
    badge: "badge-ghost",
    description: "Aucun média n’est associé à ce dossier.",
  },
  RESTRICTED: {
    label: "Accès restreint",
    badge: "badge-warning",
    description: "Ce contenu sensible nécessite une autorisation supplémentaire.",
  },
  PROCESSING: {
    label: "Traitement en cours",
    badge: "badge-info",
    description: "Le média sera disponible après traitement.",
  },
  SOURCE_NOT_CONNECTED: {
    label: "Source non connectée",
    badge: "badge-ghost",
    description: "L’emplacement est prêt, mais la source de données n’est pas encore connectée.",
  },
};

const kindIcon: Record<MediaKind, typeof ImageIcon> = {
  PORTRAIT: ImageIcon,
  FACE_CAPTURE: Camera,
  ID_DOCUMENT: FileText,
  ATTESTATION: FileText,
  QR: ImageIcon,
  OTHER: FileText,
};

export function PreparedMediaSlot({
  label,
  kind,
  referenceId,
  availability = "SOURCE_NOT_CONNECTED",
}: {
  label: string;
  kind: MediaKind;
  referenceId?: string;
  availability?: MediaAvailability;
}) {
  const meta = availabilityMeta[availability];
  const Icon = availability === "RESTRICTED" ? LockKeyhole : kindIcon[kind];

  return (
    <div className="card border border-dashed border-base-300 bg-base-200/45">
      <div className="card-body gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-base-100 text-primary shadow-sm">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className={clsx("badge badge-sm", meta.badge)}>{meta.label}</span>
        </div>
        <div>
          <h3 className="font-semibold text-secondary">{label}</h3>
          <p className="mt-1 text-sm text-base-content/60">{meta.description}</p>
          {referenceId ? (
            <p className="mt-3 break-all font-mono text-xs text-base-content/55">
              Réf. {referenceId}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MediaTile({
  asset,
  onPreview,
}: {
  asset: MediaAsset;
  onPreview?: (asset: MediaAsset) => void;
}) {
  const meta = availabilityMeta[asset.availability];
  const Icon = kindIcon[asset.kind];

  return (
    <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
      <figure className="relative aspect-[4/3] bg-base-200">
        {asset.thumbnailUrl && asset.availability === "AVAILABLE" ? (
          <img src={asset.thumbnailUrl} alt={asset.label} className="h-full w-full object-cover" />
        ) : (
          <Icon className="size-10 text-base-content/25" aria-hidden="true" />
        )}
        <span className={clsx("badge badge-sm absolute top-3 right-3", meta.badge)}>
          {meta.label}
        </span>
      </figure>
      <div className="card-body gap-3 p-4">
        <h3 className="card-title text-base">{asset.label}</h3>
        {asset.referenceId ? (
          <p className="truncate font-mono text-xs text-base-content/55">{asset.referenceId}</p>
        ) : null}
        {asset.availability === "AVAILABLE" && asset.permissions.canPreview && onPreview ? (
          <button type="button" className="btn btn-outline btn-sm rounded-xl" onClick={() => onPreview(asset)}>
            <Eye className="size-4" aria-hidden="true" />
            Prévisualiser
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function MediaGallery({
  assets,
  empty,
}: {
  assets: MediaAsset[];
  empty?: React.ReactNode;
}) {
  if (assets.length === 0) {
    return empty ?? <PreparedMediaSlot label="Médias du dossier" kind="OTHER" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => <MediaTile key={asset.id} asset={asset} />)}
    </div>
  );
}

export function DocumentRow({ asset }: { asset: MediaAsset }) {
  const meta = availabilityMeta[asset.availability];
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4">
      <span className="flex size-10 items-center justify-center rounded-xl bg-base-200 text-primary">
        <FileText className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-secondary">{asset.fileName ?? asset.label}</p>
        <p className="text-xs text-base-content/55">{asset.mimeType ?? "Type non renseigné"}</p>
      </div>
      <span className={clsx("badge badge-sm", meta.badge)}>{meta.label}</span>
      {asset.previewUrl && asset.permissions.canDownload ? (
        <a href={asset.previewUrl} download className="btn btn-ghost btn-sm rounded-xl">
          <Download className="size-4" aria-hidden="true" />
          Télécharger
        </a>
      ) : null}
    </div>
  );
}
