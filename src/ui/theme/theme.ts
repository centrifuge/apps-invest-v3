import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { charcoalScale, grayScale, colors, colorTokens } from './baseStyles/colors'
import { fonts } from './baseStyles/text'
import { accordionRecipe } from './recipes/accordionRecipe'
import { badgeRecipe } from './recipes/badgeRecipe'
import { buttonRecipe } from './recipes/buttonRecipe'
import { cardRecipe } from './recipes/cardRecipe'
import { checkboxRecipe } from './recipes/checkboxRecipe'
import { headingRecipe } from './recipes/headingRecipe'
import { inputRecipe } from './recipes/inputRecipe'
import { paginationRecipe } from './recipes/paginationRecipe'
import { textRecipe } from './recipes/textRecipe'

const theme = defineConfig({
  globalCss: {
    body: {
      color: charcoalScale[500],
      backgroundColor: grayScale[300],
      fontWeight: 400,
    },
  },
  theme: {
    tokens: {
      fonts,
      colors,
    },
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
      card: cardRecipe,
      checkbox: checkboxRecipe,
      pagination: paginationRecipe,
    },
  },
})

export default createSystem(defaultConfig, theme)
