import { ReactNode, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { http } from 'wagmi'
import { injected, safe } from '@wagmi/connectors'
import type { AppKitNetwork } from '@reown/appkit/networks'

export interface WalletProviderProps {
  projectId: string
  networks: AppKitNetwork[]
  children: ReactNode
}

export function WalletProvider({ projectId, networks, children }: WalletProviderProps) {
  if (networks.length === 0) {
    throw new Error('Networks array cannot be empty')
  }

  const wagmiAdapter = useMemo(() => {
    return new WagmiAdapter({
      networks,
      projectId,
      connectors: [
        safe({ allowedDomains: [/app\.safe\.global$/, /gnosis-safe\.io$/], shimDisconnect: true }),
        injected(),
      ],
      transports: Object.fromEntries(networks.map((chain) => [chain.id, http()])),
    })
  }, [projectId, networks])

  useMemo(() => {
    createAppKit({
      adapters: [wagmiAdapter],
      networks: networks as [AppKitNetwork, ...AppKitNetwork[]],
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
  }, [wagmiAdapter, projectId, networks])

  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
}
