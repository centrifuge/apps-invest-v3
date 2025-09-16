import { Card as ChakraCard } from '@chakra-ui/react'

export const Card = ({
  variant = 'outline',
  width,
  header,
  borderRadius = '12px',
  children,
  ...props
}: {
  variant?: 'elevated' | 'outline' | 'subtle'
  width?: string
  header?: string
  children: React.ReactNode
} & ChakraCard.RootProps) => {
  return (
    <ChakraCard.Root variant={variant} key={variant} width={width} borderRadius={borderRadius} {...props}>
      {header && (
        <ChakraCard.Header>
          <ChakraCard.Title>{header}</ChakraCard.Title>
        </ChakraCard.Header>
      )}
      <ChakraCard.Body>{children}</ChakraCard.Body>
    </ChakraCard.Root>
  )
}
