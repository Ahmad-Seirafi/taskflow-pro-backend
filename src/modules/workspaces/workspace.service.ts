import { prisma } from '../../config/prisma.js';

/** Create workspace and make creator ADMIN */
export async function createWorkspace(userId: string, name: string) {
  return prisma.workspace.create({
    data: {
      name,
      ownerId: userId,
      memberships: { create: { userId, role: 'ADMIN' } }
    }
  });
}

/** List workspaces of a user */
export async function listUserWorkspaces(userId: string) {
  return prisma.workspace.findMany({
    where: { memberships: { some: { userId } } },
    orderBy: { createdAt: 'desc' }
  });
}

/** Invite member by email */
export async function addMember(workspaceId: string, email: string, role: 'ADMIN' | 'MEMBER') {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: 'User not found' };
  return prisma.membership.create({ data: { userId: user.id, workspaceId, role } });
}
