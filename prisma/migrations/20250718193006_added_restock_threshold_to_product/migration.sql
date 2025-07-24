-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "restockThreshold" INTEGER;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
