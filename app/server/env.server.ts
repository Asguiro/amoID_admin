import { z } from "zod";

const developmentApiUrl = "http://localhost:4000";
const developmentSessionSecret =
  "dev-session-secret-change-me-in-production-32chars";

const envSchema = z
  .object({
    API_URL: z.string().url().default(developmentApiUrl),
    SESSION_SECRET: z.string().min(16).default(developmentSessionSecret),
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .superRefine((env, context) => {
    if (env.APP_ENV !== "production") return;

    if (env.API_URL === developmentApiUrl) {
      context.addIssue({
        code: "custom",
        path: ["API_URL"],
        message: "API_URL doit pointer vers l’API de production.",
      });
    }

    if (env.SESSION_SECRET === developmentSessionSecret) {
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
