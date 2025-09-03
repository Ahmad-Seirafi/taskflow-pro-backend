import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { createTask } from "./task.controller.js";

const r = Router();

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
r.post("/", auth({ requireWorkspace: true }), createTask);

export default r;
