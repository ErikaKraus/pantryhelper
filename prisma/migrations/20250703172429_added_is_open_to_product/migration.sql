-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isOpen" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
