import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { z } from 'zod';
import { createProject, listProjects } from './project.service.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name } = z.object({ name: z.string().min(2) }).parse(req.body);
  const workspaceId = (req as any).workspaceId as string;
  const project = await createProject(workspaceId, name);
  res.status(201).json({ project });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = (req as any).workspaceId as string;
  const projects = await listProjects(workspaceId);
  res.json({ projects });
});
