import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'semibold',
    borderRadius: '4px',
    borderWidth: '1px',
    _focusVisible: {
      boxShadow: 'outline',
    },
    transition: 'box-shadow 0.2s ease',
    _hover: {
      boxShadow: 'xs',
    },
  },
  variants: {
    size: {
      md: {
        fontSize: 'md',
        px: '16px',
        py: '8px',
        minW: '110px',
        minH: '36px',
      },
    },
    variant: {
      subtle: {
        background: 'gray.10',
        color: 'fg.inverted',
        fontSize: 'sm',
        fontWeight: 600,
        _hover: {
          background: 'gray.0',
          boxShadow: 'md',
        },
      },
      outline: {
        background: 'transparent',
        color: 'fg.inverted',
        fontSize: 'sm',
        fontWeight: 600,
      },
      plain: {
        background: 'transparent',
        color: 'fg.solid',
        fontSize: 'sm',
        fontWeight: 600,
        border: 'none',
        boxShadow: 'none',
        _hover: {
          background: 'transparent',
          boxShadow: 'none',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
