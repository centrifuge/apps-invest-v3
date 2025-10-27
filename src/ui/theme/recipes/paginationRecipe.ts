import { defineSlotRecipe } from '@chakra-ui/react'

export const paginationRecipe = defineSlotRecipe({
  className: 'pagination',
  slots: ['ellipsis', 'item', 'prevTrigger', 'nextTrigger'],
  base: {
    ellipsis: {
      borderRadius: '0',
      borderWidth: '1px',
      borderColor: 'border.solid',
      backgroundColor: 'bg.panel',
      height: '40px',
    },
    item: { borderRadius: 0, backgroundColor: 'bg.panel', height: '40px' },
    prevTrigger: {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
      backgroundColor: 'bg.panel',
      height: '40px',
      _disabled: { bg: 'bg.disabled', color: 'fg.disabled', opacity: 1 },
    },
    nextTrigger: {
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      backgroundColor: 'bg.panel',
      height: '40px',
      _disabled: { bg: 'bg.disabled', color: 'fg.disabled', opacity: 1 },
    },
  },
})
