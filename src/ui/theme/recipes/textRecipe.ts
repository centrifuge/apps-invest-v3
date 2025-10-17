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
      h3: textStylesValues.h3.value,
      h4: textStylesValues.h4.value,
      h5: textStylesValues.h5.value,
      h6: textStylesValues.h6.value,
      body: textStylesValues.body.value,
      caption: textStylesValues.caption.value,
    },
  },
})
