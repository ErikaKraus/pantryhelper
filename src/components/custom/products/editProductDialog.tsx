import { useActionState, useEffect, useState} from 'react'
import {Category, PackagingProduct, Product, UnitProduct} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {useZodValidatedForm} from '@hooks'
import {updateProductSchema} from '@schemas'
import Actions from '@actions'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {SquarePen} from 'lucide-react'
import Form from '@/components/custom/form/form'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import FormError from '@/components/custom/form/formError'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import SubmitButtonWithLoading from '@/components/custom/button/submitButtonWithLoading'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Checkbox} from '@/components/ui/checkbox'

interface EditProductDialogProps {
    product: Product & { categories: Category[] }
    allCategories: Category[]
}

export default function EditProductDialog ({product, allCategories}: EditProductDialogProps)  {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [actionResult, updateProduct, isPending] = useActionState(Actions.updateProduct, {success: false})

    const hookForm = useZodValidatedForm(updateProductSchema, {
        defaultValues: {
            id: product.id,
            name: product.name,
            brand: product.brand,
            packagingProduct: product.packagingProduct ?? undefined,
            volumeContent: product.volumeContent ?? undefined,
            unitProduct: product.unitProduct ?? undefined,
            numberOfItems: product.numberOfItems,
            needsRestock: product.needsRestock ?? false,
            isOpen: product.isOpen ?? false,
            categoryIds: product.categories ? product.categories.map(category => category.id) : [],
        }
    })

    //Use watch to see the current packaging and unit
    const watchedPackaging = hookForm.watch('packagingProduct') ?? ''
    const watchedUnit = hookForm.watch('unitProduct') ?? ''
    const watchedCategories = hookForm.watch('categoryIds') ?? []


    useEffect(() => {
        if(!isPending && actionResult?.success) {
            setIsOpen(false)
            router.refresh()
        }
    }, [actionResult.success, isPending, router])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button aria-label="Aankoop bewerken" className="text-gray-500 hover:text-blue-600" size="sm" variant="outline">
                    <SquarePen size={16}/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product.name} bewerken</DialogTitle>
                </DialogHeader>

                <Form hookForm={hookForm} action={updateProduct} actionResult={actionResult}>
                    <input type="hidden" {...hookForm.register('id')} />

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="mb-1">Naam</Label>
                            <Input id="name" {...hookForm.register('name')}  />
                            <FormError path="name" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="brand" className="mb-1">Merk</Label>
                            <Input id="brand" {...hookForm.register('brand')}  />
                            <FormError path="brand" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="numberOfItems" className="mb-1">Aantal</Label>
                            <Input id="numberOfItems" {...hookForm.register('numberOfItems')}  />
                            <FormError path="numberOfItems" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="packagingProduct" className="mb-1">Verpakking</Label>
                            <Select
                                onValueChange={(val) =>
                                    hookForm.setValue('packagingProduct', val as PackagingProduct)
                                }
                                value={watchedPackaging}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kies verpakking" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Verpakking</SelectLabel>
                                        {Object.values(PackagingProduct).map((pkg) => (
                                            <SelectItem key={pkg} value={pkg}>
                                                {pkg.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormError
                                path="packagingProduct"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                            <input
                                type="hidden"
                                name="packagingProduct"
                                value={watchedPackaging}
                            />
                        </div>


                        <div>
                            <Label className="mb-1">Inhoud</Label>
                            <Input id="volumeContent" {...hookForm.register('volumeContent')}  />
                            <FormError path="volumeContent" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="unitProduct" className="mb-1">Eenheid</Label>
                            <Select
                                onValueChange={(val) =>
                                    hookForm.setValue('unitProduct', val as UnitProduct)
                                }
                                value={watchedUnit}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kies eenheid" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Eenheid</SelectLabel>
                                        {Object.values(UnitProduct).map((u) => (
                                            <SelectItem key={u} value={u}>
                                                {u.toLowerCase()}
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
                            <input
                                type="hidden"
                                name="unitProduct"
                                value={watchedUnit}
                            />
                        </div>

                        <div>
                            <Label>Categorieën</Label>

                            {/* hidden inputs voor FormData */}
                            {watchedCategories.map((cid, i) => (
                                <input
                                    key={i}
                                    type="hidden"
                                    name={`categoryIds.${i}`}
                                    value={cid}
                                />
                            ))}

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {watchedCategories.length > 0
                                            ? allCategories
                                                .filter((c) => watchedCategories.includes(c.id))
                                                .map((c) => c.name)
                                                .join(', ')
                                            : 'Selecteer categorieën'}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-64 p-2">
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {allCategories.map((c) => {
                                            const checked = watchedCategories.includes(c.id)
                                            return (
                                                <div key={c.id} className="flex items-center">
                                                    <Checkbox
                                                        id={`cat-${c.id}`}
                                                        checked={checked}
                                                        onCheckedChange={(on) => {
                                                            const arr = hookForm.getValues('categoryIds') || []
                                                            hookForm.setValue(
                                                                'categoryIds',
                                                                on ? [...arr, c.id] : arr.filter((x) => x !== c.id)
                                                            )
                                                        }}
                                                    />
                                                    <Label htmlFor={`cat-${c.id}`} className="ml-2">
                                                        {c.name}
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <FormError
                                path="categoryIds"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>

                    </div>



                    <DialogFooter className="mt-5">
                        <SubmitButtonWithLoading text="Opslaan" loadingText="Opslaan.."></SubmitButtonWithLoading>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false)
                                hookForm.reset({id: product.id, name: product.name})
                            }}>
                            Annuleren
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

