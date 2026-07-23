import { apiRequest } from "~/server/api/client.server";
import { ApiClientError } from "~/server/api/errors.server";
import type { AdminSessionUser } from "~/types/admin";

/** Comptes seed API (dev) — alignés sur amo-id_api/prisma/seed.ts */
const DEMO_ACCOUNTS: Array<{
  email: string;
  role: string;
  displayName: string;
}> = [
  {
    email: "admin@amo-id.ml",
    role: "ADMIN_CENTRAL",
    displayName: "Admin Central",
  },
  {
    email: "regional@amo-id.ml",
    role: "REGIONAL_SUPERVISOR",
    displayName: "Superviseur Régional",
  },
];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  ok: true;
  user: AdminSessionUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginFailure {
  ok: false;
  code: "INVALID_CREDENTIALS" | "VALIDATION_ERROR";
  message: string;
}

type LoginApiResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: AdminSessionUser;
};

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

  try {
    const data = await apiRequest<LoginApiResponse>("/admin/auth/login", {
      method: "POST",
      body: { email, password },
    });

    return {
      ok: true,
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        message: error.message || "Identifiants incorrects.",
      };
    }
    throw error;
  }
}

export function getDemoAccounts() {
  return DEMO_ACCOUNTS;
}
