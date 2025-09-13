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

const lightTheme = defineConfig({
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
    semanticTokens: {
      colors: colorTokens,
    },
    textStyles,
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

export default lightTheme
