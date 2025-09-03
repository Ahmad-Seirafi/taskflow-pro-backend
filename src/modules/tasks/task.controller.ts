import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { z } from 'zod';
import { createTask, listTasks, updateTask, deleteTask } from './task.service.js';
import { TaskStatus, Priority } from '@prisma/client';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = (req as any).workspaceId as string;
  const dto = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    projectId: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assigneeId: z.string().optional(),
    dueDate: z.coerce.date().optional()
  }).parse(req.body);

  const task = await createTask({ workspaceId, ...dto });
  res.status(201).json({ task });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = (req as any).workspaceId as string;
  const filter = z.object({
    status: z.nativeEnum(TaskStatus).optional(),
    assigneeId: z.string().optional()
  }).parse(req.query);
  const tasks = await listTasks(workspaceId, filter);
  res.json({ tasks });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = (req as any).workspaceId as string;
  const taskId = z.string().min(5).parse(req.params.id);
  const data = z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assigneeId: z.string().optional(),
    dueDate: z.coerce.date().optional()
  }).parse(req.body);

  const task = await updateTask(taskId, workspaceId, data);
  res.json({ task });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = (req as any).workspaceId as string;
  const taskId = z.string().min(5).parse(req.params.id);
  await deleteTask(taskId, workspaceId);
  res.status(204).send();
});
