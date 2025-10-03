export const black = '#252B34'
export const white = '#FFFFFF'

export const blueScale = {
  100: '#EEF4FC',
  200: '#CBDEF6',
  300: '#97BDEC',
  400: '#75A7E6',
  500: '#5291E0',
  600: '#315786',
  700: '#213A5A',
  800: '#101D2D',
  900: '#080E16',
}

export const brandScale = {
  100: '#E9EAEB',
  200: '#CED8E2',
  300: '#7C8085',
  400: '#3B4048',
  500: '#252B34',
  600: '#1E222A',
  700: '#161A1F',
  800: '#0F1115',
  900: '#07090A',
}

export const grayScale = {
  100: '#FFFFFF',
  200: '#F9F9F9',
  300: '#F5F5F5',
  400: '#E9EAEB',
  500: '#D5D7DA',
  600: '#A4A7AE',
  700: '#717680',
  800: '#414651',
  900: '#0A0D12',
}

export const greenScale = {
  100: '#ECFDF3',
  200: '#D1FADF',
  300: '#A6F4C5',
  400: '#6CE9A6',
  500: '#32D583',
  600: '#12B76A',
  700: '#027A48',
  800: '#054F31',
  900: '#053321',
}

export const orangeScale = {
  100: '#FFFAEB',
  200: '#FEF0C7',
  300: '#FEDF89',
  400: '#FDB022',
  500: '#F79009',
  600: '#DC6803',
  700: '#B54708',
  800: '#7A2E0E',
  900: '#4E1D09',
}

export const redScale = {
  100: '#FFF0EF',
  200: '#FECDCA',
  300: '#FDA29B',
  400: '#F97066',
  500: '#F04438',
  600: '#D92D20',
  700: '#912018',
  800: '#7A271A',
  900: '#55160C',
}

export const yellowScale = {
  100: '#FFF9E7',
  200: '#FFF2D0',
  300: '#FFE6A0',
  400: '#FFD971',
  500: '#FFC012',
  600: '#B3860D',
  700: '#806009',
  800: '#332604',
  900: '#191302',
}

export const blackPalette = {
  DEFAULT: { value: brandScale[500] },
  100: { value: brandScale[100] },
  200: { value: brandScale[200] },
  300: { value: brandScale[300] },
  400: { value: brandScale[400] },
  500: { value: brandScale[500] },
  600: { value: brandScale[600] },
  700: { value: brandScale[700] },
  800: { value: brandScale[800] },
  900: { value: brandScale[900] },
}

export const bluePalette = {
  DEFAULT: { value: blueScale[500] },
  100: { value: blueScale[100] },
  200: { value: blueScale[200] },
  300: { value: blueScale[300] },
  400: { value: blueScale[400] },
  500: { value: blueScale[500] },
  600: { value: blueScale[600] },
  700: { value: blueScale[700] },
  800: { value: blueScale[800] },
  900: { value: blueScale[900] },
}

export const brandPalette = {
  DEFAULT: { value: brandScale[500] },
  100: { value: brandScale[100] },
  200: { value: brandScale[200] },
  300: { value: brandScale[300] },
  400: { value: brandScale[400] },
  500: { value: brandScale[500] },
  600: { value: brandScale[600] },
  700: { value: brandScale[700] },
  800: { value: brandScale[800] },
  900: { value: brandScale[900] },
}

export const grayPalette = {
  DEFAULT: { value: grayScale[800] },
  100: { value: grayScale[100] },
  200: { value: grayScale[200] },
  300: { value: grayScale[300] },
  400: { value: grayScale[400] },
  500: { value: grayScale[500] },
  600: { value: grayScale[600] },
  700: { value: grayScale[700] },
  800: { value: grayScale[800] },
  900: { value: grayScale[900] },
}

export const greenPalette = {
  DEFAULT: { value: greenScale[500] },
  100: { value: greenScale[100] },
  200: { value: greenScale[200] },
  300: { value: greenScale[300] },
  400: { value: greenScale[400] },
  500: { value: greenScale[500] },
  600: { value: greenScale[600] },
  700: { value: greenScale[700] },
  800: { value: greenScale[800] },
  900: { value: greenScale[900] },
}

export const orangePalette = {
  DEFAULT: { value: orangeScale[500] },
  100: { value: orangeScale[100] },
  200: { value: orangeScale[200] },
  300: { value: orangeScale[300] },
  400: { value: orangeScale[400] },
  500: { value: orangeScale[500] },
  600: { value: orangeScale[600] },
  700: { value: orangeScale[700] },
  800: { value: orangeScale[800] },
  900: { value: orangeScale[900] },
}

export const redPalette = {
  DEFAULT: { value: redScale[500] },
  100: { value: redScale[100] },
  200: { value: redScale[200] },
  300: { value: redScale[300] },
  400: { value: redScale[400] },
  500: { value: redScale[500] },
  600: { value: redScale[600] },
  700: { value: redScale[700] },
  800: { value: redScale[800] },
  900: { value: redScale[900] },
}

export const yellowPalette = {
  DEFAULT: { value: yellowScale[500] },
  100: { value: yellowScale[100] },
  200: { value: yellowScale[200] },
  300: { value: yellowScale[300] },
  400: { value: yellowScale[400] },
  500: { value: yellowScale[500] },
  600: { value: yellowScale[600] },
  700: { value: yellowScale[700] },
  800: { value: yellowScale[800] },
  900: { value: yellowScale[900] },
}

