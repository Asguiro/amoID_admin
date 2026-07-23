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
export type EnrollmentSyncStatus = "SYNCED" | "PENDING_SYNC";
export type FaceQualityLabel = "GOOD" | "ACCEPTABLE" | "POOR";
export type VerificationOutcome =
  | "SUCCESS"
  | "DOUBT"
  | "FAILURE"
  | "MANUAL_REVIEW";
export type VerificationDecision = "CONFIRM" | "REJECT" | "MANUAL";
export type VerificationConfidenceLabel = "HIGH" | "MEDIUM" | "LOW";
export type VerificationIdentifierType = "NINA" | "BIOMETRIC_CARD" | "AMO_NUMBER";
export type TemporaryQrStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "USED";
export type TemporaryQrReason =
  | "LOST_CARD"
  | "DAMAGED_CARD"
  | "RENEWAL_PENDING"
  | "OPERATIONAL";
export type TemporaryQrDuration = "24H" | "72H" | "7D";
export type BeneficiaryType = "PRIMARY" | "DEPENDENT";
export type DossierCompletenessStatus = "COMPLETE" | "INCOMPLETE";
export type BeneficiaryCoverageStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "UPDATE_REQUIRED"
  | "NOT_FOUND";
export type BeneficiarySex = "FEMALE" | "MALE";
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

/**
 * Mapping rôles mobile agent ↔ rôles dash admin (ne pas renommer les rôles admin).
 * ADMIN → ADMIN_CENTRAL
 * SUPERVISOR_REGIONAL → REGIONAL_SUPERVISOR
 * SUPERVISOR_ESTABLISHMENT → ESTABLISHMENT_SUPERVISOR
 * AGENT_ENROLLMENT → ENROLLMENT_AGENT
 * AGENT_CARE_POINT → CARE_POINT_AGENT
 * AUDITOR → AUDITOR
 */
export const MOBILE_TO_ADMIN_ROLE_MAP = {
  ADMIN: "ADMIN_CENTRAL",
  SUPERVISOR_REGIONAL: "REGIONAL_SUPERVISOR",
  SUPERVISOR_ESTABLISHMENT: "ESTABLISHMENT_SUPERVISOR",
  AGENT_ENROLLMENT: "ENROLLMENT_AGENT",
  AGENT_CARE_POINT: "CARE_POINT_AGENT",
  AUDITOR: "AUDITOR",
} as const;

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  ADMIN_CENTRAL: "Administrateur CANAM / AMO",
  REGIONAL_SUPERVISOR: "Superviseur régional",
  ESTABLISHMENT_SUPERVISOR: "Superviseur établissement",
  ENROLLMENT_AGENT: "Agent d’enrôlement",
  CARE_POINT_AGENT: "Agent point de soin",
  AUDITOR: "Auditeur / contrôleur",
};

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
  coverageStatus?: string;
  dossierStatus?: string;
  beneficiaryType?: string;
  channel?: string;
  decision?: string;
  reason?: string;
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

export type MediaKind =
  | "PORTRAIT"
  | "FACE_CAPTURE"
  | "ID_DOCUMENT"
  | "ATTESTATION"
  | "QR"
  | "OTHER";

export type MediaAvailability =
  | "AVAILABLE"
  | "MISSING"
  | "RESTRICTED"
  | "PROCESSING"
  | "SOURCE_NOT_CONNECTED";

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  label: string;
  availability: MediaAvailability;
  mimeType?: string;
  fileName?: string;
  size?: number;
  createdAt?: string;
  source?: string;
  referenceId?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  permissions: {
    canPreview: boolean;
    canDownload: boolean;
    canReveal: boolean;
  };
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trendPercent: number;
  trendIntent: "positive" | "negative" | "neutral";
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
  lastActiveAt: string | null;
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
  lastSeenAt: string | null;
  enrolledAt: string;
  pendingSyncCount?: number;
  lastSyncAt?: string;
}

export interface Beneficiary {
  id: string;
  displayName: string;
  ninaMasked: string;
  amoNumberMasked: string;
  biometricCardNumberMasked: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  establishmentName: string;
  region: string;
  coverageStatus: BeneficiaryCoverageStatus;
  beneficiaryType: BeneficiaryType;
  dossierStatus: DossierCompletenessStatus;
  hasBiometrics: boolean;
  hasHealthInfo: boolean;
  lastVerifiedAt?: string;
  updatedAt: string;
}

export interface BeneficiaryHealthSummary {
  hasEmergencyContact: boolean;
  hasBloodGroup: boolean;
  hasAllergies: boolean;
  hasChronicConditions: boolean;
  hasTreatments: boolean;
  consentAccepted: boolean;
}

export interface BeneficiaryDetail extends Beneficiary {
  nina?: string;
  amoNumber?: string;
  biometricCardNumber?: string;
  dateOfBirth?: string;
  sex?: BeneficiarySex;
  phoneMasked: string;
  address?: string;
  city?: string;
  primaryHolderId?: string;
  primaryHolderName?: string;
  healthSummary?: BeneficiaryHealthSummary;
  activity: Array<{ id: string; label: string; createdAt: string }>;
  coverageHistory: Array<{
    id: string;
    label: string;
    from: string;
    to: string;
    status: string;
  }>;
}

export type CareCategory =
  | "MEDICINES"
  | "CONSULTATION"
  | "HOSPITALIZATION"
  | "SURGERY"
  | "LABORATORY"
  | "IMAGING"
  | "MATERNITY"
  | "DENTAL";

export type BenefitClaimStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "PAID"
  | "PARTIALLY_REJECTED"
  | "REJECTED";

