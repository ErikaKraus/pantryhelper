'use client'

import {updateProductEntrySchema} from '@schemas'
import {z} from 'zod'
import {ProductEntry} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {useActionState, useEffect, useState} from 'react'
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
import {Edit} from 'lucide-react'
import Form from '@/components/custom/form/form'
import {Input} from '@/components/ui/input'
import FormError from '@/components/custom/form/formError'
import {Button} from '@/components/ui/button'

type FormValues = z.infer<typeof updateProductEntrySchema>

interface EditProductEntryDialogProps {
    productEntry: ProductEntry
    productId: string
}

export default function EditProductEntryDialog ({productEntry, productId}: EditProductEntryDialogProps) {
    const router =useRouter()
    const [open, setOpen] = useState(false)
    const [actionResult, updateProductEntry, isPending] = useActionState(Actions.updateProductEntry, {success: false})
    const todayString = new Date().toISOString().slice(0, 10)
    const hookForm = useZodValidatedForm(updateProductEntrySchema, {
        defaultValues: {
            id: productEntry.id,
            productId,
            quantity: productEntry.quantity,
            purchaseDate: productEntry.purchaseDate ? productEntry.purchaseDate : undefined,
            expiryDate: productEntry.expiryDate ? productEntry.expiryDate : undefined,
        }
    })

    useEffect(() => {
        if (!isPending && actionResult?.success) {
            setOpen(false)
            router.refresh()
        }
    }, [actionResult.success, isPending, router])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button aria-label="Aankoop bewerken" className="text-gray-500 hover:text-blue-600">
                    <Edit size={16}/>
                </button>
            </DialogTrigger>
            <DialogContent className="w-85%">
                <DialogHeader>
                    <DialogTitle>Aankoop bewerken</DialogTitle>
                </DialogHeader>

                <Form<FormValues>
                    hookForm={hookForm}
                    action={updateProductEntry}
                    actionResult={actionResult}
                >
                    <div className="grid grid-cols-3 gap-4">
                        {/* Quantity */}
                        <div className="flex flex-col">
                            <label htmlFor="quantity" className="mb-1 font-medium">
                                Aantal
                            </label>
                            <Input
                                id="quantity"
                                type="number"
                                min={1}
                                {...hookForm.register('quantity', { valueAsNumber: true })}
                            />
                            <FormError
                                path="quantity"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>
                        {/* PurchaseDate */}
                        <div className="flex flex-col">
                            <label htmlFor="purchaseDate" className="mb-1 font-medium">
                                Aankoopdatum
                            </label>
                            <Input
                                id="purchaseDate"
                                type="date"
                                defaultValue={todayString}
                                {...hookForm.register('purchaseDate', { valueAsDate: true })}
                            />
                            <FormError
                                path="purchaseDate"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>
                        {/* ExpiryDate */}
                        <div className="flex flex-col">
                            <label htmlFor="expiryDate" className="mb-1 font-medium">
                                Houdbaarheidsdatum
                            </label>
                            <Input
                                id="expiryDate"
                                type="date"
                                defaultValue={todayString}
                                {...hookForm.register('expiryDate', { valueAsDate: true })}
                            />
                            <FormError
                                path="expiryDate"
                                formErrors={hookForm.formState.errors}
                                serverErrors={actionResult}
                            />
                        </div>
                    </div>
                    <input type="hidden" {...hookForm.register('id')} />
                    <input type="hidden" {...hookForm.register('productId')} />

                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isPending}>Annuleren</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Opslaan…' : 'Opslaan'}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

