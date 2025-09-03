# taskflow-pro-backend (SaaS Task Manager) — Node 22 + TS + Prisma + PostgreSQL + Redis

## Quick Start
```bash
# 1) نسخ البيئة
cp .env.example .env

# 2) تثبيت
npm i

# 3) Prisma
npm run prisma:generate
npm run prisma:migrate -- --name init

# 4) تطوير
npm run dev

# Swagger
# افتح http://localhost:4000/docs
```

## Headers
- `Authorization: Bearer <accessToken>`
- `x-workspace-id: <workspaceId>`

## Auth
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ accessToken, refreshToken }`
- `POST /api/auth/refresh` `{ refreshToken }`

## Workspaces
- `POST /api/workspaces` `{ name }`
- `GET  /api/workspaces/mine`
- `POST /api/workspaces/invite` `{ email, role }`  *(يتطلب x-workspace-id و ADMIN)*

## Projects
- `POST /api/projects` `{ name }`  *(x-workspace-id)*
- `GET  /api/projects`            *(x-workspace-id)*

## Tasks
- `POST /api/tasks` `{ title, description?, projectId?, status?, priority?, assigneeId?, dueDate? }` *(x-workspace-id)*
- `GET  /api/tasks?status=TODO&assigneeId=<id>` *(x-workspace-id)*
- `PATCH /api/tasks/:id` `{ ... }` *(x-workspace-id)*
- `DELETE /api/tasks/:id` *(x-workspace-id)*

## Notes
- Multi-tenant عبر `workspaceId`.
- JWT/Refresh + حفظ refresh في DB (مع تدوير).
- بإمكانك لاحقًا إضافة RLS على PostgreSQL وتعزيز القيود في طبقة الاستعلامات.
