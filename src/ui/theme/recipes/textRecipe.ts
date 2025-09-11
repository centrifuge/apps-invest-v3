import { defineRecipe } from '@chakra-ui/react'
import { textStylesValues } from 'src/ui/theme/baseStyles/text'

export const textRecipe = defineRecipe({
  className: 'text',
  base: {
    margin: '0',
  },
  variants: {
    variant: {
      h1: textStylesValues.h1.value,
      h2: textStylesValues.h2.value,
      body: textStylesValues.body.value,
      caption: textStylesValues.caption.value,
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})
