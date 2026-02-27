import { defineSlotRecipe } from '@chakra-ui/react'

export const paginationRecipe = defineSlotRecipe({
  className: 'pagination',
  slots: ['ellipsis', 'item', 'prevTrigger', 'nextTrigger'],
  base: {
    ellipsis: {
      borderRadius: '10px',
      color: 'fg.muted',
      _selected: { bg: 'border.muted', color: 'fg.solid', fontWeight: 500 },
      _hover: { bg: 'border.subtle' },
    },
    item: {
      borderRadius: '10px',
      color: 'fg.muted',
      _hover: { bg: 'border.subtle' },
      _selected: { bg: 'border.muted', color: 'fg.solid', fontWeight: 500 },
      _disabled: { bg: 'bg.disabled', color: 'fg.disabled', opacity: 1 },
    },
    prevTrigger: {
      borderRadius: '10px',
      color: 'fg.muted',
      _hover: { bg: 'border.subtle' },
      _selected: { bg: 'border.muted', color: 'fg.solid', fontWeight: 500 },
      _disabled: { bg: 'bg.disabled', color: 'fg.disabled', opacity: 1 },
    },
    nextTrigger: {
      borderRadius: '10px',
      color: 'fg.muted',
      _hover: { bg: 'border.subtle' },
      _selected: { bg: 'border.muted', color: 'fg.solid', fontWeight: 500 },
      _disabled: { bg: 'bg.disabled', color: 'fg.disabled', opacity: 1 },
    },
  },
})
