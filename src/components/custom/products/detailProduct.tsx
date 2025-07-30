'use client'

import {Category, Product} from '@prisma/client'
import {Checkbox} from '@/components/ui/checkbox'
import {Badge} from '@/components/ui/badge'
import {Label} from '@/components/ui/label'
import {Card, CardContent, CardHeader} from '@/components/ui/card'
import {Heart} from 'lucide-react'
import RestockToggle from '@/components/custom/products/restockToggle'
import EditProductDialog from '@/components/custom/products/editProductDialog'
import DeleteProductButton from '@/components/custom/products/deleteProductButton'
import {useActionState, useEffect, useState, useTransition} from "react";
import Actions from "@actions";

interface DetailProductProps {
product: Product & {
    categories: Category[]
    userFavourite: boolean
}
initialFavourite: boolean
}

export default function DetailProduct({product, initialFavourite}: DetailProductProps)  {
    const {name, brand, numberOfItems, volumeContent, unitProduct, packagingProduct, categories, isOpen} = product
    const [isFav, setIsFav] = useState(initialFavourite)
    const [isPending, startTransition] = useTransition()
    const toggle = Actions.toggleFavourite
    const onClick = () => {
        startTransition(() => {
            toggle({ productId: product.id })
            // optimistisch togglen
            setIsFav(f => !f)
        })
    }



    return (
        <div className="overflow-x-auto w-full">



        <Card className="w-full">
            <CardHeader>
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        <button
                            onClick={onClick}
                            disabled={isPending}
                            className="mr-3"
                            aria-label={isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                        >
                            {isFav
                                ? <Heart className="text-red-500" fill="red" size={24} />
                                : <Heart  className="text-gray-400" size={24} />}
                        </button>
                        {name}{' '}
                        {numberOfItems > 0 && (
                            <span className="text-xl font-normal text-muted-foreground">
                                ({numberOfItems}{' '}
                                {numberOfItems === 1 ? 'stuk' : 'stuks'})
                            </span>)}
                    </h1>

                    <div className="flex items-center justify-between">
                        {/*<Heart*/}
                        {/*    className={`h-6 w-6 cursor-pointer transition-colors ${*/}
                        {/*        userFavourite ? 'text-black' : 'text-gray-400'*/}
                        {/*    }`}*/}
                        {/*/>*/}

                        <EditProductDialog product={product} allCategories={categories}/>
                        <DeleteProductButton productId={product.id}/>
                    </div>
                </div>
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
                {numberOfItems === 1 && (
                    <div className="flex items-center w-20 space-x-2">
                        <Label htmlFor="isOpen" className="font-semibold">Geopend?</Label>
                        <Checkbox id="isOpen" defaultChecked={!!isOpen} disabled />
                    </div>

                )}
            </div>
                <div className="flex items-center space-x-2 mt-3">
                    <RestockToggle
                        productId={product.id}
                        needsRestockInitial={!!product.needsRestock}
                    />
                    <div>(minimale voorraad: {product.restockThreshold})</div>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}

