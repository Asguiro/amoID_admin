export const permissions = {
  dashboardReadGlobal: "dashboard.read.global",
  dashboardReadRegion: "dashboard.read.region",
  dashboardReadEstablishment: "dashboard.read.establishment",
  beneficiaryReadBasic: "beneficiary.read.basic",
  beneficiaryReadSensitive: "beneficiary.read.sensitive",
  beneficiaryReadHealth: "beneficiary.read.health",
  beneficiaryReadCosts: "beneficiary.read.costs",
  enrollmentRead: "enrollment.read",
  enrollmentValidate: "enrollment.validate",
  enrollmentReturnForCorrection: "enrollment.return_for_correction",
  enrollmentReject: "enrollment.reject",
  agentRead: "agent.read",
  agentCreate: "agent.create",
  agentUpdate: "agent.update",
  agentSuspend: "agent.suspend",
  agentReactivate: "agent.reactivate",
  deviceRead: "device.read",
  deviceTrust: "device.trust",
  deviceRevoke: "device.revoke",
  establishmentRead: "establishment.read",
  establishmentCreate: "establishment.create",
  establishmentUpdate: "establishment.update",
  verificationRead: "verification.read",
  temporaryQrRead: "qr.read",
  temporaryQrRevoke: "qr.revoke",
  alertRead: "alert.read",
  alertAssign: "alert.assign",
  alertInvestigate: "alert.investigate",
  alertDecide: "alert.decide",
  reportRead: "report.read",
  reportExport: "report.export",
  auditRead: "audit.read",
  settingsRead: "settings.read",
  settingsUpdate: "settings.update",
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];

export const adminRoles = {
  ADMIN_CENTRAL: "ADMIN_CENTRAL",
  REGIONAL_SUPERVISOR: "REGIONAL_SUPERVISOR",
  ESTABLISHMENT_SUPERVISOR: "ESTABLISHMENT_SUPERVISOR",
  AUDITOR: "AUDITOR",
  ENROLLMENT_AGENT: "ENROLLMENT_AGENT",
  CARE_POINT_AGENT: "CARE_POINT_AGENT",
} as const;

export type AdminRole = (typeof adminRoles)[keyof typeof adminRoles];

export function hasPermission(
  userPermissions: readonly string[],
  permission: Permission,
): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(
  userPermissions: readonly string[],
  required: readonly Permission[],
): boolean {
  return required.some((permission) =>
    hasPermission(userPermissions, permission),
  );
}
