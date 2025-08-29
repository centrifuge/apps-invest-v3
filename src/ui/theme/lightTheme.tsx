import { defineConfig } from '@chakra-ui/react'
import { yellowPalette, blackPalette, grayPalette, bluePalette, white, blackScale, grayScale } from './colors'
import { buttonRecipe } from './recipes/buttonRecipe'
import { inputRecipe } from './recipes/inputRecipe'
import { checkboxRecipe } from './recipes/checkboxRecipe'
import { badgeRecipe } from './recipes/badgeRecipe'
import { accordionRecipe } from './recipes/accordionRecipe'

export const lightTheme = defineConfig({
  globalCss: {
    body: {
      color: blackScale[800],
      backgroundColor: grayScale[50],
    },
    button: {
      color: blackScale[800],
    },
  },
  theme: {
    tokens: {
      colors: {
        black: blackPalette,
        blue: bluePalette,
        gray: grayPalette,
        yellow: yellowPalette,
      },
    },
    // Read up on semantic tokens here: https://chakra-ui.com/docs/theming/customization/colors#semantic-tokens
    // When we define default matching tokens for brand colors (i.e. solid, contrast, fg, etc), it allows the use
    // of the `colorPalette` property on components like buttons and all the colors for all states will be set.
    semanticTokens: {
      colors: {
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
          value: { _light: '{colors.yellow.500}' },
        },
        'bg-primary': {
          value: { _light: white, _dark: 'colors.gray.800' },
        },
        'bg-secondary': {
          value: { _light: 'colors.gray.50', _dark: 'colors.gray.50' },
        },
        'bg-tertiary': {
          value: { _light: 'colors.gray.100' },
        },
        'bg-accent': {
          value: { _light: 'colors.yellow.100' },
        },
        'bg-disabled': {
          value: { _light: 'colors.gray.100' },
        },
        'bg-success': {
          value: { _light: '#DCEBCF' },
        },
        'bg-promote': {
          value: { _light: '#f8107114' },
        },
        'bg-error': {
          value: { _light: '#fcf0ee' },
        },
        'border-primary': {
          value: { _light: 'colors.gray.100', _dark: 'colors.gray.50' },
        },
        'border-secondary': {
          value: { _light: 'rgba(246, 246, 246, 1)' },
        },
        'border-tertiary': {
          value: { _light: 'colors.gray.10' },
        },
        'border-highlight': {
          value: { _light: 'colors.yellow.500' },
        },
        'text-primary': {
          value: { _light: 'colors.gray.800' },
        },
        'text-secondary': {
          value: { _light: 'colors.gray.500' },
        },
        'text-disabled': {
          value: { _light: 'colors.gray.600' },
        },
        'text-inverted': {
          value: { _light: white },
        },
        'text-highlight': {
          value: { _light: 'colors.yellow.500' },
        },
        info: {
          value: { _light: 'colors.gray.800' },
        },
        success: {
          value: { _light: '#277917' },
        },
        warning: {
          value: { _light: 'colors.yellow.800' },
        },
        error: {
          value: { _light: '#d43f2b' },
        },
        promote: {
          value: { _light: '#f81071' },
        },
      },
    },
    recipes: {
      badge: badgeRecipe,
      button: buttonRecipe,
      input: inputRecipe,
    },
    slotRecipes: {
      accordion: accordionRecipe,
      checkbox: checkboxRecipe,
    },
  },
})
