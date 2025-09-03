import { Router } from "express";
import { authGuard, requireWorkspace } from "../../middlewares/auth.js";
import * as ctrl from "./project.controller.js";

const router = Router();

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: List projects (paginated)
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [createdAt, updatedAt, name], default: createdAt }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", authGuard, requireWorkspace, ctrl.listProjects);

// NOTE: اترك بقية المسارات كما كانت لديك (POST/GET by id/PATCH/DELETE).
export default router;
