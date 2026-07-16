export type AgentStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
export type DeviceStatus = "PENDING" | "TRUSTED" | "REVOKED";
export type EstablishmentType =
  | "HOSPITAL"
  | "CLINIC"
  | "PHARMACY"
  | "ANTENNA";
export type EnrollmentStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_VALIDATION"
  | "RETURNED"
  | "VALIDATED"
  | "REJECTED";
export type VerificationOutcome =
  | "SUCCESS"
  | "DOUBT"
  | "FAILURE"
  | "MANUAL_REVIEW";
export type TemporaryQrStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "USED";
export type AlertStatus =
  | "NEW"
  | "ASSIGNED"
  | "UNDER_REVIEW"
  | "NEEDS_INFORMATION"
  | "CONFIRMED"
  | "DISMISSED"
  | "ESCALATED"
  | "CLOSED";

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type DashboardPeriod = "7d" | "30d" | "90d";
export type ExportJobStatus = "QUEUED" | "RUNNING" | "READY" | "FAILED";

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
  generatedAt: string;
}

export interface ListQuery {
  q?: string;
  page: number;
  pageSize: number;
  status?: string;
  sort?: string;
}

export interface AdminSessionUser {
  id: string;
  displayName: string;
  email: string;
  role: string;
  permissions: string[];
  regionId?: string;
  establishmentId?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId: string;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trendPercent: number;
}

export interface DashboardAlertPreview {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
}

export interface DashboardActivityItem {
  id: string;
  label: string;
  actor: string;
  createdAt: string;
}

export interface DashboardSeriesPoint {
  date: string;
  enrollments: number;
  verifications: number;
  alerts: number;
}

export interface DashboardOverview {
  period: DashboardPeriod;
  generatedAt: string;
  kpis: DashboardKpi[];
  priorityAlerts: DashboardAlertPreview[];
  recentActivity: DashboardActivityItem[];
  series: DashboardSeriesPoint[];
  empty?: boolean;
}

export interface Establishment {
  id: string;
  name: string;
  type: EstablishmentType;
  region: string;
  city: string;
  status: "ACTIVE" | "INACTIVE";
  agentsCount: number;
  devicesCount: number;
  updatedAt: string;
}

export interface Agent {
  id: string;
  displayName: string;
  email: string;
  role: string;
  status: AgentStatus;
  establishmentId: string;
  establishmentName: string;
  region: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface Device {
  id: string;
  label: string;
  status: DeviceStatus;
  agentId: string;
  agentName: string;
  establishmentName: string;
  platform: string;
  lastSeenAt: string;
  enrolledAt: string;
}

export interface Beneficiary {
  id: string;
  displayName: string;
  ninaMasked: string;
  amoNumberMasked: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  establishmentName: string;
  region: string;
  coverageStatus: "COVERED" | "LIMITED" | "EXPIRED";
  updatedAt: string;
}

export interface BeneficiaryDetail extends Beneficiary {
  nina?: string;
  amoNumber?: string;
  dateOfBirth?: string;
  phoneMasked: string;
  activity: Array<{ id: string; label: string; createdAt: string }>;
  coverageHistory: Array<{
    id: string;
    label: string;
    from: string;
    to: string;
    status: string;
  }>;
}

export interface Enrollment {
  id: string;
  beneficiaryName: string;
  status: EnrollmentStatus;
  establishmentName: string;
  submittedBy: string;
  submittedAt: string;
  duplicateHints: string[];
}

export interface Verification {
  id: string;
  beneficiaryMasked: string;
  outcome: VerificationOutcome;
  establishmentName: string;
  agentName: string;
  channel: "BIOMETRIC" | "QR" | "MANUAL";
  createdAt: string;
}

export interface VerificationDetail extends Verification {
  device: string;
  metadata: {
    pointDeService: string;
    versionApplication: string;
  };
}

export interface TemporaryQr {
  id: string;
  beneficiaryMasked: string;
  status: TemporaryQrStatus;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  usageCount: number;
}

export interface TemporaryQrDetail extends TemporaryQr {
  beneficiaryId: string;
  revokeReason?: string;
  audit: Array<{
    id: string;
    label: string;
    actor: string;
    createdAt: string;
  }>;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  assignee?: string;
  establishmentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertDetail extends AlertItem {
  description: string;
  timeline: Array<{
    id: string;
    label: string;
    actor: string;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    body: string;
    actor: string;
    createdAt: string;
  }>;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  target: string;
  scope: string;
  status: "SUCCESS" | "DENIED" | "FAILED";
  createdAt: string;
  correlationId: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface ExportJob {
  id: string;
  reportId: string;
  status: ExportJobStatus;
  createdAt: string;
  downloadUrl?: string;
  error?: string;
}
