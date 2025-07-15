import {FunctionComponent, useActionState, useEffect, useState} from 'react'
import {Category, Product} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {useZodValidatedForm} from '@hooks'
import {updateProductSchema} from '@schemas'
import Actions from '@actions'
import {Dialog, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {SquarePen} from 'lucide-react'

interface EditProductDialogProps {
    product: Product &
        { categories: Category[] }
}

export default function EditProductDialog ({product}:EditProductDialogProps)  {
    const router = useRouter()
    const [open, setOpen] = useState(false)
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
            categoryIds: product.categories.map(category => category.id),
        }
    })

    useEffect(() => {
        if(!isPending && actionResult?.success) {
            setOpen(false)
            router.refresh()
        }
    }, [actionResult.success, isPending, router])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button aria-label="Aankoop bewerken" className="text-gray-500 hover:text-blue-600" size="sm" variant="outline">
                    <SquarePen size={16}/>
                </Button>
            </DialogTrigger>
        </Dialog>
    )
}

