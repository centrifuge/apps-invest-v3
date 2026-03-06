---
name: sdk-integration
description: Guide for working with the Centrifuge SDK including React Query data fetching hooks, query keys, and SDK configuration. Use when adding new SDK queries, creating data hooks, or understanding SDK data flow.
user-invocable: true
disable-model-invocation: false
---

# Centrifuge SDK Integration Guide

Use this skill when working with the Centrifuge SDK, creating data fetching hooks, or understanding how SDK data flows through the application.

## SDK Overview

The app uses `@centrifuge/sdk` which provides RxJS observables for all data queries. These are wrapped with **TanStack React Query** using `firstValueWithTimeout` to convert observables to promises.

### SDK Configuration

Located in `src/Root.tsx`:

```typescript
const centrifuge = new Centrifuge({
  environment: isMainnet ? 'mainnet' : 'testnet',
  rpcUrls: { /* Multi-chain RPC URLs */ },
  indexerUrl: import.meta.env.VITE_INDEXER_URL,
  disableRepeatOnEvents: true,  // Prevents duplicate re-emissions for React Query
})
```

### SDK Context

Access the SDK instance via hook:

```typescript
import { useCentrifuge } from '@cfg'

const centrifuge = useCentrifuge()
```

## Creating Data Hooks

All SDK hooks follow this pattern in `src/cfg/hooks/`:

### Basic Pattern

```typescript
import { useQuery } from '@tanstack/react-query'
import { useCentrifuge } from './CentrifugeContext'
import { firstValueWithTimeout } from './utils'
import { queryKeys } from './queries/queryKeys'

export function usePoolDetails(poolId: string, options?: { enabled?: boolean }) {
  const centrifuge = useCentrifuge()

  return useQuery({
    queryKey: queryKeys.poolDetails(poolId),
    queryFn: () => firstValueWithTimeout(centrifuge.poolDetails(poolId)),
    enabled: !!poolId && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  })
}
```

### Key Rules

1. **Register query keys** - Add to `src/cfg/hooks/queries/queryKeys.ts`
2. **Use `firstValueWithTimeout`** - Bridges SDK observables to React Query promises
3. **Guard with `enabled`** - Prevent queries when params are missing
4. **Set appropriate `staleTime`** - Default is 10 minutes, override if needed
5. **Use `useQuery`** - Don't manually subscribe to observables

### Return Value

`useQuery` returns standard React Query state:

```typescript
{
  data: T | undefined,
  error: unknown | undefined,
  status: 'pending' | 'success' | 'error',
  isLoading: boolean,    // True on first load
  isPending: boolean,    // True when no cached data
  isSuccess: boolean,
  isError: boolean,
  isFetching: boolean,   // True during any fetch (including background)
}
```

### Query Keys

Centralized in `src/cfg/hooks/queries/queryKeys.ts`:

```typescript
export const queryKeys = {
  pools: () => ['pools'] as const,
  pool: (poolId: string) => ['pool', poolId] as const,
  poolDetails: (poolId: string) => ['poolDetails', poolId] as const,
  allPoolDetails: (poolIdsKey: string) => ['allPoolDetails', poolIdsKey] as const,
  vaults: (centrifugeId: number, scId: string) => ['vaults', centrifugeId, scId] as const,
  investor: (address: string) => ['investor', address] as const,
  portfolio: (address: string) => ['portfolio', address] as const,
  isMember: (address: string, scId: string, centrifugeId: number) => [...] as const,
  allPoolsVaults: (poolIdsKey: string) => ['allPoolsVaults', poolIdsKey] as const,
  investmentsPerVaults: (key: string) => ['investmentsPerVaults', key] as const,
  poolsAccessStatus: (key: string) => ['poolsAccessStatus', key] as const,
}
```

## Batch Query Hooks

For fetching data across multiple pools/vaults, use batch query hooks in `src/cfg/hooks/queries/`:

### useAllPoolsVaultsQuery

Fetches all pools, their networks, vaults, and vault details in one query:

```typescript
const { data: allPoolsVaults, isLoading } = useAllPoolsVaultsQuery(pools)
```

### useInvestmentsPerVaultsQuery

Fetches user investments across multiple vaults:

```typescript
const { data: investments } = useInvestmentsPerVaultsQuery(vaults, address)
```

### usePoolsAccessStatusQuery

Checks user membership/access status across pools:

```typescript
const { data: accessStatus } = usePoolsAccessStatusQuery(pools, address)
```

