import { createContext, useContext } from 'react'
import type { Centrifuge } from '@centrifuge/sdk'

const CentrifugeContext = createContext<Centrifuge | null>(null)

export interface CentrifugeProviderProps {
  client: Centrifuge
  children: React.ReactNode
}

export function CentrifugeProvider({ client, children }: CentrifugeProviderProps) {
  return <CentrifugeContext.Provider value={client}>{children}</CentrifugeContext.Provider>
}

export function useCentrifuge(): Centrifuge {
  const client = useContext(CentrifugeContext)
  if (!client) {
    throw new Error('[@centrifuge/hooks] useCentrifuge must be used within a <CentrifugeProvider>')
  }
  return client
}
