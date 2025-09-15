import { defineTextStyles } from '@chakra-ui/react'

export const fonts = {
  heading: { value: 'Inter, ui-sans-serif' },
  body: { value: 'Inter, ui-sans-serif' },
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
  '6xl': { value: '3.75rem' }, // 60px
  '7xl': { value: '4.5rem' }, // 72px
}

export const textStylesValues = {
  h1: {
    description: 'Hero / page title',
    value: {
      fontFamily: 'heading',
      fontSize: '2xl',
      fontWeight: 'bold',
      lineHeight: 'shorter',
      letterSpacing: '0',
    },
  },
  h2: {
    value: {
      fontFamily: 'heading',
      fontSize: 'lg',
      fontWeight: 'semibold',
      lineHeight: 'shorter',
      letterSpacing: '0',
    },
  },
  h3: {
    value: {
      fontFamily: 'heading',
      fontSize: 'md',
      fontWeight: 'semibold',
      lineHeight: 'short',
      letterSpacing: '0',
    },
  },
  h4: {
    value: {
      fontFamily: 'heading',
      fontSize: 'sm',
      fontWeight: 'semibold',
      lineHeight: 'short',
      letterSpacing: '0',
    },
  },
  h5: {
    value: {
      fontFamily: 'heading',
      fontSize: 'sm',
      fontWeight: '500',
      lineHeight: 'short',
      letterSpacing: '0',
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
