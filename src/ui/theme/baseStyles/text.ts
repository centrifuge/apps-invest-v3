export const fonts = {
  heading: { value: 'Inter, ui-sans-serif' },
  body: { value: 'Inter, ui-sans-serif' },
}

export const textStylesValues = {
  h1: {
    description: 'Hero / page title',
    value: {
      fontFamily: 'heading',
      fontSize: '7xl',
      fontWeight: 'semibold',
      lineHeight: 1,
    },
  },
  h2: {
    value: {
      fontFamily: 'heading',
      fontSize: '6xl',
      fontWeight: 'semibold',
      lineHeight: 1,
    },
  },
  h3: {
    value: {
      fontFamily: 'heading',
      fontSize: '5xl',
      fontWeight: 'semibold',
      lineHeight: 1,
    },
  },
  h4: {
    value: {
      fontFamily: 'heading',
      fontSize: '4xl',
      fontWeight: 'semibold',
      lineHeight: 1,
    },
  },
  h5: {
    value: {
      fontFamily: 'heading',
      fontSize: '3xl',
      fontWeight: 'semibold',
      lineHeight: 1.2,
    },
  },
  h6: {
    value: {
      fontFamily: 'heading',
      fontSize: '2xl',
      fontWeight: 'semibold',
      lineHeight: 1.33,
    },
  },
  body: {
    value: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'normal',
    },
  },
  caption: {
    value: {
      fontFamily: 'body',
      fontSize: 'sm',
      fontWeight: 'medium',
    },
  },
}

/**
 * We can define text styles here and use them as the theme's textStyles object if we want to replace the defaults.
 * By using them in the headingRecipe and not the theme textStyles, we can combine defaults with custom styles.
 * These styles allow usage for other components beyond the <Text> component.
 * example: <Button textStyle="h1">Hello</Button>
  export const textStyles = defineTextStyles(textStylesValues)
 */

/** 
 * Reference material - default Chakra UI theme values are below

export const fontSizes = {
  '3xs': { value: '0.45rem' },
  '2xs': { value: '0.625rem' },
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
  '8xl': { value: '6rem' },
  '9xl': { value: '8rem' },
}

export const lineHeights = {
  normal: 'normal',
  none: 1,
  shorter: 1.25,
  short: 1.375,
  base: 1.5,
  tall: 1.625,
  taller: '2',
  '3': '.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
}

export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.02em',
  wider: '0.05em',
  widest: '0.1em',
}

export const fontWeights = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}
*/
