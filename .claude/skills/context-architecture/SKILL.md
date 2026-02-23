---
name: context-architecture
description: Understanding the provider stack and context relationships including PoolContext, VaultsContext, and TransactionProvider. Use when deciding where state should live or adding new shared data.
user-invokable: true
disable-model-invocation: false
---

# Context Architecture Guide

Use this skill when working with React contexts, deciding where state should live, or understanding how data flows through the provider stack.

## Provider Stack

The app uses a deeply nested provider architecture. Entry point: `src/main.tsx` -> `src/Root.tsx`

```
DebugFlags (Development debugging - MUST be outermost)
  -> QueryClientProvider (TanStack Query)
    -> CentrifugeProvider (SDK instance)
      -> WalletProvider (Wagmi + Reown AppKit)
        -> TransactionProvider (Transaction lifecycle)
          -> PoolProvider (Pool data context)
            -> VaultsProvider (Vaults data context)
              -> LoadingProvider (Global loading boundaries)
                -> <Outlet /> (React Router)
```

**Critical**: DebugFlags must wrap all other providers so `useDebugFlags()` can be called during provider initialization.

## The Three Business Contexts

### 1. PoolContext (`src/contexts/PoolContext.tsx`)

**Purpose**: Manages pool selection and pool-level data.

**Data provided**:
```typescript
{
  // Connection
  connectedChainId: number | undefined

  // Pool data
  pools: Pool[] | undefined
  pool: Pool | undefined
  poolId: string | undefined
  selectedPoolId: PoolId | undefined
  poolDetails: PoolDetails | undefined
  poolTVL: string | undefined

  // Network
  network: PoolNetwork | undefined
  networks: PoolNetwork[] | undefined

  // Share class (MVP: one per pool)
  shareClass: ShareClassWithDetails | undefined
  shareClassId: ShareClassId | undefined

  // Holdings
  holdings: Holdings | undefined

  // Loading states
  isLoading: boolean
  isPoolsLoading: boolean
  isNetworksLoading: boolean
  isPoolDetailsLoading: boolean
  isHoldingsLoading: boolean
  isPoolDataReady: boolean

  // Actions
  setSelectedPoolId: (poolId: PoolId) => void
}
```

**Key behaviors**:
- Pool selected from URL params (`/pool/:poolId`)
- Network auto-selected based on connected wallet's chain
- `isPoolDataReady` checks both selectedPoolId and network.pool are synced

**Usage**:
```typescript
import { usePoolContext } from '@contexts/PoolContext'

const { pool, poolDetails, network, isLoading } = usePoolContext()
```

### 2. VaultsContext (`src/contexts/VaultsContext.tsx`)

**Purpose**: Manages vault selection and vault-level data. **Depends on PoolContext**.

**Data provided**:
```typescript
{
  // Vault data
  vault: Vault | undefined
  vaults: Vault[] | undefined
  vaultDetails: VaultDetails | undefined
  vaultsDetails: VaultDetails[] | undefined

  // Investment data
  investment: Investment | undefined
  investmentsPerVaults: Investment[] | undefined

  // Loading states
  isLoading: boolean
  isVaultDetailsLoading: boolean
  isInvestmentLoading: boolean

  // Actions
  setVault: Dispatch<SetStateAction<Vault | undefined>>
  setVaults: Dispatch<SetStateAction<Vault[] | undefined>>
}
```

**Key behaviors**:
- Depends on `isPoolDataReady` from PoolContext
- Auto-selects first vault when pool changes
- Auto-selects vault with claimable assets if any

**Usage**:
```typescript
import { useVaultsContext } from '@contexts/VaultsContext'

const { vault, vaultDetails, investment, setVault } = useVaultsContext()
```

### 3. TransactionProvider (`src/cfg/hooks/TransactionProvider.tsx`)

**Purpose**: Manages transaction lifecycle and toast notifications.

**Data provided**:
```typescript
{
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  addOrUpdateTransaction: (tx: Transaction) => void
  updateTransaction: (id: string, update: Partial<Transaction>) => void
}
```

**Transaction states**: `creating` -> `unconfirmed` -> `pending` -> `succeeded` | `failed`

**Usage**:
```typescript
import { useTransactions, useTransaction } from '@cfg'

// Get all transactions
const { transactions } = useTransactions()

// Get specific transaction
const tx = useTransaction(txId)
```

**Note**: Usually accessed via `useCentrifugeTransaction()` hook, not directly.

## Context Relationships

