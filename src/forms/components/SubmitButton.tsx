import { Button, type ButtonProps } from '@chakra-ui/react'
import { useFormContext, type FieldValues } from 'react-hook-form'

export interface SubmitButtonProps extends Omit<ButtonProps, 'type' | 'disabled' | 'loading'> {
  loadingText?: string
  disabled?: boolean
  disableOnInvalid?: boolean
  loading?: boolean
}

export function SubmitButton<T extends FieldValues = FieldValues>({
  children,
  loadingText,
  disabled = false,
  disableOnInvalid = true,
  loading = false,
  ...props
}: SubmitButtonProps) {
  const { formState } = useFormContext<T>()

  const isDisabled = disabled || formState.isSubmitting || (disableOnInvalid && !formState.isValid)

  return (
    <Button
      {...props}
      type="submit"
      disabled={isDisabled}
      loading={formState.isSubmitting || loading}
      loadingText={loadingText}
    >
      {children}
    </Button>
  )
}
