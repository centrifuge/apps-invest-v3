# Solana Wallet Integration

## Overview

This document describes the Solana wallet integration added to the Centrifuge Invest V3 application. The implementation uses Reown AppKit's Solana adapter to provide a unified wallet connection experience for both EVM and Solana chains.

## Changes Made

### 1. Dependencies Added

```bash
@reown/appkit-adapter-solana
@solana/wallet-adapter-base
@solana/wallet-adapter-react
@solana/wallet-adapter-wallets
```

### 2. New Files Created

#### `src/wallet/useWalletConnection.ts`

- **Purpose**: Unified hook for accessing both EVM and Solana wallet connections
- **Exports**: `useWalletConnection()` hook with the following interface:
  ```typescript
  {
    address: string | undefined // Universal address (EVM or Solana format)
    isConnected: boolean // Connection status
    walletType: 'evm' | 'solana' | null // Type of connected wallet
    chainId: number | undefined // EVM chain ID (undefined for Solana)
    publicKey: string | undefined // Solana public key (undefined for EVM)
  }
  ```

#### `src/wallet/addressUtils.ts`

- **Purpose**: Utility functions for handling both EVM and Solana addresses
- **Functions**:
  - `detectAddressType(address: string)` - Detects if address is EVM or Solana
  - `isValidEvmAddress(address: string)` - Validates EVM addresses
  - `isValidSolanaAddress(address: string)` - Validates Solana addresses
  - `truncateAddress(address: string)` - Truncates addresses for display

### 3. Modified Files

#### `src/wallet/WalletProvider.tsx`

- Added Solana adapter alongside existing Wagmi adapter
- Integrated Phantom and Solflare wallet support
- Added Solana networks (mainnet, testnet, devnet) to AppKit configuration
- Wrapped app with both WagmiProvider and SolanaWalletProvider

#### `src/wallet/WalletButton.tsx`

- Updated to use `useWalletConnection()` instead of `useAddress()`
- Added support for displaying both EVM and Solana addresses
- Adjusted address truncation based on wallet type (Solana addresses use shorter truncation)

#### `src/components/elements/NetworkButton.tsx`

- Added Solana network detection
- When connected to Solana wallet, displays "Solana" (network switching not yet implemented for Solana)
- EVM network switching remains unchanged

#### `src/cfg/hooks/useAddress.ts`

- **BREAKING CHANGE**: Now returns extended interface with multi-chain support
- Added `evmAddress` property for backward compatibility with Centrifuge SDK calls
- Centrifuge SDK operations (pools, vaults, investments) **must** use `evmAddress` instead of `address`

#### Files updated to use `evmAddress`:

- `src/cfg/hooks/useInvestor.ts` - Changed to use `evmAddress` for SDK calls
- `src/cfg/hooks/useVaults.ts` - Changed to use `evmAddress` for investment queries

## Architecture Notes

### Multi-Chain Wallet Strategy

The implementation follows **Option 1** (Unified Reown AppKit approach):

- Single wallet modal for both EVM and Solana wallets
- Reown AppKit handles wallet discovery and connection
- Solana Wallet Adapter provides React hooks for Solana-specific operations

### Type Safety for EVM Operations

The Centrifuge SDK requires EVM addresses in the format `0x${string}`. To maintain type safety:

- `useAddress()` returns both `address` (universal) and `evmAddress` (EVM-only)
- **All Centrifuge SDK operations MUST use `evmAddress`**
- This ensures Solana addresses are never passed to EVM-only functions

### Debug Flags Support

The existing debug address override continues to work and is treated as an EVM address.

## Testing Instructions

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Test EVM Wallet Connection (Existing Functionality)

1. Click "Connect wallet" button
2. Select an EVM wallet (MetaMask, Rabby, etc.)
3. Verify wallet connects successfully
4. Verify address displays correctly in wallet button
5. Verify network switcher shows available EVM networks
6. Test existing pool/vault functionality

### 3. Test Solana Wallet Connection (New Functionality)

1. Disconnect any connected EVM wallet
2. Click "Connect wallet" button
3. Select a Solana wallet (Phantom or Solflare)
4. Verify wallet connects successfully
5. Verify Solana address displays correctly (shorter truncation: `abcd...efgh`)
6. Verify network button shows "Solana" instead of EVM networks
7. Note: Pool/vault functionality will NOT work with Solana wallet (this is expected - Centrifuge SDK is EVM-only)

### 4. Test Wallet Switching

1. Connect Solana wallet
2. Click wallet button to open AppKit modal
3. Disconnect Solana wallet
4. Connect EVM wallet
5. Verify UI updates correctly
6. Repeat in reverse order

### 5. Expected Behaviors

#### When EVM Wallet Connected:

- ✅ Wallet button shows truncated EVM address (e.g., `0x1234...5678`)
- ✅ Network switcher shows available EVM chains
- ✅ All existing pool/vault functionality works
- ✅ Centrifuge SDK operations function normally

#### When Solana Wallet Connected:

- ✅ Wallet button shows truncated Solana address (e.g., `abcd...efgh`)
- ✅ Network button shows "Solana" (not clickable)
- ⚠️ Pool/vault queries will not return data (Centrifuge SDK is EVM-only)
- ⚠️ Investment operations disabled (requires EVM wallet)

## Future Enhancements

### Immediate Next Steps

1. **Solana Transaction Support**: Implement transaction signing for Solana operations
2. **Network Switching**: Add Solana cluster switching (mainnet/testnet/devnet)
3. **Connection Guards**: Add UI warnings when Solana wallet is connected for EVM-only features

### Long-term Considerations

1. **Dual Wallet Support**: Allow simultaneous EVM + Solana wallet connections
2. **Solana Pool Integration**: If Centrifuge expands to Solana, add Solana-specific pool queries
3. **Address Validation**: Add user-facing validation when entering addresses manually
4. **Transaction Abstraction**: Create unified transaction interface for both chains

## Known Limitations

1. **No Solana SDK Support**: The Centrifuge SDK only supports EVM chains. Solana wallet connections are UI-only at this stage.
2. **No Solana Network Switching**: The network button for Solana is static (doesn't allow switching between mainnet/testnet/devnet).
3. **Type Assertion Required**: WalletProvider uses `as any` for the adapters array due to type version mismatches between packages.

## Troubleshooting

### Build Errors

If you see errors about `@reown/appkit-adapter-solana`, ensure all dependencies are installed:

```bash
pnpm install
```

### Wallet Connection Issues

- Ensure you have Phantom or Solflare browser extension installed
- Check browser console for connection errors
- Try refreshing the page and reconnecting

### TypeScript Errors

If you see type errors about `address` not being assignable to `0x${string}`:

- Ensure you're using `evmAddress` instead of `address` for Centrifuge SDK calls
- Check that `useAddress()` import is from the correct path

## Questions?

For issues or questions about this integration, please contact the development team or create an issue in the repository.
