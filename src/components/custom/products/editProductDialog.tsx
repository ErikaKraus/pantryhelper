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

interface EditProductDialogProps {
    product: Product &
        { categories: Category[] }
}

export default function EditProductDialog ({product}: EditProductDialogProps)  {
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
                            <Label htmlFor="name">Naam</Label>
                            <Input id="name" {...hookForm.register('name')}  />
                            <FormError path="name" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="brand">Merk</Label>
                            <Input id="brand" {...hookForm.register('brand')}  />
                            <FormError path="brand" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="numberOfItems">Aantal</Label>
                            <Input id="numberOfItems" {...hookForm.register('numberOfItems')}  />
                            <FormError path="numberOfItems" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="packagingProduct">Verpakking</Label>
                            <Select
                                id="packagingProduct"
                                value={hookForm.getValues('packagingProduct') ?? ''}
                                onValueChange={(val) =>
                                    hookForm.setValue('packagingProduct', val as PackagingProduct)
                                }
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
                                value={hookForm.getValues('packagingProduct') ?? ''}
                            />
                        </div>


                        <div>
                            <Label>Inhoud</Label>
                            <Input id="volumeContent" {...hookForm.register('volumeContent')}  />
                            <FormError path="volumeContent" formErrors={hookForm.formState.errors} serverErrors={actionResult} />
                        </div>

                        <div>
                            <Label htmlFor="unitProduct">Eenheid</Label>
                            <Select
                                id="unitProduct"
                                value={hookForm.getValues('unitProduct') ?? ''}
                                onValueChange={(val) =>
                                    hookForm.setValue('unitProduct', val as UnitProduct)
                                }
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
                                value={hookForm.getValues('unitProduct') ?? ''}
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

