import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { createProject } from "./project.controller.js";

const r = Router();

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
r.post("/", auth({ requireWorkspace: true }), createProject);

export default r;
