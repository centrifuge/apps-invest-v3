import { defineTextStyles } from '@chakra-ui/react'

export const fonts = {
  heading: { value: "'Inter', sans-serif" },
  body: { value: "'Inter', sans-serif" },
}

export const fontSizes = {
  xs: { value: '0.75rem' }, // 12px
  sm: { value: '0.875rem' }, // 14px
  md: { value: '1rem' }, // 16px
  lg: { value: '1.125rem' }, // 18px
  xl: { value: '1.25rem' }, // 20px
  '2xl': { value: '1.5rem' }, // 24px
  '3xl': { value: '1.875rem' }, // 30px
  '4xl': { value: '2.25rem' }, // 36px
  '5xl': { value: '3rem' }, // 48px
}

export const textStylesValues = {
  h1: {
    description: 'Hero / page title',
    value: {
      fontFamily: 'heading',
      fontSize: '4xl',
      fontWeight: 'bold',
      lineHeight: 'short',
    },
  },
  h2: {
    value: {
      fontFamily: 'heading',
      fontSize: '3xl',
      fontWeight: 'semibold',
      lineHeight: 'short',
    },
  },
  body: {
    value: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'normal',
      lineHeight: 'base',
    },
  },
  caption: {
    value: {
      fontFamily: 'body',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'short',
    },
  },
}

// These styles allow usage for other components beyond the <Text> component.
// example: <Button textStyle="h1">Hello</Button>
export const textStyles = defineTextStyles(textStylesValues)
