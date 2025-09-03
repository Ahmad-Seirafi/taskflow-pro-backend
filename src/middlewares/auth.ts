import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

/** Sign JWT with expiration (used in auth.service.ts) */
export function signJwt(payload: object, secret: string, expiresIn: string) {
  return jwt.sign(payload as any, secret as unknown as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

/** Bearer auth guard -> sets req.user */
export async function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const parts = header.split(" ");
    const token = parts.length === 2 && parts[0].toLowerCase() === "bearer" ? parts[1] : "";
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as unknown as jwt.Secret) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.sub as string } });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    (req as any).user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

/** Require x-workspace-id header and membership */
export async function requireWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const workspaceId = (req.headers["x-workspace-id"] as string) || "";
    if (!workspaceId) return res.status(400).json({ error: "x-workspace-id header is required" });

    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const membership = await prisma.membership.findFirst({ where: { workspaceId, userId } });
    if (!membership) return res.status(403).json({ error: "Not a member of this workspace" });

    (req as any).membership = membership;
    next();
  } catch {
    return res.status(500).json({ error: "Workspace membership check failed" });
  }
}

/** Admin only */
type RoleName = "ADMIN" | "MEMBER";
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const role = (req as any).membership?.role as RoleName | undefined;
  if (role !== "ADMIN") return res.status(403).json({ error: "Admins only" });
  next();
}

/** Allow selected roles */
export function requireRole(allowed: RoleName[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).membership?.role as RoleName | undefined;
    if (!role) return res.status(403).json({ error: "Not a member of this workspace" });
    if (!allowed.includes(role)) return res.status(403).json({ error: "Insufficient role" });
    next();
  };
}

/** Back-compat: auth() / auth(true) / auth(false,true) / auth({ requireWorkspace, admin }) */
type AuthOpts = boolean | { requireWorkspace?: boolean; admin?: boolean };
export function auth(opts?: AuthOpts, maybeAdmin?: boolean) {
  let requireWs = false;
  let admin = false;
  if (typeof opts === "boolean") { requireWs = opts; admin = Boolean(maybeAdmin); }
  else if (typeof opts === "object" && opts) { requireWs = !!opts.requireWorkspace; admin = !!opts.admin; }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await new Promise<void>((resolve, reject) => authGuard(req, res, (e?: any)=> e?reject(e):resolve()));
      if (requireWs) await new Promise<void>((resolve, reject)=> requireWorkspace(req, res, (e?: any)=> e?reject(e):resolve()));
      if (admin) await new Promise<void>((resolve, reject)=> requireAdmin(req, res, (e?: any)=> e?reject(e):resolve()));
      next();
    } catch {
      if (!res.headersSent) res.status(401).json({ error: "Unauthorized" });
    }
  };
}
