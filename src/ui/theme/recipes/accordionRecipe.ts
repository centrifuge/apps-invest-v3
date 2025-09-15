import { defineSlotRecipe } from '@chakra-ui/react'

export const accordionRecipe = defineSlotRecipe({
  className: 'accordion',
  slots: ['root', 'item', 'itemBody', 'itemTrigger'],
  base: {
    root: {},
    item: {
      backgroundColor: 'bg.solid',
      mt: 2,
      p: 4,
      borderRadius: 10,
      border: '1px solid',
      borderColor: 'border.solid',
    },
    itemBody: {
      color: 'fg.muted',
    },
  },
})
