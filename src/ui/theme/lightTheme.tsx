import { defineConfig } from '@chakra-ui/react'
import { blackScale, grayScale, colors, colorTokens } from './baseStyles/colors'
import { buttonRecipe } from './recipes/buttonRecipe'
import { inputRecipe } from './recipes/inputRecipe'
import { checkboxRecipe } from './recipes/checkboxRecipe'
import { badgeRecipe } from './recipes/badgeRecipe'
import { accordionRecipe } from './recipes/accordionRecipe'
import { fonts, fontSizes, textStyles } from 'src/ui/theme/baseStyles/text'
import { textRecipe } from 'src/ui/theme/recipes/textRecipe'
import { headingRecipe } from 'src/ui/theme/recipes/headingRecipe'

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
      fonts,
      fontSizes,
      colors,
    },
    textStyles,
    // Read up on semantic tokens here: https://chakra-ui.com/docs/theming/customization/colors#semantic-tokens
    // When we define default matching tokens for brand colors (i.e. solid, contrast, fg, etc), it allows the use
    // of the `colorPalette` property on components like buttons and all the colors for all states will be set.
    semanticTokens: {
      colors: colorTokens,
    },
    recipes: {
      badge: badgeRecipe,
      button: buttonRecipe,
      heading: headingRecipe,
      input: inputRecipe,
      text: textRecipe,
    },
    slotRecipes: {
      accordion: accordionRecipe,
      checkbox: checkboxRecipe,
    },
  },
})
