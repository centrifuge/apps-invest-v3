import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Centrifuge from '@centrifuge/sdk'
import { CentrifugeProvider, DebugFlags, TransactionProvider, useDebugFlags } from '@cfg'
import { LoadingProvider } from '@ui'
import { WalletProvider } from '@wallet/WalletProvider'
import { PoolProvider } from '@contexts/PoolContext'
import { VaultsProvider } from '@contexts/VaultsContext'
import {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  avalanche,
  bsc,
  bscTestnet,
  plumeMainnet,
  plumeTestnet,
} from 'wagmi/chains'

const MAINNET_CHAINS = [mainnet, base, arbitrum, avalanche, bsc, plumeMainnet]
const TESTNET_CHAINS = [sepolia, baseSepolia, arbitrumSepolia, bscTestnet, plumeTestnet]
const ALL_CHAINS = [...MAINNET_CHAINS, ...TESTNET_CHAINS]
import { TenderlyProvider, useTenderly } from '@contexts/TenderlyContext'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY
// TODO: Use after updating new app keys
// const INFURA_KEY = import.meta.env.VITE_INFURA_KEY
// const ONFINALITY_KEY = import.meta.env.VITE_ONFINALITY_KEY

const queryClient = new QueryClient()

const MAINNET_RPC_URLS = {
  1: [
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    // `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    // `https://eth.api.onfinality.io/rpc?apikey=${ONFINALITY_KEY}`,
  ],
  8453: [`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  42161: [`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  43114: [`https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  42220: [`https://celo-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
}

const TESTNET_RPC_URLS = {
  11155111: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  84532: [`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  421612: [`https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  431142: [`https://avax-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  11142220: [`https://celo-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
}

function RootProviders() {
  const { showMainnet } = useDebugFlags()
  const { getRpcUrl } = useTenderly()
  const tenderlyRpcUrl = getRpcUrl()
  const testnetUrls = { ...TESTNET_RPC_URLS, 11155111: [tenderlyRpcUrl ?? '', ...TESTNET_RPC_URLS[11155111]] }
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
      rpcUrls: isMainnet ? MAINNET_RPC_URLS : testnetUrls,
      pollingInterval: 60000,
    })
  }, [showMainnet])

  /**
   * For WalletProvider networks, we include ALL possible networks (mainnet + testnet)
   * because AppKit cannot dynamically update networks after initialization.
   * The actual environment switching (mainnet vs testnet) is handled by the Centrifuge SDK above.
   *
   * IMPORTANT: We use static chain imports from wagmi/chains (ALL_CHAINS) instead of
   * creating and importing from extra Centrifuge SDK instances (getChainConfig()), as each
   * instance creates its own viem publicClient per chain with independent event watchers and polling,
   * which would multiply RPC requests unnecessarily.
   */

  return (
    <QueryClientProvider client={queryClient}>
      <CentrifugeProvider client={centrifuge}>
        <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={ALL_CHAINS}>
          <TransactionProvider>
            <PoolProvider>
              <VaultsProvider>
                <LoadingProvider>
                  <Outlet />
                </LoadingProvider>
              </VaultsProvider>
            </PoolProvider>
          </TransactionProvider>
        </WalletProvider>
      </CentrifugeProvider>
    </QueryClientProvider>
  )
}

export default function Root() {
  return (
    <DebugFlags>
      <TenderlyProvider>
        <RootProviders />
      </TenderlyProvider>
    </DebugFlags>
  )
}
