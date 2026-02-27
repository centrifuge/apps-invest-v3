import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { http } from 'wagmi'
import { injected, safe } from '@wagmi/connectors'
import type { AppKitNetwork } from '@reown/appkit/networks'
import ArbitrumLogo from '../assets/logos/arbitrum.svg'
import BnbLogo from '../assets/logos/bnb.svg'
import PlumeLogo from '../assets/logos/plume.svg'

export interface WalletProviderProps {
  projectId: string
  networks: AppKitNetwork[]
  rpcUrls?: Record<number, string[]>
  children: ReactNode
}

// Module-level cache to prevent reinitialization across re-renders
// CRITICAL: WagmiAdapter and createAppKit MUST be initialized outside React component
// to prevent state resets during re-renders.
const adapterCache = new Map<string, WagmiAdapter>()

/**
 * Get or create WagmiAdapter and AppKit instance outside React component lifecycle.
 *
 * IMPORTANT: This prevents wallet state from being reset during re-renders.
 * Reference: @reown/appkit-adapter-wagmi best practices
 *
 * Related issues:
 * - Wagmi config changes cause disconnect: https://github.com/rainbow-me/rainbowkit/issues/1839
 * - AppKit reconnection after reload: https://github.com/reown-com/appkit/issues/3223
 */
function getOrCreateAdapter(
  projectId: string,
  networks: AppKitNetwork[],
  rpcUrls?: Record<number, string[]>
): WagmiAdapter {
  const cacheKey = `${projectId}-${networks.map((n) => n.id).join(',')}`

  if (!adapterCache.has(cacheKey)) {
    const connectors = [safe({ allowedDomains: [/app\.safe\.global$/, /gnosis-safe\.io$/] }), injected()]

    const transports = Object.fromEntries(
      networks.map((chain) => {
        const chainId = Number(chain.id)
        const urls = rpcUrls?.[chainId]
        return [chainId, urls?.[0] ? http(urls[0]) : http()]
      })
    )

    const adapter = new WagmiAdapter({
      networks,
      projectId,
      connectors,
      transports,
      pollingInterval: 60000,
    })

    // Initialize AppKit once per adapter
    createAppKit({
      adapters: [adapter],
      networks: networks as [AppKitNetwork, ...AppKitNetwork[]],
      projectId,
      features: { email: false, socials: false, swaps: false, send: false },
      themeMode: 'light',
      chainImages: {
        1: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png', // Ethereum mainnet
        10: 'https://coin-images.coingecko.com/coins/images/25244/large/Optimism.png', // OP Mainnet
        42161: ArbitrumLogo,
        8453: 'https://coin-images.coingecko.com/asset_platforms/images/131/large/base.png', // Base mainnet
        56: BnbLogo,
        43114: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', // Avalanche
        143: 'https://coin-images.coingecko.com/coins/images/38927/large/mon.png', // Monad
        421614: 'https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg', // Arbitrum Sepolia
        84532: 'https://coin-images.coingecko.com/asset_platforms/images/131/large/base.png', // Base Sepolia
        97: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', // BNB Testnet
        98866: PlumeLogo,
        999: 'https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg', // HyperEVM Mainnet
        998: 'https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg', // Hyperliquid Testnet
      },
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
        '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1',
        '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
        '5d9f1395b3a8e848684848dc4147cbd05c8d54bb737eac78fe103901fe6b01a1',
      ],
      themeVariables: {
        '--w3m-font-family': 'Inter, ui-sans-serif',
        '--w3m-accent': 'rgb(37, 43, 52)',
        '--w3m-color-mix': '#FFF9E7',
      },
    })

    adapterCache.set(cacheKey, adapter)
  }

  return adapterCache.get(cacheKey)!
}

export function WalletProvider({ projectId, networks, rpcUrls, children }: WalletProviderProps) {
  if (networks.length === 0) {
    throw new Error('Networks array cannot be empty')
  }

  const wagmiAdapter = getOrCreateAdapter(projectId, networks, rpcUrls)

  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
}
