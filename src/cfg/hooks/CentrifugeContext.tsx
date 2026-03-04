import { createContext, useContext } from 'react'
import type { Centrifuge } from '@centrifuge/sdk'

/**
 * This app uses React Query (useQuery + firstValueFrom) to bridge SDK observables
 * rather than subscribing to live observable streams. The app is event-driven and
 * doesn't need real-time updates — data is fetched on demand with stale-time caching.
 * The exception is investment/holdings data which polls on an interval since the external
 * management app can modify it. The SDK is shared with the management app that does need live streams,
 * which is why the SDK exposes observables, but this app intentionally opts out of that.
 */
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
