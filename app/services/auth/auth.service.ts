import { adminRoles, permissions } from "~/config/permissions";
import type { AdminSessionUser } from "~/types/admin";

const DEMO_USERS: Record<string, AdminSessionUser & { password: string }> = {
  "admin@amo.ml": {
    id: "usr_admin_001",
    displayName: "Aminata Diallo",
    email: "admin@amo.ml",
    role: adminRoles.ADMIN_CENTRAL,
    password: "Admin123!",
    permissions: Object.values(permissions),
  },
  "superviseur@amo.ml": {
    id: "usr_sup_001",
    displayName: "Ibrahim Keita",
    email: "superviseur@amo.ml",
    role: adminRoles.REGIONAL_SUPERVISOR,
    password: "Super123!",
    regionId: "reg_bamako",
    permissions: [
      permissions.dashboardReadRegion,
      permissions.beneficiaryReadBasic,
      permissions.beneficiaryReadSensitive,
      permissions.beneficiaryReadHealth,
      permissions.enrollmentRead,
      permissions.enrollmentValidate,
      permissions.enrollmentReturnForCorrection,
      permissions.enrollmentReject,
      permissions.agentRead,
      permissions.agentUpdate,
      permissions.agentSuspend,
      permissions.agentReactivate,
      permissions.establishmentRead,
      permissions.establishmentUpdate,
      permissions.deviceRead,
      permissions.deviceTrust,
      permissions.deviceRevoke,
      permissions.verificationRead,
      permissions.temporaryQrRead,
      permissions.temporaryQrRevoke,
      permissions.alertRead,
      permissions.alertAssign,
      permissions.alertInvestigate,
      permissions.reportRead,
      permissions.auditRead,
      permissions.settingsRead,
    ],
  },
  "auditeur@amo.ml": {
    id: "usr_aud_001",
    displayName: "Fatoumata Sangaré",
    email: "auditeur@amo.ml",
    role: adminRoles.AUDITOR,
    password: "Audit123!",
    permissions: [
      permissions.dashboardReadGlobal,
      permissions.beneficiaryReadBasic,
      permissions.enrollmentRead,
      permissions.agentRead,
      permissions.establishmentRead,
      permissions.deviceRead,
      permissions.verificationRead,
      permissions.temporaryQrRead,
      permissions.alertRead,
      permissions.reportRead,
      permissions.reportExport,
      permissions.auditRead,
    ],
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  ok: true;
  user: AdminSessionUser;
}

export interface LoginFailure {
  ok: false;
  code: "INVALID_CREDENTIALS" | "VALIDATION_ERROR";
  message: string;
}

export async function authenticateUser(
  credentials: LoginCredentials,
): Promise<LoginResult | LoginFailure> {
  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email || !password) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "L'identifiant et le mot de passe sont obligatoires.",
    };
  }

  const match = DEMO_USERS[email];
  if (!match || match.password !== password) {
    return {
      ok: false,
      code: "INVALID_CREDENTIALS",
      message: "Identifiants incorrects.",
    };
  }

  const { password: _password, ...user } = match;
  return { ok: true, user };
}

export function getDemoAccounts() {
  return Object.values(DEMO_USERS).map((user) => ({
    email: user.email,
    role: user.role,
    displayName: user.displayName,
  }));
}
