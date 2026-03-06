# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
```bash
# Install dependencies (REQUIRED: pnpm only)
pnpm install

# Start development server (runs on port 3003)
pnpm dev

# Build for production
pnpm build          # Runs TypeScript check first, then Vite build

# Linting
pnpm lint           # Run ESLint
pnpm lint:fix       # Run ESLint with auto-fix

# Code formatting
pnpm format         # Format all .ts and .tsx files with Prettier

# Storybook
pnpm storybook      # Start Storybook dev server on port 6006
pnpm build-storybook

# Generate Chakra UI theme typings
pnpm theme:typings
```

### Package Manager
- **ONLY use pnpm** - preinstall script enforces this
- Node.js ≥ 18.0.0 required
- pnpm ≥ 8.0.0 required

## Architecture Overview

### Application Bootstrap Flow

The app uses a deeply nested provider architecture. Entry point: `src/main.tsx` → `src/Root.tsx`

**Provider Stack (Root.tsx):**
```
DebugFlags (Development debugging - must be outermost)
  → QueryClientProvider (TanStack Query - primary data caching layer)
    → CentrifugeProvider (SDK instance)
      → WalletProvider (Wagmi + Reown AppKit)
        → WalletInvalidator (Clears user-specific query cache on wallet change)
          → TransactionProvider (Transaction lifecycle)
            → PoolProvider (Pool data context)
              → LoadingProvider (Global loading boundaries)
                → <Outlet /> (React Router)
```

**IMPORTANT:** DebugFlags must wrap all other providers so that `useDebugFlags()` can be called in `RootProviders` to access debug state during provider initialization.

**NOTE:** VaultsProvider is NOT in Root.tsx - it wraps only the pool detail route in `src/routes/router.tsx`.

### Centrifuge SDK Integration

The app wraps the Centrifuge SDK's RxJS observables with **TanStack React Query**, converting observables to promises via `firstValueWithTimeout`:

```typescript
// Standard pattern in src/cfg/hooks/
const centrifuge = useCentrifuge()
return useQuery({
  queryKey: queryKeys.pools(),
  queryFn: () => firstValueWithTimeout(centrifuge.pools()),
  staleTime: 5 * 60 * 1000,
})
```

**Key utility** (`src/cfg/hooks/utils.ts`):
- `firstValueWithTimeout(observable)` - Converts RxJS observable to a Promise with 30-second timeout
- Used by all query hooks to bridge SDK observables to React Query

**Centralized Query Keys** (`src/cfg/hooks/queries/queryKeys.ts`):
- Type-safe query key factory for all data queries
- Enables selective cache invalidation after transactions

