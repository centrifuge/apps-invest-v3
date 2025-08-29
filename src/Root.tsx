import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Centrifuge from '@centrifuge/sdk'
import { CentrifugeProvider, DebugFlags, TransactionProvider } from '@cfg'
import { LoadingProvider } from '@ui'
import { WalletProvider } from '@wallet'
import { PoolProvider } from '@contexts/usePoolContext'
import { VaultsProvider } from '@contexts/useVaultsContext'
import { bscTestnet, bsc } from 'wagmi/chains'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY
const INFURA_KEY = import.meta.env.VITE_INFURA_KEY
const ONFINALITY_KEY = import.meta.env.VITE_ONFINALITY_KEY

const queryClient = new QueryClient()

const MAINNET_RPC_URLS = {
  1: [
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    `https://eth.api.onfinality.io/rpc?apikey=${ONFINALITY_KEY}`,
  ],
  8453: [`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  42161: [`https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  43114: [`https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`],
}

const TESTNET_RPC_URLS = {
  11155111: [`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`, `https://sepolia.infura.io/v3/${INFURA_KEY}`],
  84532: [`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  421612: [`https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
  431142: [`https://avax-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`],
}

export default function Root() {
  /**
   * Initialize Centrifuge SDK with any necessary config.
   * We need to ensure it is created only once, so we must use useMemo.
   * If we don't use useMemo, it can create a new instance on every render,
   * which can lead to issues with state management and performance.
   * Be sure to always use the same instance of Centrifuge SDK throughout the app,
   * from `useCentrifuge()` set in `CentrifugeProvider`.
   */

  const centrifuge = useMemo(
    () =>
      new Centrifuge({
        environment: import.meta.env.VITE_CENTRIFUGE_ENV,
        indexerUrl: import.meta.env.VITE_INDEXER_URL,
        rpcUrls: import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet' ? MAINNET_RPC_URLS : TESTNET_RPC_URLS,
      }),
    []
  )

  // Add bnb chain if not present in centrifuge chains
  const bnbChainId = import.meta.env.VITE_CENTRIFUGE_ENV === 'testnet' ? 97 : 56
  const bnbNetwork = import.meta.env.VITE_CENTRIFUGE_ENV === 'testnet' ? bscTestnet : bsc
  const networks = useMemo(() => centrifuge.chains.map((cid) => centrifuge.getChainConfig(cid)), [centrifuge])
  const providerNetworks = centrifuge.chains.includes(bnbChainId) ? networks : [bnbNetwork, ...networks]

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CentrifugeProvider client={centrifuge}>
          <WalletProvider projectId={import.meta.env.VITE_REOWN_APP_ID!} networks={providerNetworks}>
            <TransactionProvider>
              <PoolProvider>
                <VaultsProvider>
                  <DebugFlags>
                    <LoadingProvider>
                      <Outlet />
                    </LoadingProvider>
                  </DebugFlags>
                </VaultsProvider>
              </PoolProvider>
            </TransactionProvider>
          </WalletProvider>
        </CentrifugeProvider>
      </QueryClientProvider>
    </>
  )
}
