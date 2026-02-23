---
name: sdk-integration
description: Guide for working with the Centrifuge SDK including observable patterns, data fetching hooks, and SDK configuration. Use when adding new SDK queries, creating data hooks, or understanding SDK data flow.
user-invokable: true
disable-model-invocation: false
---

# Centrifuge SDK Integration Guide

Use this skill when working with the Centrifuge SDK, creating data fetching hooks, or understanding how SDK data flows through the application.

## SDK Overview

The app uses `@centrifuge/sdk` which provides RxJS observables for all data queries. These are wrapped with React hooks using a custom `useObservable` pattern.

### SDK Configuration

Located in `src/Root.tsx`:

```typescript
const centrifuge = new Centrifuge({
  environment: import.meta.env.VITE_CENTRIFUGE_ENV, // 'mainnet' | 'testnet'
  rpcUrls: {
    // Multi-chain RPC URLs for Ethereum, Base, Arbitrum, etc.
  },
  indexerUrl: import.meta.env.VITE_INDEXER_URL,
  pollingInterval: 15000,
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
import { useMemo } from 'react'
import { useCentrifuge } from './CentrifugeContext'
import { useObservable } from './useObservable'

export function usePoolDetails(poolId: PoolId, options?: { enabled?: boolean }) {
  const centrifuge = useCentrifuge()

  // CRITICAL: Always memoize the observable
  const details$ = useMemo(
    () => (options?.enabled !== false && poolId
      ? centrifuge.poolDetails(poolId)
      : undefined),
    [centrifuge, poolId, options?.enabled]
  )

  return useObservable(details$)
}
```

### Key Rules

1. **Always memoize observables** - Use `useMemo` to prevent re-subscriptions
2. **Handle `enabled` option** - Return `undefined` when disabled
3. **Include all dependencies** - Missing deps cause stale data
4. **Use `useObservable`** - Don't manually subscribe

### Return Value

`useObservable` returns:

```typescript
{
  data: T | undefined,      // The data when available
  error: unknown | undefined, // Error if query failed
  status: 'idle' | 'loading' | 'success' | 'error',
  isIdle: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
  retry: () => void,        // Retry failed queries
}
```

## Combining Observables

### Parallel Queries (combineLatest)

```typescript
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

export function usePoolAndVaultDetails(poolId: PoolId, vaultAddress: string) {
  const centrifuge = useCentrifuge()

  const combined$ = useMemo(() => {
    if (!poolId || !vaultAddress) return undefined

    return combineLatest([
      centrifuge.poolDetails(poolId),
      centrifuge.vaultDetails(vaultAddress)
    ]).pipe(
      map(([pool, vault]) => ({ pool, vault }))
    )
  }, [centrifuge, poolId, vaultAddress])

  return useObservable(combined$)
}
```

### Sequential Queries (switchMap)

```typescript
import { switchMap } from 'rxjs/operators'

export function useVaultFromPool(poolId: PoolId) {
  const centrifuge = useCentrifuge()

  const vault$ = useMemo(() => {
    if (!poolId) return undefined

    return centrifuge.pool(poolId).pipe(
      switchMap(pool => centrifuge.vaults(pool.network, pool.shareClassId))
    )
  }, [centrifuge, poolId])

  return useObservable(vault$)
}
```

## Handling UI Flickering

The SDK may temporarily emit `undefined` during re-subscriptions. Use the `usePoolsQuery` pattern:

```typescript
export function useMyQueryWithFlickerPrevention() {
  const centrifuge = useCentrifuge()
  const lastValidData = useRef<MyDataType>()

  const data$ = useMemo(() => centrifuge.myQuery(), [centrifuge])
  const query = useObservable(data$)

  // Preserve last valid data
  if (query.data) {
    lastValidData.current = query.data
  }

  return {
    ...query,
    data: query.data ?? lastValidData.current,
    isLoading: query.isLoading && !lastValidData.current,
  }
}
```

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
centrifuge.vaults(network, shareClassId)  // Vaults for a share class
centrifuge.vaultDetails(vault)            // Vault details
centrifuge.investment(vault)              // User's investment in vault
```

### Holdings & Balances

```typescript
centrifuge.holdings(shareClass)           // User's holdings
centrifuge.balances(address)              // Token balances
```

## Executing Transactions

Use `useCentrifugeTransaction` for all SDK transactions:

```typescript
import { useCentrifugeTransaction } from '@cfg'

const { execute, isPending } = useCentrifugeTransaction()

const handleDeposit = async (amount: Balance) => {
  try {
    await execute(vault.asyncDeposit(amount))
    // Success
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
- `src/cfg/types.ts` - Re-exported SDK types
- `src/cfg/index.ts` - Public exports (use `@cfg` alias)
- `src/cfg/hooks/CentrifugeContext.tsx` - SDK provider and hook

## Best Practices

1. **Create specific hooks** - Don't expose raw SDK methods to components
2. **Handle loading states** - Always check `isLoading` before rendering
3. **Use enabled option** - Prevent unnecessary queries
4. **Transform in observable** - Use `.pipe(map(...))` not post-processing in React
5. **Export from @cfg** - Add new hooks/types to `src/cfg/index.ts`

## Debug Tips

- Check console for "observable is not stable" warnings
- Use React DevTools to verify hook re-renders
- SDK polling interval is 15 seconds - data refreshes automatically
- Use `retry()` from useObservable to manually refetch
