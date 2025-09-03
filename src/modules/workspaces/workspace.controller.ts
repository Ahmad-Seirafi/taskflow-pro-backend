import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createWorkspace, listUserWorkspaces, addMember } from './workspace.service.js';
import { z } from 'zod';

export const create = asyncHandler(async (req: Request & { userId?: string }, res: Response) => {
  const { name } = z.object({ name: z.string().min(2) }).parse(req.body);
  const ws = await createWorkspace(req.userId!, name);
  res.status(201).json({ workspace: ws });
});

export const listMine = asyncHandler(async (req: Request & { userId?: string }, res: Response) => {
  const list = await listUserWorkspaces(req.userId!);
  res.json({ workspaces: list });
});

export const invite = asyncHandler(async (req: Request, res: Response) => {
  const { email, role } = z.object({ email: z.string().email(), role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER') }).parse(req.body);
  const workspaceId = (req as any).workspaceId as string;
  const m = await addMember(workspaceId, email, role);
  res.status(201).json({ membership: m });
});
