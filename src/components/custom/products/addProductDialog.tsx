'use client'


import {createProductSchema} from '@schemas'
import {z} from 'zod'
import {Category, PackagingProduct, UnitProduct} from '@prisma/client'
import {act, useActionState, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useZodValidatedForm} from '@hooks'
import Actions from '@actions'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Form from '../form/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FormError from '../form/formError'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {Checkbox} from '@/components/ui/checkbox'

type FormValues = z.infer<typeof createProductSchema>

interface AddProductDialogProps {
    categories: Category[]
    // categories: {id: string; name: string}
}

export default function AddProductDialog ({categories}: AddProductDialogProps)  {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [actionResult, createProduct, isPending] = useActionState(Actions.createProduct, {success: false})
    const hookForm = useZodValidatedForm(createProductSchema, {
        defaultValues: {
            name: '',
            brand: '',
            packagingProduct: undefined,
            volumeContent: undefined,
            unitProduct: undefined,
            numberOfItems: 1,
            needsRestock: false,
            isOpen: false,
            categoryIds: [],
            shoppinglistIds: [],
        },
    })
    const selectedCategories = hookForm.watch('categoryIds') || []

    useEffect(() => {
        if (!isPending && actionResult?.success) {
            hookForm.reset()
            setIsOpen(false)
            router.refresh()
        }
    }, [actionResult.success, isPending, hookForm, router])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">Nieuw product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nieuw product toevoegen</DialogTitle>
                </DialogHeader>

                <Form<FormValues>
                    hookForm={hookForm}
                    action={createProduct}
                    actionResult={actionResult}
                >
                    <div className="space-y-4">
                        {/* Naam */}
                        <div>
                            <Label htmlFor="name">Naam</Label>
                            <Input
                                className="mt-1"
                                id="name"
                                {...hookForm.register('name')}
                                placeholder="Productnaam"
                            />
                            <FormError
                                path="name"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>

                        {/* Merk */}
                        <div>
                            <Label htmlFor="brand">Merk</Label>
                            <Input
                                className="mt-1"
                                id="brand"
                                {...hookForm.register('brand')}
                                placeholder="Merk"
                            />
                            <FormError
                                path="brand"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>

                        {/* Aantal items */}
                        <div>
                            <Label htmlFor="numberOfItems">Aantal</Label>
                            <Input
                                className="mt-1"
                                id="numberOfItems"
                                type="number"
                                min={0}
                                {...hookForm.register('numberOfItems', { valueAsNumber: true })}
                            />
                            <FormError
                                path="numberOfItems"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>

                        {/* Verpakking */}
                        <div>
                            <Label htmlFor="packagingProduct" className="mb-1">Verpakking</Label>
                            <input
                                className="mt-1"
                                type="hidden"
                                name="packagingProduct"
                                value={hookForm.getValues('packagingProduct') || ''}
                            />
                            <Select
                                onValueChange={(val) => hookForm.setValue('packagingProduct', val as PackagingProduct)}
                                defaultValue=""
                            >
                                <SelectTrigger id="packagingProduct" className="w-full">
                                    <SelectValue placeholder="Kies verpakking" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel                                 className="mt-1"
                                        >Verpakking</SelectLabel>
                                        {Object.values(PackagingProduct).map((pkg) => (
                                            <SelectItem key={pkg} value={pkg}>
                                                {pkg.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormError
                                path="packaging"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>

                        {/* Inhoud en eenheid */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="volumeContent" >Inhoud</Label>
                                <Input
                                    className="mt-1"
                                    id="volumeContent"
                                    type="number"
                                    {...hookForm.register('volumeContent', { valueAsNumber: true })}
                                    placeholder="Aantal"
                                />
                                <FormError
                                    path="volumeContent"
                                    formErrors={hookForm.formState.errors}
                                    serverErrors={actionResult}
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="unitProduct" className="mb-1">Eenheid</Label>
                                <input
                                    type="hidden"
                                    name="unitProduct"
                                    value={hookForm.getValues('unitProduct') || ''}
                                />
                                <Select
                                    onValueChange={(val) => hookForm.setValue('unitProduct', val as UnitProduct)}
                                    defaultValue=""
                                >
                                    <SelectTrigger id="unitProduct" className="w-full">
                                        <SelectValue placeholder="Kies eenheid" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel
                                                className="mt-1"
                                            >Eenheid</SelectLabel>
                                            {Object.values(UnitProduct).map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormError
                                    path="unitProduct"
                                    formErrors={hookForm.formState.errors}
                                    serverErrors={actionResult}
                                />
                            </div>
                        </div>



                        {/* Categorieën */}
                        <div>
                            <Label className="mb-1">Categorieën</Label>
                            {/* i.p.v. 1 hidden input, maken we er N, met name categoryIds.0, categoryIds.1, … */}
                            {(selectedCategories || []).map((catId, i) => (
                                <input
                                    key={catId}
                                    type="hidden"
                                    name={`categoryIds.${i}`}
                                    value={catId}
                                />
                            ))}
                            <div className="max-h-40 overflow-y-auto border rounded p-2">
                                {categories.map((c) => (
                                    <div key={c.id} className="flex items-center">
                                        <Checkbox
                                            id={`cat-${c.id}`}
                                            checked={selectedCategories.includes(c.id)}
                                            onCheckedChange={(checked) => {
                                                const arr = hookForm.getValues('categoryIds') || []
                                                if (checked) {
                                                    hookForm.setValue('categoryIds', [...arr, c.id])
                                                } else {
                                                    hookForm.setValue(
                                                        'categoryIds',
                                                        arr.filter((x) => x !== c.id)
                                                    )
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`cat-${c.id}`} className="ml-2">
                                            {c.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            </div>

                            <FormError
                                path="categoryIds"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>


                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isPending}>
                                Annuleren
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Toevoegen…' : 'Toevoegen'}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

