---
name: context-architecture
description: Understanding the provider stack and context relationships including PoolContext, VaultsContext, and TransactionProvider. Use when deciding where state should live or adding new shared data.
user-invocable: true
disable-model-invocation: false
---

# Context Architecture Guide

Use this skill when working with React contexts, deciding where state should live, or understanding how data flows through the provider stack.

## Provider Stack

The app uses a deeply nested provider architecture. Entry point: `src/main.tsx` -> `src/Root.tsx`

```
DebugFlags (Development debugging - MUST be outermost)
  -> QueryClientProvider (TanStack Query - primary data caching layer)
    -> CentrifugeProvider (SDK instance)
      -> WalletProvider (Wagmi + Reown AppKit)
        -> WalletInvalidator (Clears user-specific query cache on wallet change)
          -> TransactionProvider (Transaction lifecycle)
            -> PoolProvider (Pool data context)
              -> LoadingProvider (Global loading boundaries)
                -> <Outlet /> (React Router)
```

**Critical**: DebugFlags must wrap all other providers so `useDebugFlags()` can be called during provider initialization.

**NOTE**: VaultsProvider is NOT in Root.tsx. It wraps only the pool detail route in `src/routes/router.tsx`.

### WalletInvalidator

A component in Root.tsx that handles cache management when wallet address changes:

```typescript
const USER_QUERY_KEYS = [
  'investment', 'holdings', 'investor', 'portfolio', 'isMember',
  'investmentsPerVaults', 'poolsAccessStatus',
]
```

When wallet address changes, all user-specific queries are removed from cache. Global data (pools, blockchains) is preserved.

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
  poolId: string | undefined        // From URL params
  poolDetails: PoolDetails | undefined
  poolTVL: string | undefined

  // URL params
  networkFromUrl: string | undefined  // Network slug from URL
  assetFromUrl: string | undefined    // Asset symbol from URL

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
}
```

**Key behaviors**:
- Pool selected from URL params (`/pool/:poolId/:network/:asset`)
- Network auto-selected based on connected wallet's chain
- URL params (`networkFromUrl`, `assetFromUrl`) passed to VaultsContext for vault selection
- `isPoolDataReady` checks both poolId and network are available

**Usage**:
```typescript
import { usePoolContext } from '@contexts/PoolContext'

const { pool, poolDetails, network, isLoading } = usePoolContext()
```

### 2. VaultsContext (`src/contexts/VaultsContext.tsx`)

**Purpose**: Manages vault selection and vault-level data. **Depends on PoolContext**.

**Important**: Only wraps the pool detail route, NOT the entire app.

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
- URL-based vault selection using `networkFromUrl` and `assetFromUrl`
- Falls back to first vault if no URL match
- Simplified compared to previous version (no `investmentsPerVaults`)

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
PoolContext (in Root.tsx)
    |
    v
VaultsContext (in router.tsx, pool detail route only)
    |
    v
Components (consume both contexts)
```

VaultsContext MUST be rendered inside PoolContext. It uses:
- `isPoolDataReady` to enable queries
- `network` to fetch vaults for correct chain
- `shareClassId` to fetch correct vaults
- `networkFromUrl` and `assetFromUrl` for vault selection

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
- Note: Only available on pool detail route

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
   - Use React Query hooks pattern

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
// 1. Add React Query hook for data fetching
const { data: newData, isLoading: isNewDataLoading } = useQuery({
  queryKey: queryKeys.myNewData(poolId),
  queryFn: () => firstValueWithTimeout(centrifuge.myNewQuery(poolId)),
  enabled: !!poolId,
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

// 4. If user-specific, add query key to USER_QUERY_KEYS in Root.tsx
// 5. If transaction-affected, add to invalidateTransactionQueries()
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

## File Locations

- `src/contexts/PoolContext.tsx` - Pool state management
- `src/contexts/VaultsContext.tsx` - Vault state management
- `src/cfg/hooks/TransactionProvider.tsx` - Transaction lifecycle
- `src/cfg/hooks/CentrifugeContext.tsx` - SDK provider
- `src/Root.tsx` - Provider stack assembly (includes WalletInvalidator)
- `src/routes/router.tsx` - VaultsProvider placement

## Best Practices

1. **Keep contexts focused** - Each context has a specific domain
2. **Use `enabled` option** - Prevent queries until dependencies ready
3. **Track loading states** - Composite `isLoading` for UI feedback
4. **Reset on dependency change** - Use refs to track and reset state
5. **Throw on missing provider** - Help catch incorrect usage early
6. **Register new query keys** - Add to `queryKeys.ts` and invalidation lists as needed

## Anti-patterns to Avoid

1. **Don't bypass context hierarchy** - VaultsContext needs PoolContext
2. **Don't duplicate SDK data** - Use React Query hooks, don't cache in state
3. **Don't mix concerns** - Keep pool/vault/transaction domains separate
4. **Don't use context for derived data** - Compute in components or hooks
5. **Don't forget `enabled`** - Causes unnecessary/failed queries
6. **Don't forget cache invalidation** - User-specific queries need wallet-change and post-transaction invalidation
