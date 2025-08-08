'use client'

import {createProductEntrySchema} from '@schemas'
import {z} from 'zod'
import {useRouter} from 'next/navigation'
import {useActionState, useEffect} from 'react'
import Actions from '@actions'
import {useZodValidatedForm} from '@hooks'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import FormError from '@/components/custom/form/formError'
import SubmitButtonWithLoading from '@/components/custom/button/submitButtonWithLoading'
import Form from '@/components/custom/form/form'

type FormValues = z.infer<typeof createProductEntrySchema>

interface AddProductPurchaseProps {
    productId: string
}

export default function AddProductEntry({productId}: AddProductPurchaseProps)  {
    const router = useRouter()
    const [actionResult, createProductEntry, isPending] = useActionState(Actions.createProductEntry, {success: false})
    const today = new Date()
    const todayString = new Date().toISOString().slice(0, 10)
    const hookForm = useZodValidatedForm(createProductEntrySchema, {
        defaultValues: {
            productId,
            boughtQuantity: 1,
            remainingQuantity: 1,
            purchaseDate: today,
            expiryDate: today,
        }
    })

    useEffect(() => {
        if (!isPending && actionResult?.success) {
            hookForm.reset()
        }
    }, [isPending, hookForm, actionResult.success])

    useEffect(() => {
        const subscription = hookForm.watch((value, { name }) => {
            if (name === 'boughtQuantity' && typeof value.boughtQuantity === 'number') {
                hookForm.setValue('remainingQuantity', value.boughtQuantity)
            }
        })
        return () => subscription.unsubscribe()
    }, [hookForm])


    return (
        <Card>
            <Form<FormValues> hookForm={hookForm} action={createProductEntry} actionResult={actionResult}>
            <CardHeader>
                <CardTitle className="text-xl">Aankoop toevoegen</CardTitle>
            </CardHeader>
            <CardContent className="mt-3">
                <div className="grid grid-cols-3 gap-4">
                <input type="hidden" {...hookForm.register('productId')} />
                <div className="flex flex-col">
                    <Label htmlFor="boughtQuantity">Aantal</Label>
                    <Input className="mt-1"
                        id="boughtQuantity"
                        type="number"
                        min={1}
                        {...hookForm.register('boughtQuantity', {valueAsNumber: true})}
                        defaultValue={actionResult?.submittedData?.boughtQuantity ?? 1}
                    />
                    <FormError
                        path="boughtQuantity"
                        formErrors={hookForm.formState.errors}
                        serverErrors={actionResult}/>
                </div>
                    <input type="hidden" {...hookForm.register('remainingQuantity', { valueAsNumber: true })} />
                    <div className="flex flex-col">
                    <Label htmlFor="purchaseDate">Aankoopdatum</Label>
                    <Input className="mt-1"
                        id="purchaseDate"
                        type="date"
                        defaultValue={todayString}
                        {...hookForm.register('purchaseDate', {valueAsDate: true})}
                    />
                    <FormError
                        path="purchaseDate"
                        formErrors={hookForm.formState.errors}
                        serverErrors={actionResult}/>
                </div>
                    <div className="flex flex-col">
                    <Label htmlFor="expiryDate">Houdbaarheidsdatum</Label>
                    <Input className="mt-1"
                        id="expiryDate"
                        type="date"
                        defaultValue={todayString}
                        {...hookForm.register('expiryDate', {valueAsDate: true})}
                        />
                    <FormError
                        path="expiryDate"
                        formErrors={hookForm.formState.errors}
                        serverErrors={actionResult}/>
                </div>
                </div>
            </CardContent>
            <CardFooter className="mt-3">
                <SubmitButtonWithLoading text="Opslaan" loadingText="Opslaan.."></SubmitButtonWithLoading>
            </CardFooter>
            </Form>
        </Card>
    )
}

