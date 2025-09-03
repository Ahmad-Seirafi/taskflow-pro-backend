import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { z } from "zod";

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["createdAt", "dueDate", "priority", "status", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  search: z.string().trim().optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
});

export async function listTasks(req: Request, res: Response) {
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  const q = listQuery.parse(req.query);

  const where: any = { workspaceId };
  if (q.status) where.status = q.status;
  if (q.priority) where.priority = q.priority;
  if (q.assigneeId) where.assigneeId = q.assigneeId;
  if (q.projectId) where.projectId = q.projectId;
  if (q.search) {
    where.OR = [
      { title: { contains: q.search, mode: "insensitive" } },
      { description: { contains: q.search, mode: "insensitive" } },
    ];
  }
  if (q.dueFrom || q.dueTo) {
    where.dueDate = {};
    if (q.dueFrom) where.dueDate.gte = q.dueFrom;
    if (q.dueTo) where.dueDate.lte = q.dueTo;
  }

  const skip = (q.page - 1) * q.pageSize;
  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip,
      take: q.pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  return res.json({
    items,
    meta: { page: q.page, pageSize: q.pageSize, total, totalPages: Math.ceil(total / q.pageSize) },
  });
}

// NOTE: اترك باقي الدوال (create/update/delete/get) كما كانت لديك.
// لو هالملف كان فيه دوال أخرى عندك، انسخها أسفل هذا التعليق بلا تغيير.
