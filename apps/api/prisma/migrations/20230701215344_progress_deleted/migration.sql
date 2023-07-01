/*
  Warnings:

  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropTable
DROP TABLE "Progress";

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
