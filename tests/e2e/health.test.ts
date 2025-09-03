import request from 'supertest';
import { createApp } from '../../src/app.js'; // ✅ لازم .js مع NodeNext (Jest يطابقه لـ .ts)

const app = createApp();

test('GET /health -> { ok: true }', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});
