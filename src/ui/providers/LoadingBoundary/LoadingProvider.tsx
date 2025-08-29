import type { EffectCallback, ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export interface LoadingBoundaryContextValues {
  fallback: ReactNode
  isLoading: boolean
  hideLoading: () => void
}

export interface LoadingProviderProps {
  children: ReactNode
}

const LoadingBoundaryContext = createContext<LoadingBoundaryContextValues>({
  fallback: null,
  isLoading: true,
  hideLoading: () => {},
})

export function useLoadingBoundary() {
  return useContext(LoadingBoundaryContext)
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setLoading] = useState(true)
  const hideLoading = () => setLoading(false)

  const fallback = isLoading ? (
    <FirstLoadFallback onUnmount={hideLoading} />
  ) : (
    <Box p={3}>
      <Spinner size="lg" colorPalette="black" />
    </Box>
  )

  return (
    <LoadingBoundaryContext.Provider value={{ fallback, hideLoading, isLoading }}>
      {children}
    </LoadingBoundaryContext.Provider>
  )
}

function useEffectOnce(effect: EffectCallback) {
  useEffect(effect, [])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useUnmount(fn: () => any): void {
  const fnRef = useRef(fn)

  fnRef.current = fn

  useEffectOnce(() => () => fnRef.current())
}

interface FirstLoadFallbackProps {
  onUnmount: () => void
}

function FirstLoadFallback({ onUnmount }: FirstLoadFallbackProps) {
  useUnmount(() => onUnmount())

  return null
}
