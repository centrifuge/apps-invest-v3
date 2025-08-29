import React from 'react'
import { Dialog, Portal, CloseButton, Button, Separator, Grid } from '@chakra-ui/react'

interface ModalProps extends Dialog.RootProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  primaryActionText?: string
  onPrimaryAction?: () => void
  isPrimaryActionLoading?: boolean
  isPrimaryActionDisabled?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  primaryActionText = 'Save changes',
  onPrimaryAction,
  isPrimaryActionLoading = false,
  isPrimaryActionDisabled = false,
  size = 'md',
}: ModalProps) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
      size={size}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="white" borderRadius="md" boxShadow="lg" position="relative">
            <Dialog.Header display="flex" justifyContent="space-between" alignItems="center">
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {title}
              </Dialog.Title>
              <CloseButton aria-label="Close modal" variant="plain" onClick={onClose} size="sm" />
            </Dialog.Header>

            <Separator my={2} />

            <Dialog.Body>{children}</Dialog.Body>

            {onPrimaryAction && (
              <Dialog.Footer>
                <Grid w="100%" gap={2} templateColumns={'1fr 1fr'}>
                  <Button size="sm" variant="solid" colorPalette="gray" onClick={onClose}>
                    Cancel
                  </Button>
                  {onPrimaryAction && (
                    <Button
                      size="sm"
                      colorPalette="yellow"
                      onClick={onPrimaryAction}
                      loading={isPrimaryActionLoading}
                      disabled={isPrimaryActionDisabled}
                    >
                      {primaryActionText}
                    </Button>
                  )}
                </Grid>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
