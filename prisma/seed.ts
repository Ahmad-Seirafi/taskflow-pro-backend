import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1) مستخدم أساسي
  const email = 'admin@example.com';
  const passwordHash = await bcrypt.hash('secret123', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Admin', passwordHash }
  });

  // 2) Workspace + Membership (ADMIN)
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Workspace',
      ownerId: user.id,
      memberships: { create: { userId: user.id, role: 'ADMIN' } }
    }
  });

  // 3) Project
  const project = await prisma.project.create({
    data: { name: 'Website Redesign', workspaceId: workspace.id }
  });

  // 4) Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design Landing',
        description: 'Hero + pricing + footer',
        workspaceId: workspace.id,
        projectId: project.id,
        assigneeId: user.id,
        status: 'IN_PROGRESS',
        priority: 'HIGH'
      },
      {
        title: 'Set up CI',
        workspaceId: workspace.id,
        assigneeId: user.id,
        status: 'TODO',
        priority: 'MEDIUM'
      }
    ]
  });

  console.log('✅ Seed done.');
  console.log('User:', email, 'Password: secret123');
  console.log('workspaceId:', workspace.id, 'projectId:', project.id);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
