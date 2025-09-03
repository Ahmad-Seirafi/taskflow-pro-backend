import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),
  SWAGGER_TITLE: z.string().default("Taskflow API"),
  SWAGGER_VERSION: z.string().default("1.0.0"),
  SWAGGER_DESCRIPTION: z.string().default("SaaS Task Manager API"),
  CORS_ORIGIN: z.string().default("*"), // e.g. http://localhost:3000,https://app.example.com
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(120),
});

export const env = envSchema.parse(process.env);
