/*
  Warnings:

  - You are about to drop the column `packaging` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "packaging",
ADD COLUMN     "packagingProduct" "PackagingProduct";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
