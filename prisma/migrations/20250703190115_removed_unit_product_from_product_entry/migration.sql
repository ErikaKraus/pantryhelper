/*
  Warnings:

  - You are about to drop the column `unitProduct` on the `ProductEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductEntry" DROP COLUMN "unitProduct";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
