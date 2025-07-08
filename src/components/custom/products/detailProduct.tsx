'use client'


import {Category, Product} from '@prisma/client'
import {Checkbox} from '@/components/ui/checkbox'
import {Badge} from '@/components/ui/badge'
import {Label} from '@/components/ui/label'
import {Card, CardContent, CardHeader} from '@/components/ui/card'



interface DetailProductProps {
product: Product & {
    categories: Category[]
    userFavourite: boolean
}
}

export default function DetailProduct({product}: DetailProductProps)  {
    const {name, brand, numberOfItems, volumeContent, unitProduct, packagingProduct, categories, isOpen, userFavourite} = product

    return (
        <Card className="w-full">
            <CardHeader>
                <h1 className="text-3xl font-bold">
                    {name}{' '}
                    {numberOfItems > 0 && (
                        <span className="text-xl font-normal text-muted-foreground">
    ({numberOfItems}{' '}
                            {numberOfItems === 1 ? 'stuk' : 'stuks'})
  </span>)}
                </h1>
            </CardHeader>
            <CardContent>
                <div className="mt-1">
                <p>
                    <span className="font-semibold">Merk:</span> {brand}
                </p>
                <p>
                    <span className="font-semibold">Inhoud:</span>{' '}
                    {volumeContent != null
                        ? `${volumeContent} ${unitProduct?.toLowerCase() ?? ''}`
                        : '-'}
                </p>
                <p>
                    <span className="font-semibold">Verpakking:</span>{' '}
                    {packagingProduct ? `${packagingProduct.charAt(0).toUpperCase()}${packagingProduct.slice(1).toLowerCase()}` : '–'}
                </p>
            </div>
            {/* Categorieën */}
                <div className="flex items-center space-x-6 mt-3">
                <span className="font-semibold">{categories.length === 1 ? 'Categorie:' : 'Categorieën:'}</span>{' '}
                {categories.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <Badge key={c.id} variant="secondary">
                                {c.name}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <span>-</span>
                )}
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="isOpen" className="font-semibold">Geopend?</Label>
                    <Checkbox id="isOpen" defaultChecked={!!isOpen} disabled />
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="userFavourite" className="font-semibold">Favoriet?</Label>
                    <Checkbox
                        id="userFavourite"
                        defaultChecked={userFavourite}
                        disabled
                    />
                </div>

        </div>
            </CardContent>
        </Card>
    )
}

