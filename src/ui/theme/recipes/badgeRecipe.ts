import { defineRecipe } from '@chakra-ui/react'
import { grayScale } from '../baseStyles/colors'

export const badgeRecipe = defineRecipe({
  base: {
    backgroundColor: grayScale[100],
    color: grayScale[800],
    opacity: 0.5,
    borderRadius: 10,
    py: 2,
    px: 3,
    h: '1.5rem',
  },
  variants: {
    variant: {
      outline: {
        backgroundColor: 'white',
        borderRadius: 'full',
        border: '1px solid',
        borderColor: 'gray.800',
        opacity: 1,
      },
    },
  },
})
