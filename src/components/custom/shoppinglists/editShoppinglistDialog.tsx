'use client'

import {updateShoppinglistSchema} from '@schemas'
import z from 'zod'
import {useRouter} from 'next/navigation'
import {useActionState, useEffect, useState} from 'react'
import Actions from '@actions'
import {useZodValidatedForm} from '@hooks'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import Form from '../form/form'
import {Input} from '@/components/ui/input'
import FormError from '@/components/custom/form/formError'
import SubmitButtonWithLoading from '@/components/custom/button/submitButtonWithLoading'
import {Label} from '@/components/ui/label'

type FormValues = z.infer<typeof updateShoppinglistSchema>

interface EditShoppinglistDialogProps {
    shoppinglistId: string
    currentName: string
}

export default function  EditShoppinglistDialog({shoppinglistId, currentName}: EditShoppinglistDialogProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [actionResult, updateShoppinglist, isPending] = useActionState(Actions.updateShoppinglist, {success: false})
    const hookForm = useZodValidatedForm(updateShoppinglistSchema, {
        defaultValues: {
            id: shoppinglistId,
            name: currentName
        }
    })

    useEffect(() => {
        if (!isPending && actionResult?.success) {
            hookForm.reset({id: shoppinglistId, name: hookForm.getValues('name')})
            setIsOpen(false)
        }
    }, [isPending, hookForm, actionResult.success])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">Wijzigen</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Boodschappenlijst wijzigen</DialogTitle>
                </DialogHeader>

                <Form<FormValues>
                    hookForm={hookForm}
                    action={updateShoppinglist}
                    actionResult={actionResult}
                >
                    <input type="hidden" {...hookForm.register('id')} value={shoppinglistId} />

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" >
                                Naam
                            </Label>
                            <Input
                                className="mt-3"
                                id="name"
                                {...hookForm.register('name')}
                                placeholder="Nieuwe naam"
                                defaultValue={actionResult?.submittedData?.name ?? currentName}

                            />
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
                                hookForm.reset({id: shoppinglistId, name: currentName})
                            }}>
                            Annuleren
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