**SDK Configuration** (in Root.tsx):
- Environment: `VITE_CENTRIFUGE_ENV` (mainnet/testnet)
- Multi-chain RPC URLs for Ethereum, Base, Arbitrum, Avalanche, Celo
- `disableRepeatOnEvents: true` - Prevents duplicate event re-emissions (important for React Query's promise-based fetching)
- **BNB Chain injection**: BSC is NOT part of Centrifuge SDK by default - the app explicitly injects it using wagmi's `bsc`/`bscTestnet` exports

### Context-Driven State Management

Three main business logic contexts coordinate data flow:

1. **PoolContext** (`src/contexts/PoolContext.tsx`):
   - Pool selected from URL params (`/pool/:poolId/:network/:asset`)
   - Provides: pools list, pool details, active networks, holdings
   - URL params (`networkFromUrl`, `assetFromUrl`) drive network/asset selection
   - Network auto-selected based on connected wallet's chain ID

2. **VaultsContext** (`src/contexts/VaultsContext.tsx`):
   - Only wraps the pool detail route (not in Root.tsx)
   - Depends on PoolContext for pool/network/shareClass
   - Manages: selected vault, vaults list, vault details, investments
   - URL-based vault selection (network + asset from URL)

3. **TransactionProvider** (`src/cfg/hooks/TransactionProvider.tsx`):
   - Manages transaction lifecycle: creating → unconfirmed → pending → succeeded/failed
   - Renders `<TransactionToasts />` for notifications

### Data Fetching Patterns

**Primary Pattern: React Query wrapping SDK observables**

```typescript
// Standard pattern in src/cfg/hooks/
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

**Key characteristics:**
- SDK observables converted to promises via `firstValueWithTimeout`
- `useQuery` from TanStack React Query handles caching, retries, stale-while-revalidate
- Centralized `queryKeys` factory for type-safe cache management
- `enabled` option for conditional queries
- Standard React Query return: `{ data, isLoading, error, status, ...rest }`

**Batch Query Hooks** (`src/cfg/hooks/queries/`):
- `useAllPoolsVaultsQuery` - Batch fetch all pools, networks, and vaults with details
- `useInvestmentsPerVaultsQuery` - Batch fetch user investments across multiple vaults
- `usePoolsAccessStatusQuery` - Batch check user pool access and membership status

**QueryClient Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,  // 10 minutes
      gcTime: 600000,     // 10 minutes garbage collection
    },
  },
})
```

### Cache Invalidation

**WalletInvalidator** (in Root.tsx):
- Clears user-specific query cache when wallet address changes
- Preserves global data (pools, blockchains) that aren't wallet-dependent
- User-specific keys: `investment`, `holdings`, `investor`, `portfolio`, `isMember`, `investmentsPerVaults`, `poolsAccessStatus`

**After Transactions** (`useCentrifugeTransaction`):
- Calls `centrifuge.clearQueryCache()` to clear SDK internal cache
- Selectively invalidates React Query keys: `poolsAccessStatus`, `portfolio`, `investor`, `isMember`, `investment`, `holdings`, `investmentsPerVaults`

**Environment Switch:**
- `queryClient.clear()` clears ALL cache when switching mainnet ↔ testnet

### Wallet Integration

**Stack:** Reown AppKit + Wagmi 2 + Viem

**Configuration** (`src/wallet/WalletProvider.tsx`):
- Custom connectors: Safe.global support + injected wallets
- Featured wallets: MetaMask, Rabby, Bitget, OKX
- Features disabled: email, socials, swaps, send

**Transaction Flow** (`src/cfg/hooks/useCentrifugeTransaction.tsx`):
1. Get signer via `useConnectorClient()` from Wagmi
2. Set signer on Centrifuge SDK: `centrifuge.setSigner(client)`
3. Execute transaction observable with Promise-based subscription
4. Parallel receipt polling via `waitForTransactionReceipt` (2s interval) for faster UI updates
5. Invalidate relevant React Query caches on completion

### TypeScript Path Aliases

When importing, use these aliases (defined in tsconfig.json):

```typescript
@cfg          → src/cfg/index
@components/* → src/components/*
@contexts/*   → src/contexts/*
@forms        → src/forms/index
@hooks/*      → src/hooks/*
@layouts/*    → src/layouts/*
@pages/*      → src/pages/*
@routes/*     → src/routes/*
@ui           → src/ui/index
@utils/*      → src/utils/*
@wallet/*     → src/wallet/*
@assets/*     → src/assets/*
```

### UI Design System

**Chakra UI v3** with custom theme system at `src/ui/theme/`:
- Token-based: colors, fonts, semantic tokens
- Custom recipes: button, badge, heading, input, text
- Slot recipes: accordion, card, checkbox, pagination
- **Theme is forced to "light"** via `ColorModeProvider` - no dark mode currently active

### Routing

React Router v7 setup in `src/routes/router.tsx`:

```
/ (Root with all providers)
  ├─ MainLayout
  │  ├─ / (HomeRoute)
  │  └─ /pool/:poolId/:network/:asset (PoolRoute, wrapped in VaultsProvider)
  │  └─ /pool/:poolId → redirects to /
  └─ HashUrlHandler (legacy URL migration)
```

**Route Paths** (`src/routes/routePaths.ts`):
- `getVaultPath(poolId, network, asset)` - Generates pool detail URL with vault selection

### Environment Variables

Located in `.env-config/` directory:

```bash
VITE_CENTRIFUGE_ENV=mainnet|testnet
VITE_INDEXER_URL=https://api.centrifuge.io
VITE_REOWN_APP_ID=<app-id>
VITE_ALCHEMY_KEY=<api-key>
VITE_PINATA_GATEWAY=https://centrifuge.mypinata.cloud/
```

## Key Architectural Decisions

### React Query over RxJS Observables
Data fetching uses TanStack React Query wrapping SDK observables via `firstValueWithTimeout`. This provides industry-standard caching, retry logic, stale-while-revalidate, selective cache invalidation, and DevTools support. The SDK still uses RxJS internally but the React layer consumes promises.

### Network Synchronization
PoolContext auto-selects the network matching the connected wallet's chain ID. There is no manual network selector - it's fully automatic based on wallet connection.

### Debug Flags System

**Available Debug Flags** (`src/cfg/components/DebugFlags/config.ts`):
- `address` - Override wallet address for testing
- `persistDebugFlags` - Persist debug flags to localStorage
- `showMainnet` - Switch between mainnet and testnet data in development

**showMainnet Debug Flag Implementation:**

The `showMainnet` flag allows developers to test mainnet data in a testnet environment without deploying. Key implementation details:

1. **Dual Centrifuge SDK Setup** (Root.tsx):
   - Primary SDK instance switches between mainnet/testnet based on `showMainnet` flag
   - Two additional static SDK instances (mainnet + testnet) provide chain configs for WalletProvider
   - All networks (mainnet + testnet) are loaded into WalletProvider because AppKit cannot dynamically update networks

2. **Network Filtering** (ConnectionGuard.tsx):
   - `MAINNET_CHAIN_IDS` and `TESTNET_CHAIN_IDS` constants define which networks to show
   - ConnectionGuard filters displayed networks based on `showMainnet` flag

3. **Data Layer Switching**:
   - When `showMainnet=true`: Centrifuge SDK fetches mainnet pool data
   - When `showMainnet=false`: Centrifuge SDK fetches testnet pool data
   - `queryClient.clear()` is called when switching environments to prevent stale data

**Why This Architecture:**
- Reown AppKit cannot dynamically update its network list after initialization (it's a global singleton)
- Solution: Load all networks but filter what's displayed in the UI
- WalletProvider has all networks; ConnectionGuard shows only relevant ones

### BNB Chain Support
BSC/BNB Chain is not part of Centrifuge SDK's default networks. The app explicitly checks for and injects BNB mainnet (56) or BNB testnet (97) using wagmi's chain exports.

### URL-Driven Vault Selection
Pool detail route includes network and asset in the URL (`/pool/:poolId/:network/:asset`). VaultsProvider only wraps this route, not the entire app.

## Project Structure

### Core Directories

- **`src/cfg/`** - Centrifuge SDK integration layer: hooks, utilities, queries, and business logic for SDK types
- **`src/cfg/hooks/queries/`** - React Query hooks and centralized query keys
- **`src/contexts/`** - React contexts for Pool, Vaults, and cross-cutting concerns
- **`src/wallet/`** - Wallet connection (Wagmi, Reown AppKit) and Web3 integration
- **`src/ui/`** - Design system and UI component library (Chakra UI v3)
- **`src/forms/`** - Reusable react-hook-form components with validation utilities
- **`src/hooks/`** - Custom React hooks (non-SDK specific)
- **`src/components/`** - Application-specific components
- **`src/pages/`** - Route page components
- **`src/routes/`** - React Router configuration

### Tech Stack

- React 19 + TypeScript 5.8 + Vite 6
- Centrifuge SDK (RxJS observables wrapped with React Query)
- TanStack Query 5 (primary data caching layer)
- Wagmi 2 + Viem 2 + Reown AppKit 1.8
- Chakra UI 3 (custom theme system)
- React Router v7
- react-hook-form 7 + Zod validation
- RxJS 7 (used internally by SDK, bridged to React via `firstValueWithTimeout`)

## Development Notes

### When Adding New SDK Queries

1. Create hook in `src/cfg/hooks/` using `useQuery` from React Query
2. Add query key to `src/cfg/hooks/queries/queryKeys.ts`
3. Use `firstValueWithTimeout(centrifuge.someQuery())` as the `queryFn`
4. Set appropriate `staleTime` and `enabled` options
5. Add to relevant context (PoolContext/VaultsContext) if shared across components
6. If the query is user-specific, add its key to `USER_QUERY_KEYS` in Root.tsx for wallet-change invalidation

### When Working with Transactions

1. Use `useCentrifugeTransaction` hook for executing SDK transactions
2. Always check wallet connection via `useAccount()` first
3. Transaction flow: get signer → set on SDK → execute observable → poll receipt → invalidate caches
4. TransactionProvider automatically handles toast notifications
5. Cache invalidation happens automatically via `invalidateTransactionQueries()`

### When Adding UI Components

1. Follow Chakra UI v3 patterns (recipes and slot recipes)
2. Use semantic tokens from theme system for colors
3. Theme is forced to light mode - no dark mode support needed
4. Consider adding to Storybook for documentation
