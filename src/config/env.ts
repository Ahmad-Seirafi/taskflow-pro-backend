import 'dotenv/config';
import { z } from 'zod';

/**
 * ✅ يتحقق من متغيرات البيئة منذ الإقلاع حتى نتجنّب أخطاء لاحقًا.
 */
const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  SWAGGER_TITLE: z.string().default('Taskflow API'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  SWAGGER_DESCRIPTION: z.string().default('SaaS Task Manager API')
});

export const env = EnvSchema.parse(process.env);
