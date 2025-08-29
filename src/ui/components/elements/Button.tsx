import { Button as ChakraButton, type ButtonProps as ChakraButtonProps } from '@chakra-ui/react'

export interface ButtonProps extends ChakraButtonProps {
  label: string
}

export const Button = ({
  colorPalette = 'yellow',
  disabled,
  label,
  onClick,
  variant = 'solid',
  ...props
}: ButtonProps) => {
  return (
    <ChakraButton
      colorPalette={colorPalette}
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      {...props}
    >
      {label}
    </ChakraButton>
  )
}
