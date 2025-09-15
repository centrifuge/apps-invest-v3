import { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './ColorModesProvider'
import system from '../theme/theme'

export interface ChakraCentrifugeProviderProps {
  children: ReactNode
}

export function ChakraCentrifugeProvider({ children }: ChakraCentrifugeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
