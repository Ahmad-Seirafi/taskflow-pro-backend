import { Router } from "express";
import { authGuard, requireWorkspace } from "../../middlewares/auth.js";
import { createComment, listComments, deleteComment } from "./comment.controller.js";

const router = Router();

/**
 * @openapi
 * /api/tasks/{taskId}/comments:
 *   get:
 *     summary: List comments for a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Create a comment on a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { content: { type: string } }
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
router.get("/tasks/:taskId/comments", authGuard, requireWorkspace, listComments);
router.post("/tasks/:taskId/comments", authGuard, requireWorkspace, createComment);

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment (owner or ADMIN)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: No Content }
 */
router.delete("/comments/:id", authGuard, requireWorkspace, deleteComment);

export default router;
