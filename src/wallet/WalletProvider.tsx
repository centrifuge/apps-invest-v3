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
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'

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
        featuredWalletIds: [
          // metamask
          'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
          // rabby
          '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1',
          // bitget
          '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
          // okx
          '5d9f1395b3a8e848684848dc4147cbd05c8d54bb737eac78fe103901fe6b01a1',
        ],
      })
      appKitInitialized = true
    }
  }, [])

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <SolanaWalletProvider wallets={solanaWallets} autoConnect>
        {children}
      </SolanaWalletProvider>
    </WagmiProvider>
  )
}
