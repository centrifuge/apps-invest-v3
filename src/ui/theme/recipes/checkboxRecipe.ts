import { defineSlotRecipe } from '@chakra-ui/react'
import { white } from '../baseStyles/colors'

export const checkboxRecipe = defineSlotRecipe({
  className: 'checkbox',
  slots: ['root', 'control', 'label'],
  base: {
    root: {},
    control: {
      bg: white,
    },
  },
  variants: {
    variant: {
      outline: {
        control: {
          color: 'gray.600 !important',
        },
      },
    },
  },
})
