import { Card as ChakraCard } from '@chakra-ui/react'

export const Card = ({
  variant = 'outline',
  width,
  header,
  children,
  ...props
}: {
  variant?: 'elevated' | 'outline' | 'subtle'
  width?: string
  header?: string
  children: React.ReactNode
} & ChakraCard.RootProps) => {
  return (
    <ChakraCard.Root variant={variant} key={variant} width={width} {...props}>
      {header && (
        <ChakraCard.Header>
          <ChakraCard.Title>{header}</ChakraCard.Title>
        </ChakraCard.Header>
      )}
      <ChakraCard.Body>{children}</ChakraCard.Body>
    </ChakraCard.Root>
  )
}
