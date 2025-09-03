import { prisma } from "../../config/prisma.js";

export async function ensureTaskInWorkspace(taskId: string, workspaceId: string) {
  return prisma.task.findFirst({ where: { id: taskId, workspaceId } });
}

export async function getMembership(workspaceId: string, userId: string) {
  return prisma.membership.findFirst({ where: { workspaceId, userId } });
}
