import { ReactNode, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { createAppKit } from '@reown/appkit/react'
import { http } from 'wagmi'
import { injected, safe } from '@wagmi/connectors'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase'
import { FEATURED_WALLET_IDS } from './walletIds'

export interface WalletProviderProps {
  projectId: string
  evmNetworks: AppKitNetwork[]
  solanaRpcUrl: string
  children: ReactNode
}

let appKitInitialized = false

export function WalletProvider({ projectId, evmNetworks, solanaRpcUrl, children }: WalletProviderProps) {
  if (evmNetworks.length === 0) {
    throw new Error('Networks array cannot be empty')
  }

  if (!projectId) {
    console.error('WalletProvider: No Reown project ID provided.')
    throw new Error(
      'Reown project ID is required. Get one at https://dashboard.reown.com or check your .env configuration.'
    )
  }

  const wagmiAdapter = useMemo(() => {
    return new WagmiAdapter({
      networks: evmNetworks,
      projectId,
      connectors: [
        safe({ allowedDomains: [/app\.safe\.global$/, /gnosis-safe\.io$/], shimDisconnect: true }),
        injected(),
      ],
      transports: Object.fromEntries(evmNetworks.map((chain) => [chain.id, http()])),
      pollingInterval: 15000,
    })
  }, [projectId, evmNetworks])

  const solanaNetworks: AppKitNetwork[] = useMemo(() => {
    const isMainnet = solanaRpcUrl.includes('mainnet')
    const isTestnet = solanaRpcUrl.includes('testnet')
    const isDevnet = solanaRpcUrl.includes('devnet')

    return [
      {
        ...solana,
        rpcUrls: {
          ...solana.rpcUrls,
          default: {
            http: [isMainnet ? solanaRpcUrl : 'https://api.mainnet-beta.solana.com'],
          },
        },
      },
      {
        ...solanaTestnet,
        rpcUrls: {
          ...solanaTestnet.rpcUrls,
          default: {
            http: [isTestnet ? solanaRpcUrl : 'https://api.testnet.solana.com'],
          },
        },
      },
      {
        ...solanaDevnet,
        rpcUrls: {
          ...solanaDevnet.rpcUrls,
          default: {
            http: [isDevnet ? solanaRpcUrl : 'https://api.devnet.solana.com'],
          },
        },
      },
    ]
  }, [solanaRpcUrl])

  const solanaWallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new CoinbaseWalletAdapter()],
    []
  )

  const solanaAdapter = useMemo(() => {
    return new SolanaAdapter({
      wallets: solanaWallets,
    })
  }, [])

  const allNetworks = useMemo(() => {
    const combined = [...evmNetworks, ...solanaNetworks]
    return combined as [AppKitNetwork, ...AppKitNetwork[]]
  }, [evmNetworks, solanaNetworks])

  useMemo(() => {
    if (!appKitInitialized) {
      createAppKit({
        adapters: [wagmiAdapter, solanaAdapter] as any,
        networks: allNetworks,
        projectId,
        features: { email: false, socials: false, swaps: false, send: false },
        themeMode: 'light',
        featuredWalletIds: FEATURED_WALLET_IDS as unknown as string[],
      })
      appKitInitialized = true
    }
  }, [])

  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
}
