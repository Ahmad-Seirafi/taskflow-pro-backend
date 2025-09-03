import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import { createCommentSchema, listCommentsQuery } from "./comment.schemas.js";
import { ensureTaskInWorkspace, getMembership } from "./comment.service.js";

export async function createComment(req: Request, res: Response) {
  const { taskId } = req.params as { taskId: string };
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  const userId = (req as any).user?.id as string;

  const task = await ensureTaskInWorkspace(taskId, workspaceId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation error", details: parsed.error.issues });
  }

  const comment = await prisma.comment.create({
    data: { taskId, authorId: userId, content: parsed.data.content },
  });
  return res.status(201).json(comment);
}

export async function listComments(req: Request, res: Response) {
  const { taskId } = req.params as { taskId: string };
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";

  const task = await ensureTaskInWorkspace(taskId, workspaceId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const q = listCommentsQuery.parse(req.query);
  const skip = (q.page - 1) * q.pageSize;

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: q.order },
      skip,
      take: q.pageSize,
    }),
    prisma.comment.count({ where: { taskId } }),
  ]);

  return res.json({
    items,
    meta: { page: q.page, pageSize: q.pageSize, total, totalPages: Math.ceil(total / q.pageSize) },
  });
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  const userId = (req as any).user?.id as string;

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!comment || comment.task.workspaceId !== workspaceId) {
    return res.status(404).json({ error: "Comment not found" });
  }

  const membership = await getMembership(workspaceId, userId);
  const isAdmin = membership?.role === "ADMIN";
  const isOwner = (comment as any).authorId === userId;
  if (!isAdmin && !isOwner) return res.status(403).json({ error: "Forbidden" });

  await prisma.comment.delete({ where: { id } });
  return res.status(204).send();
}
