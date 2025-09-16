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
  const textColor = colorPalette === 'black' && (variant === 'solid' || variant === 'subtle') ? 'white' : 'inherit'
  return (
    <ChakraButton
      colorPalette={colorPalette}
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      color={textColor}
      {...props}
    >
      {label}
    </ChakraButton>
  )
}
