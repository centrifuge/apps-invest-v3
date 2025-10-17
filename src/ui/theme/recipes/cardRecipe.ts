import { defineSlotRecipe } from '@chakra-ui/react'
import { grayScale, white } from 'src/ui/theme/baseStyles/colors'

export const cardRecipe = defineSlotRecipe({
  slots: ['root', 'header', 'title', 'body'],
  base: {
    root: {
      backgroundColor: white,
      borderRadius: 10,
      p: 4,
      border: '1px solid',
      borderColor: grayScale[100],
    },
    header: { p: 0, mb: 2 },
    title: {
      color: grayScale[800],
      fontSize: 'lg',
    },
    body: {
      padding: 0,
      color: grayScale[800],
      fontSize: 'md',
    },
  },
})
