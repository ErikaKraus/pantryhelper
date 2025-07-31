/*
  Warnings:

  - Made the column `remainingQuantity` on table `ProductEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ProductEntry" ALTER COLUMN "remainingQuantity" SET NOT NULL,
ALTER COLUMN "remainingQuantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
