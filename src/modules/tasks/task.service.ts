import { prisma } from '../../config/prisma.js';
import type { Priority, TaskStatus } from '@prisma/client';

/** Create task within workspace (project optional) */
export async function createTask(params: {
  workspaceId: string;
  projectId?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: Date;
}) {
  const { workspaceId, projectId, title, description, status, priority, assigneeId, dueDate } = params;
  return prisma.task.create({
    data: { workspaceId, projectId, title, description, status, priority, assigneeId, dueDate }
  });
}

/** List tasks with optional filters */
export async function listTasks(workspaceId: string, filter?: { status?: TaskStatus; assigneeId?: string }) {
  return prisma.task.findMany({
    where: { workspaceId, ...(filter?.status ? { status: filter.status } : {}), ...(filter?.assigneeId ? { assigneeId: filter.assigneeId } : {}) },
    orderBy: { createdAt: 'desc' }
  });
}

/** Update task */
export async function updateTask(taskId: string, workspaceId: string, data: Partial<{ title: string; description: string; status: TaskStatus; priority: Priority; assigneeId: string; dueDate: Date }>) {
  return prisma.task.update({ where: { id: taskId }, data });
}

/** Delete task */
export async function deleteTask(taskId: string, workspaceId: string) {
  return prisma.task.delete({ where: { id: taskId } });
}
