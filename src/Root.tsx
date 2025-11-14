import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Centrifuge from '@centrifuge/sdk'
import { CentrifugeProvider, DebugFlags, TransactionProvider, useDebugFlags } from '@cfg'
import { LoadingProvider } from '@ui'
import { WalletProvider } from '@wallet/WalletProvider'
import { PoolProvider } from '@contexts/PoolContext'
import { VaultsProvider } from '@contexts/VaultsContext'
import { bscTestnet, bsc } from 'wagmi/chains'

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

const SOLANA_RPC_URLS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  testnet: 'https://api.testnet.solana.com',
  devnet: 'https://api.devnet.solana.com',
}

function RootProviders() {
  const { showMainnet } = useDebugFlags()
  const isMainnet = showMainnet || import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet'

  const solanaRpcUrl = useMemo(() => {
    if (import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet') {
      return SOLANA_RPC_URLS.mainnet
    }
    // TODO: decide if we want to use testnet
    if (import.meta.env.VITE_CENTRIFUGE_ENV === 'testnet') {
      return SOLANA_RPC_URLS.devnet ?? SOLANA_RPC_URLS.testnet
    }
    // Development: use devnet
    return SOLANA_RPC_URLS.devnet
  }, [])

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
      pollingInterval: 15000,
      solana: {
        rpcUrl: solanaRpcUrl,
        commitment: 'confirmed',
      },
    })
  }, [showMainnet, solanaRpcUrl])

  /**
   * For WalletProvider networks, we need to include ALL possible networks (mainnet + testnet)
   * because AppKit cannot dynamically update networks after initialization.
   * The actual environment switching (mainnet vs testnet) is handled by the Centrifuge SDK above.
   * In development with showMainnet debug flag, users can connect to any network,
   * but the app data (pools, vaults, etc.) will be filtered based on the Centrifuge environment.
   */
  const mainnetCentrifuge = useMemo(
    () =>
      new Centrifuge({
        environment: 'mainnet',
        indexerUrl: import.meta.env.VITE_INDEXER_URL_MAINNET,
        rpcUrls: MAINNET_RPC_URLS,
        pollingInterval: 15000,
      }),
    []
  )

  const testnetCentrifuge = useMemo(
    () =>
      new Centrifuge({
        environment: 'testnet',
        indexerUrl: import.meta.env.VITE_INDEXER_URL_TESTNET,
        rpcUrls: TESTNET_RPC_URLS,
        pollingInterval: 15000,
      }),
    []
  )

  // Get networks from both mainnet and testnet Centrifuge instances
  const mainnetNetworks = useMemo(
    () => mainnetCentrifuge.chains.map((cid) => mainnetCentrifuge.getChainConfig(cid)),
    [mainnetCentrifuge]
  )
  const testnetNetworks = useMemo(
    () => testnetCentrifuge.chains.map((cid) => testnetCentrifuge.getChainConfig(cid)),
    [testnetCentrifuge]
  )

  // Combine all networks for wallet provider (AppKit needs all networks upfront)
  const evmNetworks = useMemo(() => {
    const networks = [...mainnetNetworks, ...testnetNetworks]
    // Add BNB chains if not already present
    const mainnetBnbId = 56
    const testnetBnbId = 97
    const hasMainnetBnb = networks.some((n) => n.id === mainnetBnbId)
    const hasTestnetBnb = networks.some((n) => n.id === testnetBnbId)

    if (!hasMainnetBnb) networks.push(bsc)
    if (!hasTestnetBnb) networks.push(bscTestnet)

    return networks
  }, [mainnetNetworks, testnetNetworks])

  return (
    <QueryClientProvider client={queryClient}>
      <CentrifugeProvider client={centrifuge}>
        <WalletProvider
          projectId={import.meta.env.VITE_REOWN_APP_ID!}
          evmNetworks={evmNetworks}
          solanaRpcUrl={solanaRpcUrl}
        >
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
      <RootProviders />
    </DebugFlags>
  )
}
