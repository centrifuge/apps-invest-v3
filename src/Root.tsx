import { useEffect, useMemo, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Centrifuge from '@centrifuge/sdk'
import {
  CentrifugeProvider,
  DebugFlags,
  TransactionProvider,
  useAddress,
  useDebugFlags,
  ALL_CHAINS,
  MAINNET_RPC_URLS,
  TESTNET_RPC_URLS,
} from '@cfg'
import { LoadingProvider } from '@ui'
import { WalletProvider } from '@wallet/WalletProvider'
import { PoolProvider } from '@contexts/PoolContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,
      gcTime: 600000,
    },
  },
})

function RootProviders() {
  const { showMainnet } = useDebugFlags()
  const isMainnet = showMainnet || import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet'

  /**
   * Initialize Centrifuge SDK with any necessary config.
   * We memoize it to ensure it is created only once.
   * If we do not, it can create a new instance on every render,
   * which can lead to issues with state management and performance.
   * Be sure to always use the same instance of Centrifuge SDK throughout the app,
   * from `useCentrifuge()` set in `CentrifugeProvider`.
   */
  const centrifuge = useMemo(() => {
    const indexerUrl = isMainnet ? import.meta.env.VITE_INDEXER_URL_MAINNET : import.meta.env.VITE_INDEXER_URL_TESTNET

    return new Centrifuge({
      environment: isMainnet ? 'mainnet' : 'testnet',
      indexerUrl,
      rpcUrls: isMainnet ? MAINNET_RPC_URLS : TESTNET_RPC_URLS,
      disableRepeatOnEvents: true,
    })
  }, [showMainnet])

  /**
   * For WalletProvider networks, we include ALL possible networks (mainnet + testnet)
   * because AppKit cannot dynamically update networks after initialization.
   * The actual environment switching (mainnet vs testnet) is handled by the Centrifuge SDK above.
   *
   * ALL_CHAINS is built from the static `chains` export of @centrifuge/sdk — a plain array
   * of chain definition objects, equivalent to importing from viem/chains. No SDK instance
   * is created here, so there are no extra publicClients, event watchers, or polling.
   */

  return (
    <QueryClientProvider client={queryClient}>
      <CentrifugeProvider client={centrifuge}>
        <WalletProvider
          projectId={import.meta.env.VITE_REOWN_APP_ID!}
          networks={ALL_CHAINS}
          rpcUrls={{ ...MAINNET_RPC_URLS, ...TESTNET_RPC_URLS }}
        >
          <WalletInvalidator />
          <TransactionProvider>
            <PoolProvider>
              <LoadingProvider>
                <Outlet />
              </LoadingProvider>
            </PoolProvider>
          </TransactionProvider>
        </WalletProvider>
      </CentrifugeProvider>
    </QueryClientProvider>
  )
}

// Remove all queries when the connected wallet address changes
function WalletInvalidator() {
  const { address } = useAddress()
  const prevAddressRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (prevAddressRef.current !== address) {
      queryClient.removeQueries()
    }
    prevAddressRef.current = address
  }, [address])

  return null
}

export default function Root() {
  return (
    <DebugFlags>
      <RootProviders />
    </DebugFlags>
  )
}
