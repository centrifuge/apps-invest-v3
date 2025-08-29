import { forwardRef } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { Button, ButtonProps } from '@chakra-ui/react'

type ChakraLinkButtonProps = ButtonProps & Omit<LinkProps, 'children'>

export const LinkButton = forwardRef<HTMLButtonElement, ChakraLinkButtonProps>(({ children, ...props }, ref) => {
  return (
    <Button as={Link} type="button" ref={ref} {...props}>
      {children}
    </Button>
  )
})
