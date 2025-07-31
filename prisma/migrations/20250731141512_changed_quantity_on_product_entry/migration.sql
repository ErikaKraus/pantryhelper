/*
  Warnings:

  - You are about to drop the column `quantity` on the `ProductEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProductEntry" DROP COLUMN "quantity",
ADD COLUMN     "boughtQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "remainingQuantity" INTEGER;

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
