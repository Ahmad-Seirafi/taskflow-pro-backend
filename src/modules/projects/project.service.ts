import { prisma } from '../../config/prisma.js';

/** Create project inside a workspace */
export async function createProject(workspaceId: string, name: string) {
  return prisma.project.create({ data: { name, workspaceId } });
}

/** List projects of workspace */
export async function listProjects(workspaceId: string) {
  return prisma.project.findMany({ where: { workspaceId }, orderBy: { createdAt: 'desc' } });
}
