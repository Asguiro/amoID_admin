import { z } from "zod";

const developmentApiUrl = "http://localhost:4000";
const developmentSessionSecret =
  "dev-session-secret-change-me-in-production-32chars";

function isDeployedRuntime(): boolean {
  return (
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production" ||
    process.env.APP_ENV === "production"
  );
}

function isLocalApiUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

const envSchema = z
  .object({
    API_URL: isDeployedRuntime()
      ? z.string().url({ message: "API_URL est obligatoire en déploiement." })
      : z.string().url().default(developmentApiUrl),
    SESSION_SECRET: z.string().min(16).default(developmentSessionSecret),
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .superRefine((env, context) => {
    const deployed = isDeployedRuntime() || env.APP_ENV === "production";

    if (deployed && isLocalApiUrl(env.API_URL)) {
      context.addIssue({
        code: "custom",
        path: ["API_URL"],
        message:
          "API_URL ne peut pas pointer vers localhost en déploiement. Utilisez https://amo-id-api.onrender.com",
      });
    }

    if (env.APP_ENV === "production" && env.API_URL === developmentApiUrl) {
      context.addIssue({
        code: "custom",
        path: ["API_URL"],
        message: "API_URL doit pointer vers l’API de production.",
      });
    }

    if (
      (deployed || env.APP_ENV === "production") &&
      env.SESSION_SECRET === developmentSessionSecret
    ) {
      context.addIssue({
        code: "custom",
        path: ["SESSION_SECRET"],
        message: "SESSION_SECRET doit être défini explicitement en production.",
      });
    }
  });

export type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    API_URL: process.env.API_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    APP_ENV: process.env.APP_ENV ?? process.env.NODE_ENV,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function isProduction(): boolean {
  return getServerEnv().APP_ENV === "production";
}
