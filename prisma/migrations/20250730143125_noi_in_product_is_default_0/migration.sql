-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "numberOfItems" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';
