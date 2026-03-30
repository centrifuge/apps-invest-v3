import { defineSlotRecipe } from '@chakra-ui/react'

export const switchRecipe = defineSlotRecipe({
  className: 'switch',
  slots: ['root', 'control', 'thumb', 'label', 'indicator'],
  variants: {
    variant: {
      solid: {
        thumb: {
          _checked: {
            bg: 'yellow.700',
          },
        },
      },
      raised: {
        thumb: {
          _checked: {
            bg: 'yellow.700',
          },
        },
      },
    },
  },
})
