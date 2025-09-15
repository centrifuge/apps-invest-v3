export const black = '#252B34'
export const white = '#FFFFFF'

export const blackScale = {
  50: '#E2E4E7',
  100: '#C5C9D0',
  500: '#252B34',
  800: '#0F1115',
}

export const blueScale = {
  50: '#E3F1FF',
  100: '#E6EFF5',
  500: '#5291E0',
  700: '#005B96',
  800: '#213A5A',
  900: '#00243C',
}

export const grayScale = {
  10: '#3B424D',
  50: '#F6F6F6',
  100: '#E7E7E7',
  300: '#EFEFEF',
  500: '#91969B',
  600: '#667085',
  800: '#252B34',
  900: '#353a43',
}

export const yellowScale = {
  10: '#FFF8E7',
  50: '#FFFAE9',
  100: '#FFF4D6',
  200: '#FFE299',
  400: 'FFC00A',
  500: '#FFC012',
  800: '#806009',
}

export const blackPalette = {
  DEFAULT: { value: blackScale[800] },
  50: { value: blackScale[50] },
  100: { value: blackScale[100] },
  500: { value: blackScale[500] },
  800: { value: blackScale[800] },
}

export const bluePalette = {
  DEFAULT: { value: blueScale[500] },
  50: { value: blueScale[50] },
  100: { value: blueScale[100] },
  500: { value: blueScale[500] },
  700: { value: blueScale[700] },
  800: { value: blueScale[800] },
  900: { value: blueScale[900] },
}

export const grayPalette = {
  DEFAULT: { value: grayScale[800] },
  10: { value: grayScale[10] },
  50: { value: grayScale[50] },
  100: { value: grayScale[100] },
  300: { value: grayScale[300] },
  500: { value: grayScale[500] },
  600: { value: grayScale[600] },
  800: { value: grayScale[800] },
  900: { value: grayScale[900] },
}

export const yellowPalette = {
  DEFAULT: { value: yellowScale[500] },
  10: { value: yellowScale[10] },
  50: { value: yellowScale[50] },
  100: { value: yellowScale[100] },
  200: { value: yellowScale[200] },
  400: { value: yellowScale[400] },
  500: { value: yellowScale[500] },
  800: { value: yellowScale[800] },
}

export const colors = {
  black: blackPalette,
  blue: bluePalette,
  gray: grayPalette,
  yellow: yellowPalette,
}

// Read up on semantic tokens and their usage here:
// https://chakra-ui.com/docs/theming/customization/colors#semantic-tokens
export const colorTokens = {
  black: {
    solid: { value: '{colors.gray.800}' },
    contrast: { value: '{colors.gray.100}' },
    fg: { value: '{colors.gray.600}' },
    muted: { value: '{colors.gray.100}' },
    subtle: { value: '{colors.gray.300}' },
    emphasized: { value: '{colors.gray.500}' },
    focusRing: { value: '{colors.gray.800}' },
  },
  blue: {
    solid: { value: '{colors.blue.500}' },
    contrast: { value: 'colors.gray.800' },
    fg: { value: '{colors.blue.100}' },
    muted: { value: '{colors.blue.100}' },
    subtle: { value: '{colors.blue.50}' },
    emphasized: { value: '{colors.blue.800}' },
    focusRing: { value: '{colors.blue.500}' },
  },
  gray: {
    solid: { value: '{colors.gray.100}' },
    contrast: { value: '{colors.black.100}' },
    fg: { value: '{colors.gray.600}' },
    muted: { value: '{colors.gray.100}' },
    subtle: { value: '{colors.gray.300}' },
    emphasized: { value: '{colors.gray.500}' },
    focusRing: { value: '{colors.gray.800}' },
  },
  yellow: {
    solid: { value: '{colors.yellow.500}' },
    contrast: { value: 'colors.gray.800' },
    fg: { value: 'colors.yellow.400' },
    muted: { value: '{colors.yellow.100}' },
    subtle: { value: '{colors.yellow.50}' },
    emphasized: { value: '{colors.yellow.800}' },
    focusRing: { value: '{colors.yellow.200}' },
  },
  // Defining tokens here allows us to set values for both light and dark themes,
  // and allows the use of the token in various component properties like color and backgroundColor.
  'brand-yellow': {
    value: { base: '{colors.yellow.500}' },
  },
  'fg.primary-subtle': {
    value: { base: '{colors.yellow.100}' },
  },
  'bg.solid': {
    value: { base: white, _dark: 'colors.gray.800' },
  },
  'bg.secondary': {
    value: { base: 'colors.gray.50', _dark: 'colors.gray.50' },
  },
  'bg.tertiary': {
    value: { base: 'colors.gray.100' },
  },
  'bg.accent': {
    value: { base: 'colors.yellow.100' },
  },
  'bg.disabled': {
    value: { base: 'colors.gray.100' },
  },
  'bg.success': {
    value: { base: '#DCEBCF' },
  },
  'bg.promote': {
    value: { base: '#f8107114' },
  },
  'bg.error': {
    value: { base: '#fcf0ee' },
  },
  'border.solid': {
    value: { base: 'colors.gray.100', _dark: 'colors.gray.50' },
  },
  'border.secondary': {
    value: { base: 'rgba(246, 246, 246, 1)' },
  },
  'border.tertiary': {
    value: { base: 'colors.gray.10' },
  },
  'border.emphasized': {
    value: { base: 'colors.yellow.500' },
  },
  'fg.solid': {
    value: { base: 'colors.gray.800' },
  },
  'fg.muted': {
    value: { base: 'colors.gray.500' },
  },
  'fg.disabled': {
    value: { base: 'colors.gray.600' },
  },
  'fg.inverted': {
    value: { base: white },
  },
  'fg.emphasized': {
    value: { base: 'colors.yellow.500' },
  },
  error: {
    value: { base: '#d43f2b' },
  },
  info: {
    value: { base: 'colors.gray.800' },
  },
  success: {
    value: { base: '#277917' },
  },
  warning: {
    value: { base: 'colors.yellow.800' },
  },
  promote: {
    value: { base: '#f81071' },
  },
}
