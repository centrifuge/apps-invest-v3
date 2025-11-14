# Wallet Module

This module provides wallet connection and management for both EVM and Solana chains.

## Usage Examples

### Checking Wallet Connection

```typescript
import { useWalletConnection } from '@wallet/useWalletConnection'

function MyComponent() {
  const { isConnected, address, walletType } = useWalletConnection()

  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }

  return (
    <div>
      Connected: {address}
      Type: {walletType}
    </div>
  )
}
```

### Using with Centrifuge SDK (EVM Only)

```typescript
import { useAddress } from '@cfg'

function PoolComponent() {
  const { evmAddress, isConnected, walletType } = useAddress()

  // IMPORTANT: Use evmAddress for Centrifuge SDK operations
  if (walletType !== 'evm' || !evmAddress) {
    return <div>Please connect an EVM wallet to view pools</div>
  }

  const investor$ = centrifuge.investor(evmAddress)

  // ...
}
```

### Conditional Logic by Chain Type

```typescript
import { useWalletConnection } from '@wallet/useWalletConnection'

function TransactionButton() {
  const { walletType, address, publicKey } = useWalletConnection()

  const handleTransaction = async () => {
    if (walletType === 'evm') {
      const tx = await executeEvmTransaction(address)
    } else if (walletType === 'solana') {
      const tx = await executeSolanaTransaction(publicKey)
    }
  }

  return <button onClick={handleTransaction}>Send Transaction</button>
}
```

### Address Validation

```typescript
import { detectAddressType, isValidEvmAddress, isValidSolanaAddress } from '@wallet/addressUtils'

function AddressInput() {
  const [address, setAddress] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddress(value)

    const type = detectAddressType(value)
    console.log('Address type:', type) // 'evm' | 'solana' | null
  }

  const isValid = isValidEvmAddress(address) || isValidSolanaAddress(address)

  return (
    <div>
      <input value={address} onChange={handleChange} />
      {!isValid && <span>Invalid address</span>}
    </div>
  )
}
```

### Executing Solana Transactions - if not handled via the SDK

```typescript
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletConnection } from '@wallet/useWalletConnection'
import { Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js' // you'll need to import this dependency

function SolanaTransfer() {
  const { walletType, publicKey } = useWalletConnection()
  const { sendTransaction } = useWallet()

  if (walletType !== 'solana') {
    return <div>Please connect a Solana wallet</div>
  }

  const handleTransfer = async () => {
    if (!publicKey) return

    const connection = new Connection('https://api.mainnet-beta.solana.com')
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(publicKey),
        toPubkey: new PublicKey('DESTINATION_ADDRESS'),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      })
    )

    try {
      const signature = await sendTransaction(transaction, connection)
      console.log('Transaction signature:', signature)
    } catch (error) {
      console.error('Transaction failed:', error)
    }
  }

  return <button onClick={handleTransfer}>Send SOL</button>
}
```

## API Reference

### `useWalletConnection()`

Returns the current wallet connection state.

**Returns:**

```typescript
{
  address: string | undefined // Universal address (EVM or Solana)
  isConnected: boolean
  walletType: 'evm' | 'solana' | null // Type of connected wallet
  chainId: number | undefined // EVM chain ID (undefined for Solana)
  publicKey: string | undefined // Solana public key (undefined for EVM)
}
```

### `useAddress()`

Extends `useWalletConnection()` with additional EVM-specific properties for Centrifuge SDK compatibility.

**Returns:**

```typescript
{
  address: string | undefined // Universal address
  evmAddress: `0x${string}` | undefined
  isConnected: boolean
  walletType: 'evm' | 'solana' | null
  chainId: number | undefined
  publicKey: string | undefined
}
```

**Important:** Always use `evmAddress` when calling Centrifuge SDK EVM methods.

## Components

### `<WalletButton />`

Displays wallet connection status and opens the wallet modal.

**Props:**

- `colorPalette?: ButtonColorPalette[]` - Colors for [connected, disconnected] states
- `variant?: ButtonVariant[]` - Button variants for [connected, disconnected] states

### `<NetworkButton />`

Displays current network and allows switching between networks (EVM only).

**Behavior:**

- Shows EVM chain selector when EVM wallet connected
- Shows Solana logo when Solana wallet connected

## Notes

- The debug address override (from DebugFlags) is always treated as an EVM address
