-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PackagingProduct" AS ENUM ('BRIK', 'BLIK', 'DOOS', 'FLES', 'ZAK', 'POTJE', 'VLOOTJE');

-- CreateEnum
CREATE TYPE "UnitProduct" AS ENUM ('ML', 'CL', 'DL', 'L', 'MG', 'G', 'KG');

-- CreateEnum
CREATE TYPE "UnitDish" AS ENUM ('ML', 'CL', 'DL', 'L', 'MG', 'G', 'KG', 'CUP', 'TBSP', 'TSP');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "numberOfItems" INTEGER NOT NULL,
    "volumeContent" INTEGER,
    "packaging" "PackagingProduct",
    "unitProduct" "UnitProduct",
    "purchaseDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "needsRestock" BOOLEAN,
    "groupId" UUID,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "groupId" UUID,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shoppinglist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "groupId" UUID,

    CONSTRAINT "Shoppinglist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppinglistProduct" (
    "shoppinglistId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ShoppinglistProduct_pkey" PRIMARY KEY ("shoppinglistId","productId")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "groupId" UUID,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDish" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "amount" INTEGER NOT NULL,
    "unitDish" "UnitDish" NOT NULL,
    "productId" UUID NOT NULL,
    "dishId" UUID NOT NULL,

    CONSTRAINT "ProductDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductEntry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "purchaseDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "productId" UUID NOT NULL,
    "unitProduct" "UnitProduct",

    CONSTRAINT "ProductEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavouriteProduct" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "UserFavouriteProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavouriteDish" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "dishId" UUID NOT NULL,

    CONSTRAINT "UserFavouriteDish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" VARCHAR NOT NULL,
    "activeFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeUntil" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP + interval '1 day',
    "userId" UUID NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_inviteCode_key" ON "Group"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_id_key" ON "UserGroup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_userId_groupId_key" ON "UserGroup"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "Category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shoppinglist_id_key" ON "Shoppinglist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Dish_id_key" ON "Dish"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDish_id_key" ON "ProductDish"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDish_productId_dishId_key" ON "ProductDish"("productId", "dishId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductEntry_id_key" ON "ProductEntry"("id");

-- CreateIndex
CREATE INDEX "ProductEntry_productId_idx" ON "ProductEntry"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteProduct_id_key" ON "UserFavouriteProduct"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteProduct_userId_productId_key" ON "UserFavouriteProduct"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteDish_id_key" ON "UserFavouriteDish"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteDish_userId_dishId_key" ON "UserFavouriteDish"("userId", "dishId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shoppinglist" ADD CONSTRAINT "Shoppinglist_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppinglistProduct" ADD CONSTRAINT "ShoppinglistProduct_shoppinglistId_fkey" FOREIGN KEY ("shoppinglistId") REFERENCES "Shoppinglist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppinglistProduct" ADD CONSTRAINT "ShoppinglistProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDish" ADD CONSTRAINT "ProductDish_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDish" ADD CONSTRAINT "ProductDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductEntry" ADD CONSTRAINT "ProductEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteProduct" ADD CONSTRAINT "UserFavouriteProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteProduct" ADD CONSTRAINT "UserFavouriteProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteDish" ADD CONSTRAINT "UserFavouriteDish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteDish" ADD CONSTRAINT "UserFavouriteDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
