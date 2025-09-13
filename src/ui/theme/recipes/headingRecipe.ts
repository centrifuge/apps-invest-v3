import { defineRecipe } from '@chakra-ui/react'

export const headingRecipe = defineRecipe({
  className: 'heading',
  base: {
    margin: '0',
    fontFamily: 'heading',
  },
  variants: {
    size: {
      h1: { textStyle: 'h1' },
      h2: { textStyle: 'h2' },
      xs: { fontSize: 'xs' },
      sm: { fontSize: 'sm' },
      md: { fontSize: 'md' },
      lg: { fontSize: 'lg' },
      xl: { fontSize: 'xl' },
      '2xl': { fontSize: '2xl' },
      '3xl': { fontSize: '3xl' },
      '4xl': { fontSize: '4xl' },
      '5xl': { fontSize: '5xl' },
      '6xl': { fontSize: '6xl' },
      '7xl': { fontSize: '7xl' },
    },
  },
  defaultVariants: {
    size: 'h2',
  },
})