export interface BenefitClaimLine {
  code: string;
  label: string;
  quantity: number;
  unitPrice: number;
  billedAmount: number;
  eligibleAmount: number;
}

export interface BenefitClaim {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  claimNumber: string;
  invoiceReference: string;
  serviceDate: string;
  submittedAt: string;
  paidAt?: string;
  category: CareCategory;
  careSetting: "AMBULATORY" | "HOSPITAL";
  description: string;
  establishmentName: string;
  establishmentType: EstablishmentType;
  region: string;
  prescriberName?: string;
  coverageRate: 70 | 80;
  billedAmount: number;
  eligibleAmount: number;
  coveredAmount: number;
  copayAmount: number;
  rejectedAmount: number;
  status: BenefitClaimStatus;
  verificationChannel: "BIOMETRIC" | "QR" | "MANUAL";
  anomalySignals: string[];
  lines: BenefitClaimLine[];
}

export interface CostBreakdown {
  key: string;
  label: string;
  claimsCount: number;
  billedAmount: number;
  coveredAmount: number;
  sharePercent: number;
}

export interface BeneficiaryCostProfile {
  beneficiaryId: string;
  beneficiaryName: string;
  periodLabel: string;
  generatedAt: string;
  dataSource: "DEMO" | "CONNECTED" | "PARTIAL";
  totals: {
    claimsCount: number;
    billedAmount: number;
    eligibleAmount: number;
    coveredAmount: number;
    copayAmount: number;
    rejectedAmount: number;
    establishmentsCount: number;
    regionsCount: number;
    anomalySignalsCount: number;
  };
  byCategory: CostBreakdown[];
  byEstablishment: CostBreakdown[];
  monthlyTrend: Array<{
    month: string;
    claimsCount: number;
    coveredAmount: number;
  }>;
  claims: BenefitClaim[];
}

export interface BeneficiaryCostRankingItem {
  beneficiaryId: string;
  beneficiaryName: string;
  amoNumberMasked: string;
  region: string;
  claimsCount: number;
  coveredAmount: number;
  billedAmount: number;
  topCategory: CareCategory;
  establishmentsCount: number;
  anomalySignalsCount: number;
}

export interface CostReport {
  periodLabel: string;
  generatedAt: string;
  dataSource: "DEMO" | "CONNECTED" | "PARTIAL";
  totals: {
    beneficiariesCount: number;
    claimsCount: number;
    billedAmount: number;
    coveredAmount: number;
    copayAmount: number;
    rejectedAmount: number;
  };
  byCategory: CostBreakdown[];
  ranking: BeneficiaryCostRankingItem[];
}

export interface EnrollmentRequiredFieldsSnapshot {
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: BeneficiarySex | "";
  phoneCountryCode: string;
  phoneNumber: string;
  address: string;
  city: string;
  beneficiaryType: BeneficiaryType | "";
  ninaMasked: string;
  biometricCardNumberMasked: string;
}

export interface EnrollmentDuplicateCandidate {
  beneficiaryId: string;
  displayName: string;
  hint: string;
}

export interface Enrollment {
  id: string;
  beneficiaryName: string;
  status: EnrollmentStatus;
  establishmentName: string;
  submittedBy: string;
  submittedAt: string;
  duplicateHints: string[];
  isProvisional: boolean;
  syncStatus: EnrollmentSyncStatus;
  healthConsentAccepted: boolean;
  faceCaptureSessionId?: string;
  faceQualityLabel?: FaceQualityLabel;
  requiredFields?: EnrollmentRequiredFieldsSnapshot;
  duplicateCandidates?: EnrollmentDuplicateCandidate[];
  healthSummary?: BeneficiaryHealthSummary;
}

export interface Verification {
  id: string;
  beneficiaryMasked: string;
  beneficiaryId?: string;
  outcome: VerificationOutcome;
  decision?: VerificationDecision;
  confidenceLabel?: VerificationConfidenceLabel;
  establishmentName: string;
  agentName: string;
  channel: "BIOMETRIC" | "QR" | "MANUAL";
  identifierType?: VerificationIdentifierType;
  createdAt: string;
}

export interface VerificationDetail extends Verification {
  device: string;
  matchId?: string;
  manualReason?: string;
  manualReference?: string;
  primaryHolderName?: string;
  primaryHolderAmoNumberMasked?: string;
  businessRuleNote?: string;
  timeline: Array<{ id: string; label: string; actor: string; createdAt: string }>;
  metadata: {
    pointDeService: string;
    versionApplication: string;
  };
}

export interface TemporaryQr {
  id: string;
  beneficiaryMasked: string;
  status: TemporaryQrStatus;
  reason: TemporaryQrReason;
  duration: TemporaryQrDuration;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  usageCount: number;
}

export interface TemporaryQrDetail extends TemporaryQr {
  beneficiaryId: string;
  printReference?: string;
  faceCaptureSessionId?: string;
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

export interface BiometricReportMetrics {
  qualityGood: number;
  qualityAcceptable: number;
  qualityPoor: number;
  livenessFailures: number;
  manualFallbacks: number;
}

export interface TemporaryQrReportMetrics {
  byReason: Record<TemporaryQrReason, number>;
  byDuration: Record<TemporaryQrDuration, number>;
  revocationRatePercent: number;
  totalUsage: number;
}

export interface AppSettings {
  maxQrDuration: TemporaryQrDuration;
  maxFaceAttempts: number;
  auditRetentionDays: number;
  fraudMultiMatchThreshold: number;
  fraudQrAbusePerDay: number;
  fraudSyncBlockedHours: number;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  threshold: number;
  unit: string;
  enabled: boolean;
}