```
PoolContext
    |
    v
VaultsContext (depends on PoolContext)
    |
    v
Components (consume both contexts)
```

VaultsContext MUST be rendered inside PoolContext. It uses:
- `isPoolDataReady` to enable queries
- `network` to fetch vaults for correct chain
- `selectedPoolId` to reset vault selection
- `shareClassId` to fetch correct vaults

## When to Use Each Context

### Use PoolContext when:
- Displaying pool list or pool details
- Working with pool-level metadata
- Handling network selection
- Accessing share class info
- Working with holdings data

### Use VaultsContext when:
- Displaying vault options
- Working with specific vault details
- Handling investments/deposits/redemptions
- Showing claimable assets

### Use TransactionProvider when:
- Executing SDK transactions (via `useCentrifugeTransaction`)
- Showing transaction history
- Displaying transaction toasts

## Adding New Shared State

### Decision Tree

1. **Is it user-specific session data?** (e.g., preferences, UI state)
   - Consider local state or a new lightweight context

2. **Is it pool-related data?**
   - Add to PoolContext
   - Use existing SDK hooks pattern

3. **Is it vault-related data?**
   - Add to VaultsContext
   - Ensure it depends on `isPoolDataReady`

4. **Is it transaction-related?**
   - Extend TransactionProvider
   - Or create transaction-specific hooks

5. **Is it global app state?**
   - Consider if it belongs in Root.tsx providers
   - Or create a new context near the top of the stack

### Adding to Existing Context

```typescript
// 1. Add hook for data fetching
const { data: newData, isLoading: isNewDataLoading } = useNewDataHook(poolId, {
  enabled: !!selectedPoolId,
})

// 2. Add to context value
<PoolContext.Provider
  value={{
    ...existingValues,
    newData,
    isNewDataLoading,
  }}
>

// 3. Update context type
const PoolContext = createContext<{
  // ...existing
  newData: NewDataType | undefined
  isNewDataLoading: boolean
} | undefined>(undefined)

// 4. Update composite isLoading if relevant
const isLoading = isPoolsLoading || isNewDataLoading || ...
```

## Common Patterns

### Context Hook with Error

```typescript
export const usePoolContext = () => {
  const context = useContext(PoolContext)
  if (!context) {
    throw new Error('usePoolContext must be used within a PoolProvider')
  }
  return context
}
```

### Conditional Data Fetching

```typescript
// In VaultsContext - only fetch when pool is ready
const { data: vaultDetails } = useVaultDetails(vault, {
  enabled: isPoolDataReady,
})
```

### Tracking Selection Changes

```typescript
// Reset state when pool changes
const lastPoolIdRef = useRef<string | undefined>()

useEffect(() => {
  if (selectedPoolId !== lastPoolIdRef.current) {
    // Pool changed, reset dependent state
    setVault(undefined)
    lastPoolIdRef.current = selectedPoolId?.toString()
  }
}, [selectedPoolId])
```

### Ref-based One-time Actions

```typescript
// Auto-select vault with claimable assets (once per pool)
const hasAutoSelectedRef = useRef(false)

useEffect(() => {
  if (hasAutoSelectedRef.current) return

  const vaultWithClaimable = findVaultWithClaimable()
  if (vaultWithClaimable) {
    setVault(vaultWithClaimable)
    hasAutoSelectedRef.current = true
  }
}, [investments])
```

## File Locations

- `src/contexts/PoolContext.tsx` - Pool state management
- `src/contexts/VaultsContext.tsx` - Vault state management
- `src/cfg/hooks/TransactionProvider.tsx` - Transaction lifecycle
- `src/cfg/hooks/CentrifugeContext.tsx` - SDK provider
- `src/Root.tsx` - Provider stack assembly

## Best Practices

1. **Keep contexts focused** - Each context has a specific domain
2. **Use `enabled` option** - Prevent queries until dependencies ready
3. **Track loading states** - Composite `isLoading` for UI feedback
4. **Reset on dependency change** - Use refs to track and reset state
5. **Throw on missing provider** - Help catch incorrect usage early
6. **Memoize context values** - Prevent unnecessary re-renders

## Anti-patterns to Avoid

1. **Don't bypass context hierarchy** - VaultsContext needs PoolContext
2. **Don't duplicate SDK data** - Use hooks, don't cache in state
3. **Don't mix concerns** - Keep pool/vault/transaction domains separate
4. **Don't use context for derived data** - Compute in components or hooks
5. **Don't forget `enabled`** - Causes unnecessary/failed queries
