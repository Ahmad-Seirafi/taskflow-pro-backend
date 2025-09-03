import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { z } from "zod";

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["createdAt", "updatedAt", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().optional(),
});

export async function listProjects(req: Request, res: Response) {
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  const q = listQuery.parse(req.query);

  const where: any = { workspaceId };
  if (q.search) where.name = { contains: q.search, mode: "insensitive" };

  const skip = (q.page - 1) * q.pageSize;
  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip,
      take: q.pageSize,
    }),
    prisma.project.count({ where }),
  ]);

  return res.json({
    items,
    meta: { page: q.page, pageSize: q.pageSize, total, totalPages: Math.ceil(total / q.pageSize) },
  });
}

// NOTE: اترك بقية الدوال كما كانت لديك.
