/*
  Warnings:

  - Added the required column `userId` to the `Roadmap` table without a default value. This is not possible if the table is not empty.
  - Made the column `stepId` on table `Topic` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Roadmap" DROP CONSTRAINT "Roadmap_id_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_stepId_fkey";

-- AlterTable
ALTER TABLE "Roadmap" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "stepId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
