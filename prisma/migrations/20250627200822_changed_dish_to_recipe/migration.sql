/*
  Warnings:

  - You are about to drop the `Dish` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductDish` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavouriteDish` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UnitRecipe" AS ENUM ('ML', 'CL', 'DL', 'L', 'MG', 'G', 'KG', 'CUP', 'TBSP', 'TSP');

-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDish" DROP CONSTRAINT "ProductDish_dishId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDish" DROP CONSTRAINT "ProductDish_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavouriteDish" DROP CONSTRAINT "UserFavouriteDish_dishId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavouriteDish" DROP CONSTRAINT "UserFavouriteDish_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "activeUntil" SET DEFAULT CURRENT_TIMESTAMP + interval '1 day';

-- DropTable
DROP TABLE "Dish";

-- DropTable
DROP TABLE "ProductDish";

-- DropTable
DROP TABLE "UserFavouriteDish";

-- DropEnum
DROP TYPE "UnitDish";

-- CreateTable
CREATE TABLE "Recipe" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "groupId" UUID,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductRecipe" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" INTEGER NOT NULL,
    "unitRecipe" "UnitRecipe" NOT NULL,
    "productId" UUID NOT NULL,
    "recipeId" UUID NOT NULL,

    CONSTRAINT "ProductRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavouriteRecipe" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "recipeId" UUID NOT NULL,

    CONSTRAINT "UserFavouriteRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_id_key" ON "Recipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductRecipe_id_key" ON "ProductRecipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductRecipe_productId_recipeId_key" ON "ProductRecipe"("productId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteRecipe_id_key" ON "UserFavouriteRecipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteRecipe_userId_recipeId_key" ON "UserFavouriteRecipe"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRecipe" ADD CONSTRAINT "ProductRecipe_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRecipe" ADD CONSTRAINT "ProductRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteRecipe" ADD CONSTRAINT "UserFavouriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteRecipe" ADD CONSTRAINT "UserFavouriteRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
