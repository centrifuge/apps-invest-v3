import { defineRecipe } from '@chakra-ui/react'
import { white } from '../baseStyles/colors'

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
        bg: white,
        _disabled: {
          bg: 'gray.200',
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
