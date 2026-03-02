import { defineRecipe } from '@chakra-ui/react'

export const badgeRecipe = defineRecipe({
  base: {
    colorPalette: 'gray',
    borderRadius: 10,
    py: 1,
    px: 2,
    h: '1.5rem',
  },
  variants: {
    variant: {
      outline: {
        backgroundColor: 'white',
        borderRadius: 'full',
        border: '1px solid',
        borderColor: 'border.dark',
        opacity: 1,
      },
      solid: {
        background: 'colorPalette.subtle',
        color: 'colorPalette.800',
        borderRadius: 10,
      },
    },
  },
})
