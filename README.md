# Taskflow Pro — Backend (API Only)
[![CI](https://github.com/Ahmad-Seirafi/taskflow-pro-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Ahmad-Seirafi/taskflow-pro-backend/actions)

**Enterprise-grade Task Management API** مبني بـ **Node.js/Express + TypeScript + Prisma + PostgreSQL** 🚀  
مصمم ليكون مشروع **Portfolio** احترافي للتقديم على الوظائف.

- JWT Access/Refresh + RBAC (user / employer / admin)  
- Workspaces → Projects → Tasks → Comments  
- Swagger API docs  
- Production security (Helmet, Rate-limiting, CORS)  
- Pino HTTP logging  
- Dockerized stack (API + Postgres)  
- Automated tests (Jest + Supertest, Unit + E2E)  
- GitHub Actions (CI: migrate + seed + test)  
- Clean, maintainable structure  

---

## 🚀 Quick Start (Local)

1) **Install dependencies**
```bash
npm ci
cp .env.example .env
# عدّل القيم حسب بيئتك
Run Postgres (via Docker Compose)

bash
نسخ الكود
docker compose up -d
# API:    http://localhost:4000
# Docs:   http://localhost:4000/docs
# Health: http://localhost:4000/health
Generate Prisma Client

bash
نسخ الكود
npx prisma generate
Apply migrations & seed data

bash
نسخ الكود
# During development
npx prisma migrate dev --name init

# Or in CI/production (idempotent)
npx prisma migrate deploy

# Seed default admin user
npx prisma db seed
Dev mode (hot reload)

bash
نسخ الكود
npm run dev
Seeded admin after prisma db seed:

json
نسخ الكود
{ "email": "admin@example.com", "password": "secret123" }
📌 Core Endpoints
Auth

POST /api/auth/register { email, password, role }

POST /api/auth/login { email, password }

POST /api/auth/refresh { refreshToken }

GET /api/auth/me (Bearer token)

POST /api/auth/logout

Workspaces

POST /api/workspaces { name }

GET /api/workspaces

Projects (تحتاج x-workspace-id في الهيدر)

POST /api/projects { name, description }

GET /api/projects

Tasks (تحتاج x-workspace-id)

POST /api/tasks { title, description, priority, status, dueDate }

GET /api/tasks

Comments

POST /api/tasks/:taskId/comments { content }

GET /api/tasks/:taskId/comments?page=1&pageSize=10

🗂 Project Structure
arduino
نسخ الكود
src/
  config/        # env, logger, cors
  docs/          # swagger spec
  middlewares/   # auth, errors, rateLimiter
  modules/
    auth/        # login, register, tokens
    workspaces/  
    projects/    
    tasks/       
    comments/    
  services/      # token helpers, etc.
  utils/         # helpers
tests/           # jest + supertest (unit + e2e)
prisma/          # schema + migrations + seed
🧰 Tech Stack
Node.js 20 / Express — REST API

TypeScript — type safety

PostgreSQL + Prisma ORM — relational DB

JWT (Access + Refresh) — authentication & rotation

Pino HTTP logger — fast logging

Helmet + Rate-limit + CORS — security hardening

Docker Compose — containerized dev/prod environment

Jest + Supertest — automated testing

Swagger UI — API docs

🧪 Tests
Run full suite:

bash
نسخ الكود
npm test
Unit tests فقط:

bash
نسخ الكود
npx jest tests/unit
E2E فقط:

bash
نسخ الكود
npx jest tests/e2e --runInBand
⚠️ E2E يتطلب قاعدة بيانات + seed user بنفس إعدادات CI.

🔄 GitHub Actions (CI)
Workflow: .github/workflows/ci.yml

Steps:

Start Postgres service (jobs.services)

actions/setup-node + npm ci

npx prisma generate

npx prisma migrate deploy

npx prisma db seed ✅

npm test

Required CI env:

yaml
نسخ الكود
env:
  NODE_ENV: test
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/taskflow?schema=public
  JWT_ACCESS_SECRET: test_access_secret
  JWT_REFRESH_SECRET: test_refresh_secret
  ACCESS_TOKEN_EXPIRES_IN: 15m
  REFRESH_TOKEN_EXPIRES_IN: 7d
  CORS_ORIGINS: http://localhost:3000
📦 Production Build
Build & run with Docker:

bash
نسخ الكود
docker build -t taskflow-pro-api .
docker run -p 4000:4000 --env-file .env taskflow-pro-api
🔐 Security Highlights
JWT rotation & revocation

Role-based access control (user/employer/admin)

Rate limiting + Helmet + CORS

Zod validation + centralized error handler

Pino structured logs (request IDs)

🛠 Roadmap
Task assignments + email reminders (cron)

File uploads (S3/Cloudinary)

Advanced search & filters

WebSocket notifications

Admin dashboard & analytics

🧾 .env.example
env
نسخ الكود
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow?schema=public"

# JWT
JWT_ACCESS_SECRET="dev_access_secret"
JWT_REFRESH_SECRET="dev_refresh_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# CORS (comma-separated)
CORS_ORIGINS="http://localhost:3000"
💡 Hiring Notes
Clean & modular enterprise backend architecture

TypeScript + Prisma + PostgreSQL (modern & production-ready)

Includes unit + E2E tests with CI pipeline

Dockerized for easy demo and deployment

جاهز للعرض في الـ Portfolio عند التقديم على الوظائف 🇩🇪

📄 License
MIT