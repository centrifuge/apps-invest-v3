import type { ComponentPropsWithoutRef } from 'react'
import { FormProvider, type FieldValues } from 'react-hook-form'
import type { UseFormReturn } from '../hooks/useForm'

export interface FormProps<T extends FieldValues> extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>
}

export function Form<T extends FieldValues>({ form, ...props }: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        {...props}
        onSubmit={form.handleSubmit}
        noValidate // Recommended for RHF-controlled validation
      />
    </FormProvider>
  )
}