export const colors = {
  black: blackPalette,
  blue: bluePalette,
  brand: brandPalette,
  gray: grayPalette,
  green: greenPalette,
  orange: orangePalette,
  red: redPalette,
  yellow: yellowPalette,
}

// Read up on semantic tokens and their usage here:
// https://chakra-ui.com/docs/theming/customization/colors#semantic-tokens
export const colorTokens = {
  black: {
    solid: { value: brandScale[500] },
    contrast: { value: grayScale[100] },
    fg: { value: brandScale[500] },
    subtle: { value: grayScale[300] },
    muted: { value: grayScale[600] },
    emphasized: { value: grayScale[500] },
    focusRing: { value: brandScale[500] },
  },
  blue: {
    solid: { value: blueScale[500] },
    contrast: { value: brandScale[500] },
    fg: { value: blueScale[500] },
    subtle: { value: blueScale[200] },
    muted: { value: blueScale[300] },
    emphasized: { value: blueScale[800] },
    focusRing: { value: blueScale[400] },
  },
  brand: {
    solid: { value: brandScale[500] },
    contrast: { value: grayScale[100] },
    fg: { value: brandScale[500] },
    subtle: { value: brandScale[200] },
    muted: { value: brandScale[300] },
    emphasized: { value: brandScale[800] },
    focusRing: { value: brandScale[400] },
  },
  gray: {
    solid: { value: grayScale[400] },
    contrast: { value: brandScale[500] },
    fg: { value: grayScale[500] },
    subtle: { value: grayScale[200] },
    muted: { value: grayScale[300] },
    emphasized: { value: grayScale[700] },
    focusRing: { value: grayScale[400] },
  },
  green: {
    solid: { value: greenScale[500] },
    contrast: { value: brandScale[100] },
    fg: { value: greenScale[500] },
    subtle: { value: greenScale[200] },
    muted: { value: greenScale[300] },
    emphasized: { value: greenScale[700] },
    focusRing: { value: greenScale[600] },
  },
  orange: {
    solid: { value: orangeScale[500] },
    contrast: { value: brandScale[100] },
    fg: { value: orangeScale[500] },
    subtle: { value: orangeScale[200] },
    muted: { value: orangeScale[300] },
    emphasized: { value: orangeScale[700] },
    focusRing: { value: orangeScale[600] },
  },
  red: {
    solid: { value: redScale[500] },
    contrast: { value: brandScale[100] },
    fg: { value: redScale[500] },
    subtle: { value: redScale[200] },
    muted: { value: redScale[300] },
    emphasized: { value: redScale[700] },
    focusRing: { value: redScale[600] },
  },
  yellow: {
    solid: { value: yellowScale[500] },
    contrast: { value: brandScale[800] },
    fg: { value: yellowScale[500] },
    subtle: { value: yellowScale[200] },
    muted: { value: yellowScale[300] },
    emphasized: { value: yellowScale[800] },
    focusRing: { value: yellowScale[400] },
  },
  // Defining tokens here allows us to set values for both light and dark themes,
  // and allows the use of the token in various component properties like color and backgroundColor.
  'bg.solid': {
    value: { _light: grayScale[100], _dark: grayScale[800] },
  },
  'bg.input': {
    value: { _light: grayScale[300] },
  },
  'bg.subtle': {
    value: { _light: grayScale[200] },
  },
  'bg.muted': {
    value: { _light: grayScale[400] },
  },
  'bg.emphasized': {
    value: { _light: yellowScale[500] },
  },
  'bg.accent': {
    value: { _light: yellowScale[100] },
  },
  'bg.disabled': {
    value: { _light: grayScale[200] },
  },
  'bg.error': {
    value: { _light: redScale[200] },
  },
  'bg.info': {
    value: { _light: blueScale[200] },
  },
  'bg.success': {
    value: { _light: greenScale[200] },
  },
  'bg.warning': {
    value: { _light: orangeScale[200] },
  },
  border: {
    value: { _light: grayScale[400] },
  },
  'border.input': {
    value: { _light: grayScale[200] },
  },
  'border.solid': {
    value: { _light: grayScale[400] },
  },
  'border.light': {
    value: { _light: 'rgba(246, 246, 246, 1)' },
  },
  'border.dark': {
    value: { _light: brandScale[500] },
  },
  'border.subtle': {
    value: { _light: brandScale[300] },
  },
  'border.emphasized': {
    value: { _light: yellowScale[500] },
  },
  'border.accent': {
    value: { _light: yellowScale[200] },
  },
  'border.warning': {
    value: { _light: yellowScale[200] },
  },
  'border.error': {
    value: { _light: redScale[100] },
  },
  'fg.solid': {
    value: { _light: brandScale[500] },
  },
  'fg.input': {
    value: { _light: brandScale[300] },
  },
  'fg.subtle': {
    value: { _light: grayScale[400] },
  },
  'fg.muted': {
    value: { _light: brandScale[300] },
  },
  'fg.disabled': {
    value: { _light: grayScale[600] },
  },
  'fg.inverted': {
    value: { _light: grayScale[100] },
  },
  'fg.emphasized': {
    value: { _light: yellowScale[500] },
  },
  'fg.error': {
    value: { _light: redScale[600] },
  },
  'fg.info': {
    value: { _light: blueScale[500] },
  },
  'fg.success': {
    value: { _light: greenScale[500] },
  },
  'fg.warning': {
    value: { _light: yellowScale[800] },
  },
  error: {
    value: { _light: redScale[500] },
  },
  info: {
    value: { _light: grayScale[800] },
  },
  success: {
    value: { _light: greenScale[500] },
  },
  warning: {
    value: { _light: yellowScale[800] },
  },
}
