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
