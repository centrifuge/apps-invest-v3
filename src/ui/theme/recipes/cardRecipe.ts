import { defineSlotRecipe } from '@chakra-ui/react'
import { grayScale, white } from '../baseStyles/colors'

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
    header: {},
    title: {
      fontSize: 'md',
      color: grayScale[800],
    },
    body: {
      padding: 0,
      color: grayScale[800],
    },
  },
})
