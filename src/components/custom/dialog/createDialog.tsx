// 'use client'
//
// import { ReactNode, useState} from 'react'
// import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import {useForm} from 'react-hook-form'
// import {ZodType} from 'zod'
// import {zodResolver} from '@hookform/resolvers/zod'
// import FormError from '@/components/custom/form/formError'
// import Form from '@/components/custom/form/form'
//
// interface FieldConfig<T> {
//     name: keyof T
//     label: string
//     render: (register: ReturnType<typeof useForm<T>>['register']) => ReactNode
// }
//
// interface CreateDialogProps {
//     title: string
//     schema: ZodType<T>
//     action: (data: FormData) => Promise<void>
//     fields: FieldConfig<T>[]
//     triggerProps?: React.ComponentProps<typeof Button>
// }
//
// export function CreateDialog<T extends Record<string, any>>(props: CreateDialogProps<T>) {
//     const { title, schema, action, fields, triggerProps } = props
//     // overzicht van server-errors
//     const [actionResult, setActionResult] = useState<{ errors?: Record<string, string[]> }>({})
//     // hookForm opzetten met Zod
//     const hookForm = useForm<T>({
//         resolver: zodResolver(schema),
//         defaultValues: {} as T,
//     })
//
//     async function handleAction(formData: FormData) {
//         await action(formData)
//             .then()
//     }
//
//     return (
// <Dialog>
//     <DialogTrigger asChiled>
//         <Button {...triggerProps}>{title}</Button>
//     </DialogTrigger>
//     <DialogContent>
//         <DialogHeader>
//             <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>
//         <Form<T>
//             hookForm={hookForm}
//             action={handleAction}
//             actionResult={actionResult}
//             // fields={fields}
//             methode="POST"
//         >
//             <div className="space-y-4">
//                 {fields.map((f) => (
//                     <div key={String(f.name)}>
//                         <label className="block mb-1 font-medium">{f.label}</label>
//                         {f.render(hookForm.register)}
//                         <FormError
//                             path={String(f.name)}
//                             formErrors={hookForm.formState.errors}
//                             serverErrors={actionResult}
//                         />
//                     </div>
//                 ))}
//             </div>
//
//             <DialogFooter className="mt-6">
//                 <Button type="submit">{title}</Button>
//             </DialogFooter>
//
//         </Form>
//     </DialogContent>
// </Dialog>
//     )
// }
