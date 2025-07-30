-- DropForeignKey
ALTER TABLE "public"."UserFavouriteProduct" DROP CONSTRAINT "UserFavouriteProduct_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';

-- AddForeignKey
ALTER TABLE "public"."UserFavouriteProduct" ADD CONSTRAINT "UserFavouriteProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