These hooks use RxJS `combineLatest` internally to batch multiple SDK calls, then wrap with `firstValueWithTimeout`.

## The Bridge: firstValueWithTimeout

Located in `src/cfg/hooks/utils.ts`:

```typescript
import { firstValueFrom } from 'rxjs'
import { timeout } from 'rxjs/operators'

const SDK_QUERY_TIMEOUT = 30_000

export function firstValueWithTimeout<T>(observable: Observable<T>): Promise<T> {
  return firstValueFrom(observable.pipe(timeout(SDK_QUERY_TIMEOUT)))
}
```

- Converts SDK observable to a Promise for React Query's `queryFn`
- 30-second timeout prevents hanging queries
- Errors propagate to React Query for automatic retry (3 retries by default)

## Common SDK Methods

### Pool Queries

```typescript
centrifuge.pools()                    // All pools
centrifuge.pool(poolId)               // Single pool
centrifuge.poolDetails(poolId)        // Pool with metadata
centrifuge.poolActiveNetworks(poolId) // Networks where pool is deployed
```

### Vault Queries

```typescript
poolNetwork.vaults(shareClassId)     // Vaults for a share class on a network
vault.vaultDetails()                 // Vault details
vault.investment(address)            // User's investment in vault
```

### Holdings & Balances

```typescript
shareClass.holdings(address)         // User's holdings
centrifuge.balances(address)         // Token balances
```

## Cache Invalidation

### After Transactions

`useCentrifugeTransaction` automatically invalidates user-specific queries:

```typescript
function invalidateTransactionQueries() {
  centrifuge.clearQueryCache()
  queryClient.invalidateQueries({ queryKey: ['poolsAccessStatus'] })
  queryClient.invalidateQueries({ queryKey: ['portfolio'] })
  queryClient.invalidateQueries({ queryKey: ['investor'] })
  queryClient.invalidateQueries({ queryKey: ['isMember'] })
  queryClient.invalidateQueries({ queryKey: ['investment'] })
  queryClient.invalidateQueries({ queryKey: ['holdings'] })
  queryClient.invalidateQueries({ queryKey: ['investmentsPerVaults'] })
}
```

### On Wallet Change

`WalletInvalidator` in Root.tsx removes user-specific queries when address changes.

### On Environment Switch

`queryClient.clear()` clears ALL cache when switching mainnet/testnet.

## Executing Transactions

Use `useCentrifugeTransaction` for all SDK transactions:

```typescript
import { useCentrifugeTransaction } from '@cfg'

const { execute, isPending } = useCentrifugeTransaction()

const handleDeposit = async (amount: Balance) => {
  try {
    await execute(vault.asyncDeposit(amount))
    // Success - cache invalidation happens automatically
  } catch {
    // Error handled by TransactionProvider
  }
}
```

## Type Exports

Import SDK types from `@cfg`:

```typescript
import type {
  Pool,
  PoolId,
  PoolNetwork,
  Vault,
  ShareClass,
  ShareClassId,
  Balance,
  Price,
} from '@cfg'
```

## File Organization

- `src/cfg/hooks/` - All SDK data hooks
- `src/cfg/hooks/queries/` - React Query hooks and centralized query keys
- `src/cfg/hooks/utils.ts` - `firstValueWithTimeout` utility
- `src/cfg/types/` - SDK type re-exports and custom types
- `src/cfg/index.ts` - Public exports (use `@cfg` alias)
- `src/cfg/hooks/CentrifugeContext.tsx` - SDK provider and hook
- `src/cfg/utils/networkUtils.ts` - Network slug utilities for URL-safe chain names

## Best Practices

1. **Create specific hooks** - Don't expose raw SDK methods to components
2. **Handle loading states** - Always check `isLoading` before rendering
3. **Use enabled option** - Prevent unnecessary queries
4. **Register query keys** - Always add to `queryKeys.ts`
5. **Export from @cfg** - Add new hooks/types to `src/cfg/index.ts`
6. **Add to invalidation lists** - User-specific queries need wallet-change and post-transaction invalidation

## Adding a New SDK Query (Step by Step)

1. Add query key to `src/cfg/hooks/queries/queryKeys.ts`
2. Create hook in `src/cfg/hooks/` using `useQuery` + `firstValueWithTimeout`
3. Set `enabled` to guard against missing params
4. Set appropriate `staleTime`
5. Export from `src/cfg/index.ts`
6. If user-specific: add key to `USER_QUERY_KEYS` in Root.tsx
7. If transaction-affected: add to `invalidateTransactionQueries()` in useCentrifugeTransaction
