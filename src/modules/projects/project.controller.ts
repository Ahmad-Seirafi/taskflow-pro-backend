import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

const createProjectSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  description: z.string().trim().max(1000).optional(),
});

/** POST /api/projects — إنشاء مشروع داخل Workspace */
export async function createProject(req: Request, res: Response) {
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  if (!workspaceId) {
    return res.status(400).json({ error: "x-workspace-id header is required" });
  }

  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation error", details: parsed.error.issues });
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      workspaceId,
      description: parsed.data.description ?? null, // صار العمود موجود في DB
    },
  });

  return res.status(201).json(project);
}
