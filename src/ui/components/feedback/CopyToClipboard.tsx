import { Clipboard, IconButton, IconButtonProps } from '@chakra-ui/react'

type Variant = IconButtonProps['variant']

export const CopyToClipboard = ({
  value,
  variant = 'surface',
  size = 'sm',
}: {
  value: string
  variant?: Variant
  size?: IconButtonProps['size']
}) => {
  return (
    <Clipboard.Root value={value}>
      <Clipboard.Trigger asChild>
        <IconButton variant={variant} size={size}>
          <Clipboard.Indicator />
        </IconButton>
      </Clipboard.Trigger>
    </Clipboard.Root>
  )
}
