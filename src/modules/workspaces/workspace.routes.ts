import { Router } from "express";
// لاحظ: نستخدم auth المتوافق خلفياً بدل requireRole
import { auth, requireWorkspace } from "../../middlewares/auth.js";
import {
  create,
  // أضف هنا بقية الكونترولرز التي عندك إن وُجدت (list, getById, update, remove, ...)
  invite,
} from "./workspace.controller.js";

const r = Router();

/**
 * @openapi
 * /api/workspaces:
 *   post:
 *     summary: Create workspace
 *     tags: [Workspaces]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Workspace created
 */
r.post("/", auth(), create);

/**
 * @openapi
 * /api/workspaces/invite:
 *   post:
 *     summary: Invite member (ADMIN only)
 *     tags: [Workspaces]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Member invited
 */
r.post("/invite", auth({ requireWorkspace: true, admin: true }), invite);

// إن كانت لديك مسارات أخرى تعتمد على requireWorkspace فقط، استخدم:
/// r.get("/", auth(true), list)  // أو auth({ requireWorkspace: true })
// r.get("/:id", auth(true), getById)  // مثال إن أردت
// r.patch("/:id", auth({ requireWorkspace: true, admin: true }), update)  // مثال
// r.delete("/:id", auth({ requireWorkspace: true, admin: true }), remove)  // مثال

export default r;
