import { defineRecipe } from '@chakra-ui/react'
import { textStylesValues } from 'src/ui/theme/baseStyles/text'

export const headingRecipe = defineRecipe({
  className: 'heading',
  base: {
    margin: '0',
    fontFamily: 'heading',
  },
  variants: {
    size: {
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
    variant: {
      h1: textStylesValues.h1.value,
      h2: textStylesValues.h2.value,
      h3: textStylesValues.h3.value,
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})
