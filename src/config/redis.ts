// src/config/redis.ts
import { createRequire } from 'node:module';
import { env } from './env.js';

// ✅ استخدم require داخل ESM لتفادي مشاكل type/constructable مع ioredis@5
const require = createRequire(import.meta.url);
const IORedis = require('ioredis'); // any (CJS)
type RedisClient = InstanceType<typeof IORedis>;

export const redis: RedisClient = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: 2,
  enableAutoPipelining: true,
});

// لوج للأخطاء (نسكته أثناء الاختبارات)
redis.on('error', (err: unknown) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Redis error:', err);
  }
});

// إغلاق أنيق (مفيد بالاختبارات)
export async function closeRedis() {
  try {
    await redis.quit();
  } catch {
    /* noop */
  }
}
