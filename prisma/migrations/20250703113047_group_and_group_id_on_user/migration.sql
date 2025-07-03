/*
  Warnings:

  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `groupId` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `groupId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `groupId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_userId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "groupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "groupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupId" UUID NOT NULL;

-- DropTable
DROP TABLE "UserGroup";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
