import { Router } from 'express';
import { auth, requireWorkspace } from '../../middlewares/auth.js';
import { create, list } from './project.controller.js';

const r = Router();

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a project in current workspace
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: header
 *         name: x-workspace-id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Website Redesign" }
 *     responses:
 *       201:
 *         description: Project created
 */
r.post('/', auth(true), requireWorkspace, create);

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects in current workspace
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: header
 *         name: x-workspace-id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of projects
 */
r.get('/', auth(true), requireWorkspace, list);

export default r;
