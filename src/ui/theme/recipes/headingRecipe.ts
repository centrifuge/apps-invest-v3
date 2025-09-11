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
      h1: textStylesValues.h1.value,
      h2: textStylesValues.h2.value,
    },
  },
  defaultVariants: {
    size: 'h2',
  },
})
