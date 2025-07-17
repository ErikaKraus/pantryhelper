import {FunctionComponent, useActionState, useEffect, useState} from 'react'
import {createShoppinglistProductSchema} from '@schemas'
import z from 'zod'
import Actions from '@actions'
import {useZodValidatedForm} from '@hooks'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {ShoppingCart} from 'lucide-react'
import Form from '@/components/custom/form/form'
import {Label} from '@/components/ui/label'
import FormError from '@/components/custom/form/formError'
import {Input} from '@/components/ui/input'
import SubmitButtonWithLoading from '@/components/custom/button/submitButtonWithLoading'

interface AddToShoppinglistProductDialogProps {
    productId: string
    shoppinglists: { id: string; name: string }[]
}

type FormValues = z.infer<typeof createShoppinglistProductSchema>


const AddToShoppinglistProductDialog: FunctionComponent<AddToShoppinglistProductDialogProps> = ({productId, shoppinglists}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [actionResult, createShoppinglistProduct, isPending] = useActionState(Actions.createShoppinglistProduct, {success: false})
    const defaultList =
        shoppinglists.find((l) => l.name.toLowerCase() === 'boodschappenlijst') ??
        shoppinglists[0]

    const hookForm = useZodValidatedForm(createShoppinglistProductSchema, {
        defaultValues: {
            shoppinglistId: defaultList?.id ?? '',
            productId,
            quantity: 1,
        },
    })

    useEffect(() => {
        if (!isPending && actionResult.success) {
            hookForm.reset({
                shoppinglistId: defaultList?.id ?? '',
                productId,
                quantity: 1,
            })
            setIsOpen(false)
        }
    }, [actionResult.success, isPending])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    title="Toevoegen aan lijst"
                    className="text-gray-600 hover:text-gray-800"
                >
                    <ShoppingCart size={20} />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Product toevoegen aan lijst</DialogTitle>
                </DialogHeader>

                <Form<FormValues>
                    hookForm={hookForm}
                    action={createShoppinglistProduct}
                    actionResult={actionResult}
                >
                    {/* Hidden inputs */}
                    <input type="hidden" {...hookForm.register('productId')} />
                    <div>
                        <Label htmlFor="shoppinglistId" className="mb-1">Lijst</Label>
                        <select
                            id="shoppinglistId"
                            {...hookForm.register('shoppinglistId')}
                            className="mt-1 block w-full rounded border px-2 py-1"
                        >
                            {shoppinglists.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                        <FormError
                            path="shoppinglistId"
                            formErrors={hookForm.formState.errors}
                            serverErrors={actionResult}
                        />
                    </div>

                    <div>
                        <Label htmlFor="quantity" className="mt-3 mb-1">Hoeveelheid</Label>
                        <Input
                            id="quantity"
                            type="number"
                            {...hookForm.register('quantity')}
                            min={1}
                        />
                        <FormError
                            path="quantity"
                            formErrors={hookForm.formState.errors}
                            serverErrors={actionResult}
                        />
                    </div>

                    <DialogFooter className="mt-4 flex justify-end space-x-2">
                        <SubmitButtonWithLoading
                            text="Toevoegen"
                            loadingText="Toevoegen…"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false)
                                hookForm.reset({
                                    shoppinglistId: defaultList?.id ?? '',
                                    productId,
                                    quantity: 1,
                                })
                            }}
                        >
                            Annuleren
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddToShoppinglistProductDialog
