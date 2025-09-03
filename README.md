# Taskflow Pro — Backend (Node 22 + TypeScript + Prisma + PostgreSQL + Redis)

[![CI](https://github.com/Ahmad-Seirafi/taskflow-pro-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Ahmad-Seirafi/taskflow-pro-backend/actions)

Taskflow Pro هو **API لإدارة المهام** مع Workspaces متعددة، أدوار (ADMIN/MEMBER)، توثيق Swagger، واختبارات Jest.

## ✨ الميزات
- TypeScript + Express + Prisma (PostgreSQL)
- Auth (JWT Access/Refresh + Rotation)
- Workspaces, Projects, Tasks (status/priority/dueDate/assignee)
- Swagger UI
- Redis جاهز للكاش / الـ rate limit
- Jest (Unit + E2E) + GitHub Actions CI
- Seed Script لبيانات تجريبية

## 🚀 التشغيل المحلي
```bash
cp .env.example .env
npm i
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
# http://localhost:4000/docs
