'use client'
import {FunctionComponent, useActionState, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import Actions from '@actions'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {createCategorySchema} from '@schemas'
import {useZodValidatedForm} from '@hooks'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {z} from 'zod'
import Form from '@/components/custom/form/form'
import {Input} from '@/components/ui/input'
import FormError from '@/components/custom/form/formError'
import SubmitButtonWithLoading from '@/components/custom/button/submitButtonWithLoading'
import {Label} from '@/components/ui/label'

type CategoryFormValues = z.infer<typeof createCategorySchema>


export default function AddCategoryDialog() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [actionResult, createCategory, isPending] = useActionState(Actions.createCategory, {success: false})
    const hookForm = useZodValidatedForm(createCategorySchema)

    useEffect(() => {
        if (!isPending && actionResult?.success) {
            hookForm.reset()
            setIsOpen(false)
        }
    }, [isPending, hookForm, actionResult.success])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">Categorie toevoegen</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nieuwe categorie aanmaken</DialogTitle>
                </DialogHeader>
                <Form<CategoryFormValues>
                    hookForm={hookForm}
                    action={createCategory}
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
