import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: 10,
    _disabled: {
      opacity: 1,
    },
    '&.chakra-input+[data-last]': {
      borderRadius: '0px 10px 10px 0px',
    },
  },
  variants: {
    variant: {
      outline: {
        bg: 'bg.input !important',
        border: '1px solid',
        borderColor: 'border.solid !important',
        _disabled: {
          bg: 'bg.subtle',
        },
        _focus: {
          borderColor: 'border.accent !important',
        },
        _focusVisible: {
          borderColor: 'transparent !important',
        },
        _invalid: {
          borderColor: 'border.error !important',
        },
      },
    },
    size: {
      lg: {
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})
