import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Secret, JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export interface AuthPayload extends JwtPayload {
  sub: string; // userId
}

/** Verify access token and attach userId */
export function auth(required: boolean = true) {
  return async (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      return required ? res.status(401).json({ error: 'No token provided' }) : next();
    }
    const token = header.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as Secret) as AuthPayload;
      req.userId = decoded.sub;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

/** Helper to sign JWT (aligned with your preference for casting) */
export function signJwt(payload: object, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret as Secret, { expiresIn } as unknown as SignOptions) as string;
}

/** Ensure user is a member of current workspace via x-workspace-id header */
export async function requireWorkspace(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  const userId = req.userId;
  const workspaceId = req.header('x-workspace-id');
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!workspaceId) return res.status(400).json({ error: 'x-workspace-id header is required' });

  const membership = await prisma.membership.findFirst({ where: { userId, workspaceId } });
  if (!membership) return res.status(403).json({ error: 'Not a member of this workspace' });

  (req as any).workspaceId = workspaceId;
  (req as any).membershipRole = membership.role;
  next();
}

/** RBAC: allow only specified roles (e.g., ADMIN) */
export function requireRole(roles: Array<'ADMIN' | 'MEMBER'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).membershipRole as 'ADMIN' | 'MEMBER' | undefined;
    if (!role) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(role)) return res.status(403).json({ error: 'Insufficient role' });
    next();
  };
}
