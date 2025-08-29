import { ReactNode } from 'react'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { lightTheme } from '../theme/lightTheme'

export interface ChakraCentrifugeProviderProps {
  themeKey: 'light' | 'dark'
  children: ReactNode
}

export function ChakraCentrifugeProvider({ themeKey, children }: ChakraCentrifugeProviderProps) {
  // TODO: add dark theme
  const themes = {
    light: lightTheme,
    dark: lightTheme,
  }
  const chosenThemeConfig = themes[themeKey]
  const system = createSystem(defaultConfig, chosenThemeConfig)

  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
