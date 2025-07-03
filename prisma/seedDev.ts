import {PrismaClient, UnitProduct, UnitRecipe, PackagingProduct} from '@prisma/client'
import {hashPassword} from '@serverUtils'

export const seedDev = async (prisma: PrismaClient) => {

    //Seed GROUP
    const group1 = await prisma.group.create({
        data: {
            name: 'Testgroep van User1',
            inviteCode: 'DEVGROUPUSER1',
        },
    })

    const group2 = await prisma.group.create({
        data: {
            name: 'Testgroep van User2',
            inviteCode: 'DEVGROUPUSER2',
        },
    })

    // Seed USERS
    const [user1, user2] = await prisma.user.createManyAndReturn({
        data: [
            {
                email: 'user1@test.com',
                firstName: 'User',
                lastName: 'One',
                password: hashPassword('test123'),
                role: 'ADMIN',
                groupId: group1.id,
            },
            {
                email: 'user2@test.com',
                firstName: 'User',
                lastName: 'Two',
                password: hashPassword('test123'),
                role: 'USER',
                groupId: group2.id,
            },
        ],
    })



    //Seed CATEGORIES
    const categoryNames = [
        'Zuivel',
        'Pasta',
        'Groenten',
        'Fruit',
        'Veggie Zuivel',
        'Veggie Vlees',
        'Snacks',
        'Diepvries',
        'Sauzen',
        'IJS',
        'Snoep',
        'Koeken',
        'Chips',
        'Bakken & Braden',
    ]

    await prisma.category.createMany({
        data: categoryNames.map((name) => ({
            name,
            groupId: group1.id,
        })),
    })

    const categories = await prisma.category.findMany({
        where: {groupId: group1.id},
    })

    const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c.id]))


    //Seed PRODUCTS
    const productData = [
        {
            name: 'Volle melk',
            brand: 'Campina',
            packaging: 'BRIK',
            volumeContent: 1,
            unitProduct: 'L',
            numberOfItems: 2,
            category: 'Zuivel',
        },
        {
            name: 'Spaghetti',
            brand: 'Barilla',
            packaging: 'DOOS',
            volumeContent: 500,
            unitProduct: 'G',
            numberOfItems: 1,
            category: 'Pasta',
        },
        {
            name: 'Tomatensaus',
            brand: 'Bertolli',
            packaging: 'POTJE',
            volumeContent: 500,
            unitProduct: 'G',
            numberOfItems: 1,
            category: 'Sauzen',
        },
    ]

    const createdProducts = []

    for (const product of productData) {
        const created = await prisma.product.create({
            data: {
                name: product.name,
                brand: product.brand,
                packaging: product.packaging as PackagingProduct,
                volumeContent: product.volumeContent,
                unitProduct: product.unitProduct as UnitProduct,
                numberOfItems: product.numberOfItems,
                groupId: group1.id,
                categories: {
                    connect: [{id: categoryByName[product.category]}],
                },
            },
        })

        createdProducts.push({id: created.id, unit: product.unitProduct})
    }

    //Seed SHOPPINGLIST
    const shoppinglist = await prisma.shoppinglist.create({
        data: {
            name: 'Testlijstje',
            groupId: group1.id,
        }
    })

    //Seed DISH
    const recipe = await prisma.recipe.create({
        data: {
            name: 'Pasta met saus',
            instructions: 'Kook spaghetti en voeg saus toe.',
            groupId: group1.id,
            ingredients: {
                create: [
                    {
                        productId: createdProducts[1].id,
                        amount: 200,
                        unitRecipe: UnitRecipe.G,
                    },
                    {
                        productId: createdProducts[2].id,
                        amount: 100,
                        unitRecipe: UnitRecipe.G,
                    }
                ]
            }
        }
    })
}