import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url().default("http://localhost:4000"),
  SESSION_SECRET: z
    .string()
    .min(16)
    .default("dev-session-secret-change-me-in-production-32chars"),
  APP_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
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
