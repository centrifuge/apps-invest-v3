import { ReactNode } from 'react'
import { ChakraProvider as ChakraUiProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './ColorModeProvider'
import system from '../theme/theme'

export interface ChakraProviderProps {
  children: ReactNode
}

export function ChakraProvider({ children }: ChakraProviderProps) {
  return (
    <ChakraUiProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraUiProvider>
  )
}
