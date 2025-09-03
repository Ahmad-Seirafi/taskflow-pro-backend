import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

const createSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
});

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

/** POST /api/workspaces — ينشئ Workspace ويجعل المُنشئ ADMIN */
export async function create(req: Request, res: Response) {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation error", details: parsed.error.issues });
  }

  const ws = await prisma.workspace.create({
    data: {
      name: parsed.data.name,
      ownerId: userId,
      memberships: {
        create: { userId, role: "ADMIN" },
      },
    },
  });

  return res.status(201).json(ws);
}

/**
 * POST /api/workspaces/invite — دعوة مستخدم بالـ email إلى Workspace
 * يحتاج: Authorization + x-workspace-id (والمُستدعي ADMIN)
 */
export async function invite(req: Request, res: Response) {
  const workspaceId = (req.headers["x-workspace-id"] as string) || "";
  if (!workspaceId) return res.status(400).json({ error: "x-workspace-id header is required" });

  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation error", details: parsed.error.issues });
  }

  // لازم يكون الشخص المدعو موجود مسبقًا (ما عندنا جدول Invites الآن)
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return res.status(404).json({ error: "User not found. Create the user first." });
  }

  // لو عنده عضوية مسبقًا نحدّث الدور (اختياري) وإلا ننشئ عضوية جديدة
  const existing = await prisma.membership.findFirst({
    where: { workspaceId, userId: user.id },
  });

  let membership;
  if (existing) {
    membership = await prisma.membership.update({
      where: { id: existing.id },
      data: { role: parsed.data.role },
    });
  } else {
    membership = await prisma.membership.create({
      data: { workspaceId, userId: user.id, role: parsed.data.role },
    });
  }

  return res.status(200).json({ ok: true, membership });
}
