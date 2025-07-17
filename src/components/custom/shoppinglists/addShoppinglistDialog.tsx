'use client'
import {useActionState, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Actions from '@actions'
import {createCategorySchema, createShoppinglistSchema} from '@schemas'
import {useZodValidatedForm} from '@hooks'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {z} from 'zod'
import Form from '@/components/custom/form/form'
import {Input} from '@/components/ui/input'
import FormError from '@/components/custom/form/formError'
import SubmitButtonWithLoading from '@/components/custom/button/submitButtonWithLoading'
import {Label} from '@/components/ui/label'

type ShoppinglistFormValues = z.infer<typeof createShoppinglistSchema>


export default function AddShoppinglistDialog() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [actionResult, createShoppinglist, isPending] = useActionState(Actions.createShoppingList, {success: false})
    const hookForm = useZodValidatedForm(createShoppinglistSchema)

    useEffect(() => {
        if (!isPending && actionResult?.success) {
            hookForm.reset()
            setIsOpen(false)
        }
    }, [isPending, hookForm, actionResult.success])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">Boodschappenlijst toevoegen</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nieuwe boodschappenlijst aanmaken</DialogTitle>
                </DialogHeader>
                <Form<ShoppinglistFormValues>
                    hookForm={hookForm}
                    action={createShoppinglist}
                    actionResult={actionResult}
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Naam</Label>
                            <Input
                                className="mt-1"
                                id="name"
                                {...hookForm.register('name')}
                                defaultValue={actionResult?.submittedData?.name ?? ''}
                                placeholder="Bijvoorbeeld 'Groenten', 'Fruit', ..." />
                            <FormError
                                path="name"
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
                                hookForm.reset()
                            }}>
                            Annuleren
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )


}
