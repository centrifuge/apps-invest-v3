---
name: wallet-patterns
description: Guide for wallet connection, Web3 integration, and network handling using Wagmi, Reown AppKit, and Viem. Use when working with wallet connections, network switching, or transaction signing.
user-invokable: true
disable-model-invocation: false
---

# Wallet Patterns Guide

Use this skill when working with wallet connections, network handling, transaction signing, or any Web3 integration.

## Tech Stack

- **Wagmi 2**: React hooks for Ethereum
- **Viem 2**: TypeScript Ethereum library
- **Reown AppKit 1.8**: Wallet connection modal (formerly WalletConnect)

## Wallet Provider Architecture

Located in `src/wallet/WalletProvider.tsx`:

```typescript
// Module-level initialization (CRITICAL: outside React)
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  connectors: [safe(), injected()],
  transports,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  features: { email: false, socials: false, swaps: false, send: false },
  themeMode: 'light',
})

// React provider
export function WalletProvider({ children }) {
  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>
}
```

**Key Architecture Note**: WagmiAdapter and AppKit are initialized OUTSIDE the React component to prevent wallet disconnections during re-renders.

## Essential Wagmi Hooks

### Check Connection Status

```typescript
import { useAccount } from 'wagmi'

const { address, isConnected, isConnecting, isDisconnected } = useAccount()

if (!isConnected) {
  return <ConnectWalletPrompt />
}
```

### Get Current Chain

```typescript
import { useChainId } from 'wagmi'

const chainId = useChainId() // Returns number (e.g., 1, 8453, 42161)
```

### Get Connector Client (for Transactions)

```typescript
import { useConnectorClient } from 'wagmi'

const { data: client } = useConnectorClient()

// Used by useCentrifugeTransaction to get signer
if (client) {
  centrifuge.setSigner(client)
}
```

### Switch Networks

```typescript
import { useSwitchChain } from 'wagmi'

const { switchChain, isPending } = useSwitchChain()

const handleSwitch = () => {
  switchChain({ chainId: 8453 }) // Switch to Base
}
```

## Opening Wallet Modal

Use AppKit's modal for wallet connection:

```typescript
import { useAppKit } from '@reown/appkit/react'

const { open } = useAppKit()

// Open connection modal
const handleConnect = () => {
  open()
}

// Open to specific view
open({ view: 'Networks' }) // Network selector
open({ view: 'Account' })  // Account details
```

## Network Handling

### Supported Networks

The app supports multiple networks. Chain IDs are defined in the codebase:

**Mainnet chains**: Ethereum (1), Base (8453), Arbitrum (42161), Avalanche (43114), BNB (56)

**Testnet chains**: Base Sepolia (84532), Arbitrum Sepolia (421614), BNB Testnet (97)

### Network Auto-Selection

The app automatically selects the network matching the connected wallet's chain:

```typescript
// From PoolContext.tsx
const connectedChainId = useChainId()

useEffect(() => {
  if (networks?.length && connectedChainId) {
    const currentNetwork = networks.find(
      n => n.centrifugeId === blockchainsMap.get(connectedChainId)?.centrifugeId
    )
    if (currentNetwork) {
      setNetwork(currentNetwork)
    }
  }
}, [networks, connectedChainId])
```

### Debug Flag: showMainnet

In development, the `showMainnet` debug flag switches between mainnet/testnet data while keeping all networks available to AppKit.

## Safe.global Support

The wallet provider includes Safe connector for multi-sig support:

```typescript
import { safe } from '@wagmi/connectors'

const connectors = [
  safe({ allowedDomains: [/app\.safe\.global$/, /gnosis-safe\.io$/] }),
  injected()
]
```

## Featured Wallets

The AppKit configuration highlights these wallets:
- MetaMask
- Rabby
- Bitget Wallet
- OKX Wallet

## Common Patterns

### Require Wallet Connection

```typescript
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

export function RequireWallet({ children }) {
  const { isConnected } = useAccount()
  const { open } = useAppKit()

  if (!isConnected) {
    return (
      <Box>
        <Text>Please connect your wallet</Text>
        <Button onClick={() => open()}>Connect Wallet</Button>
      </Box>
    )
  }

  return children
}
```

### Check Correct Network

```typescript
import { useChainId, useSwitchChain } from 'wagmi'

export function useNetworkCheck(requiredChainId: number) {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isCorrectNetwork = chainId === requiredChainId

  const switchToRequired = () => {
    if (!isCorrectNetwork) {
      switchChain({ chainId: requiredChainId })
    }
  }

  return { isCorrectNetwork, switchToRequired, isSwitching: isPending }
}
```

### Display Connected Address

```typescript
import { useAccount } from 'wagmi'

export function WalletAddress() {
  const { address } = useAccount()

  if (!address) return null

  // Truncate address for display
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`

  return <Text>{truncated}</Text>
}
```

### Transaction Button Pattern

```typescript
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useCentrifugeTransaction } from '@cfg'

export function TransactionButton({ onExecute, children }) {
  const { isConnected } = useAccount()
  const { open } = useAppKit()
  const { execute, isPending } = useCentrifugeTransaction()

  if (!isConnected) {
    return <Button onClick={() => open()}>Connect Wallet</Button>
  }

  return (
    <Button
      onClick={() => onExecute(execute)}
      isLoading={isPending}
      isDisabled={isPending}
    >
      {children}
    </Button>
  )
}
```

## Import Aliases

```typescript
// Wagmi hooks
import { useAccount, useChainId, useConnectorClient, useSwitchChain } from 'wagmi'

// AppKit
import { useAppKit } from '@reown/appkit/react'

// Internal wallet utilities
import { WalletProvider } from '@wallet/WalletProvider'
```

## Key Files

- `src/wallet/WalletProvider.tsx` - Provider setup and configuration
- `src/cfg/hooks/useCentrifugeTransaction.tsx` - Transaction execution with signer
- `src/contexts/PoolContext.tsx` - Network auto-selection logic
- `src/components/NetworkButton/` - Network display and switching UI

## Best Practices

1. **Always check `isConnected`** before wallet operations
2. **Use AppKit modal** for connection, not custom UI
3. **Handle network mismatches** gracefully with switch prompts
4. **Disable actions during `isPending`** states
5. **Don't store wallet state** - use Wagmi hooks as source of truth
6. **Initialize outside React** - WagmiAdapter must be module-level

## Common Issues

### Wallet Disconnects on Re-render
- Caused by recreating WagmiAdapter inside component
- Solution: Initialize adapter outside React component lifecycle

### Network Not Available
- AppKit loads all networks at initialization
- UI filters which networks to display based on debug flags

### Transaction Fails Silently
- Check wallet connection with `useAccount`
- Verify signer setup with `useConnectorClient`
- Check TransactionProvider is in component tree
