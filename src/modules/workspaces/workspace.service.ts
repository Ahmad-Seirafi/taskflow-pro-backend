import { prisma } from "../../config/prisma.js";

/** Create workspace and make creator ADMIN */
export async function createWorkspace(userId: string, name: string) {
  // مهم: نمرّر ownerId وعضوية ADMIN بنفس userId
  const ws = await prisma.workspace.create({
    data: {
      name,
      ownerId: userId,
      memberships: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
  });
  return ws;
}
