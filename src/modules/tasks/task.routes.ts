import { Router } from "express";
import { authGuard, requireWorkspace } from "../../middlewares/auth.js";
import * as ctrl from "./task.controller.js";

const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: List tasks (paginated)
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [createdAt, dueDate, priority, status, title], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *       - in: query
 *         name: assigneeId
 *         schema: { type: string }
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: dueFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: dueTo
 *         schema: { type: string, format: date-time }
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", authGuard, requireWorkspace, ctrl.listTasks);

// NOTE: اترك بقية المسارات كما كانت لديك (POST/GET by id/PATCH/DELETE).
export default router;
