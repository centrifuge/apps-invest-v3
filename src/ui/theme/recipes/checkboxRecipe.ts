import { defineSlotRecipe } from '@chakra-ui/react'

export const checkboxRecipe = defineSlotRecipe({
  className: 'checkbox',
  slots: ['root', 'control', 'label'],
  base: {
    root: {},
    control: {
      bg: 'bg.solid',
    },
  },
  variants: {
    variant: {
      outline: {
        control: {
          color: 'fg.muted !important',
        },
      },
    },
  },
})
