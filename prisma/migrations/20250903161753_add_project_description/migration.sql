-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_workspaceId_fkey";

-- DropIndex
DROP INDEX "public"."Project_workspaceId_idx";

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
