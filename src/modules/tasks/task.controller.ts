import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

/**
 * نجعل التحقق ألطف:
 * - title: مطلوب
 * - priority/status: قيم محددة
 * - projectId: اختياري cuid
 * - dueDate: نقبل أي قيمة ممكن تتحول Date (z.coerce.date) بدل .datetime الصارمة
 */
const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  description: z.string().trim().max(4000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  projectId: z.string().cuid().optional(),
  dueDate: z.coerce.date().optional(), // 👈 أهم تغيير
});

/** POST /api/tasks — إنشاء مهمة داخل Workspace (وربطها بمشروع اختياريًا) */
export async function createTask(req: Request, res: Response) {
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  if (!workspaceId) {
    return res.status(400).json({ error: "x-workspace-id header is required" });
  }

  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation error",
      details: parsed.error.issues, // يرجّع لك السبب بدقة
    });
  }

  // إن تم تمرير projectId نتحقق أنه ضمن نفس الـ workspace
  if (parsed.data.projectId) {
    const proj = await prisma.project.findFirst({
      where: { id: parsed.data.projectId, workspaceId },
      select: { id: true },
    });
    if (!proj) {
      return res.status(400).json({ error: "Project not found in this workspace" });
    }
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      priority: parsed.data.priority,
      status: parsed.data.status,
      projectId: parsed.data.projectId ?? null,
      dueDate: parsed.data.dueDate ?? null,
      workspaceId,
    },
  });

  return res.status(201).json(task);
}
