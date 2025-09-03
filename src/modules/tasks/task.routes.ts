import { Router } from 'express';
import { auth, requireWorkspace } from '../../middlewares/auth.js';
import { create, list, update, remove } from './task.controller.js';

const r = Router();

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
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
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Design Landing Page" }
 *               description: { type: string, example: "Hero + pricing + footer" }
 *               projectId: { type: string, nullable: true }
 *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE], default: TODO }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH], default: MEDIUM }
 *               assigneeId: { type: string, nullable: true }
 *               dueDate: { type: string, format: date-time, nullable: true }
 *     responses:
 *       201:
 *         description: Task created
 */
r.post('/', auth(true), requireWorkspace, create);

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks (optional filtering)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: header
 *         name: x-workspace-id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         required: false
 *         schema: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *       - in: query
 *         name: assigneeId
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of tasks
 */
r.get('/', auth(true), requireWorkspace, list);

/**
 * @openapi
 * /api/tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: header
 *         name: x-workspace-id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *               assigneeId: { type: string }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Task updated
 */
r.patch('/:id', auth(true), requireWorkspace, update);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: header
 *         name: x-workspace-id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Task deleted
 */
r.delete('/:id', auth(true), requireWorkspace, remove);

export default r;
