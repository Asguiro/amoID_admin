import clsx from "clsx";

import type {
  AgentStatus,
  AlertSeverity,
  AlertStatus,
  DeviceStatus,
  EnrollmentStatus,
  TemporaryQrStatus,
  VerificationOutcome,
} from "~/types/admin";

type StatusTone = "neutral" | "info" | "success" | "warning" | "error";

const toneClass: Record<StatusTone, string> = {
  neutral: "bg-base-200 text-base-content/70",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/10 text-error",
};

const severityTone: Record<AlertSeverity, StatusTone> = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  CRITICAL: "error",
};

const severityLabel: Record<AlertSeverity, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  CRITICAL: "Critique",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AlertSeverityBadge({
  severity,
  className,
}: {
  severity: AlertSeverity;
  className?: string;
}) {
  return (
    <StatusBadge tone={severityTone[severity]} className={className}>
      {severityLabel[severity]}
    </StatusBadge>
  );
}

export function AlertStatusBadge({
  status,
  className,
}: {
  status: AlertStatus;
  className?: string;
}) {
  const tone: StatusTone =
    status === "CONFIRMED" || status === "ESCALATED"
      ? "error"
      : status === "CLOSED" || status === "DISMISSED"
        ? "neutral"
        : status === "UNDER_REVIEW" || status === "ASSIGNED"
          ? "info"
          : "warning";

  const labels: Record<AlertStatus, string> = {
    NEW: "Nouvelle",
    ASSIGNED: "Affectée",
    UNDER_REVIEW: "En analyse",
    NEEDS_INFORMATION: "Info requise",
    CONFIRMED: "Confirmée",
    DISMISSED: "Sans suite",
    ESCALATED: "Escaladée",
    CLOSED: "Clôturée",
  };

  return (
    <StatusBadge tone={tone} className={className}>
      {labels[status]}
    </StatusBadge>
  );
}

const agentStatus: Record<AgentStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "En attente", tone: "warning" },
  ACTIVE: { label: "Actif", tone: "success" },
  SUSPENDED: { label: "Suspendu", tone: "error" },
  ARCHIVED: { label: "Archivé", tone: "neutral" },
};

export function AgentStatusBadge({
  status,
  className,
}: {
  status: AgentStatus;
  className?: string;
}) {
  const value = agentStatus[status];
  return <StatusBadge tone={value.tone} className={className}>{value.label}</StatusBadge>;
}

const deviceStatus: Record<DeviceStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "En attente", tone: "warning" },
  TRUSTED: { label: "Approuvé", tone: "success" },
  REVOKED: { label: "Révoqué", tone: "error" },
};

export function DeviceStatusBadge({
  status,
  className,
}: {
  status: DeviceStatus;
  className?: string;
}) {
  const value = deviceStatus[status];
  return <StatusBadge tone={value.tone} className={className}>{value.label}</StatusBadge>;
}

const enrollmentStatus: Record<
  EnrollmentStatus,
  { label: string; tone: StatusTone }
> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  SUBMITTED: { label: "Soumis", tone: "info" },
  PENDING_VALIDATION: { label: "À valider", tone: "warning" },
  RETURNED: { label: "Retourné", tone: "warning" },
  VALIDATED: { label: "Validé", tone: "success" },
  REJECTED: { label: "Rejeté", tone: "error" },
};

export function EnrollmentStatusBadge({
  status,
  className,
}: {
  status: EnrollmentStatus;
  className?: string;
}) {
  const value = enrollmentStatus[status];
  return <StatusBadge tone={value.tone} className={className}>{value.label}</StatusBadge>;
}

const verificationOutcome: Record<
  VerificationOutcome,
  { label: string; tone: StatusTone }
> = {
  SUCCESS: { label: "Réussie", tone: "success" },
  DOUBT: { label: "Doute", tone: "warning" },
  FAILURE: { label: "Échec", tone: "error" },
  MANUAL_REVIEW: { label: "Analyse manuelle", tone: "info" },
};

export function VerificationOutcomeBadge({
  outcome,
  className,
}: {
  outcome: VerificationOutcome;
  className?: string;
}) {
  const value = verificationOutcome[outcome];
  return <StatusBadge tone={value.tone} className={className}>{value.label}</StatusBadge>;
}

const qrStatus: Record<TemporaryQrStatus, { label: string; tone: StatusTone }> = {
  ACTIVE: { label: "Actif", tone: "success" },
  EXPIRED: { label: "Expiré", tone: "neutral" },
  REVOKED: { label: "Révoqué", tone: "error" },
  USED: { label: "Utilisé", tone: "info" },
};

export function QrStatusBadge({
  status,
  className,
}: {
  status: TemporaryQrStatus;
  className?: string;
}) {
  const value = qrStatus[status];
  return <StatusBadge tone={value.tone} className={className}>{value.label}</StatusBadge>;
}
