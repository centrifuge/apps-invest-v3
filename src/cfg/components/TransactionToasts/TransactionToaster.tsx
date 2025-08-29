import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from '@chakra-ui/react'
import { ReactNode } from 'react'

type Type = string
type ActionOptions = {
  label: string
  onClick: () => void
}

interface ChakraToastType {
  action?: ActionOptions
  closable?: boolean
  description?: ReactNode | string | undefined
  duration?: number | undefined
  gap?: number
  id?: string | undefined
  message?: string
  removeDelay?: number | undefined
  stacked?: true
  title?: ReactNode | string | undefined
  type?: Type | undefined
}

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
  max: 3,
})

export const TransactionToaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast: ChakraToastType) => {
          return (
            <Toast.Root width={{ md: 'sm' }}>
              {toast.type === 'loading' ? <Spinner size="sm" color="black.solid" /> : <Toast.Indicator />}
              <Stack gap="1" flex="1" maxWidth="100%">
                {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                {toast.description && <Toast.Description wordBreak="break-word">{toast.description}</Toast.Description>}
              </Stack>
              {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
              {toast.closable && <Toast.CloseTrigger />}
            </Toast.Root>
          )
        }}
      </ChakraToaster>
    </Portal>
  )
}
