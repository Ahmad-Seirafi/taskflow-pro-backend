import { Router } from 'express';
import { auth, requireWorkspace, requireRole } from '../../middlewares/auth.js';
import { create, listMine, invite } from './workspace.controller.js';

const r = Router();

/**
 * @openapi
 * /api/workspaces:
 *   post:
 *     tags: [Workspaces]
 *     summary: Create a workspace (user becomes ADMIN)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "My Team" }
 *     responses:
 *       201:
 *         description: Workspace created
 */
r.post('/', auth(true), create);

/**
 * @openapi
 * /api/workspaces/mine:
 *   get:
 *     tags: [Workspaces]
 *     summary: List workspaces I'm member of
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of workspaces
 */
r.get('/mine', auth(true), listMine);

/**
 * @openapi
 * /api/workspaces/invite:
 *   post:
 *     tags: [Workspaces]
 *     summary: Invite a member to the current workspace (ADMIN only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: header
 *         name: x-workspace-id
 *         required: true
 *         schema: { type: string }
 *         description: Current workspace id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEMBER]
 *                 default: MEMBER
 *     responses:
 *       201:
 *         description: Member invited
 */
r.post('/invite', auth(true), requireWorkspace, requireRole(['ADMIN']), invite);

export default r;
