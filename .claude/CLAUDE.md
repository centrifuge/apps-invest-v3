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
  → QueryClientProvider (TanStack Query)
    → CentrifugeProvider (SDK instance)
      → WalletProvider (Wagmi + Reown AppKit)
        → TransactionProvider (Transaction lifecycle)
          → PoolProvider (Pool data context)
            → VaultsProvider (Vaults data context)
              → LoadingProvider (Global loading boundaries)
                → <Outlet /> (React Router)
```

**IMPORTANT:** DebugFlags must wrap all other providers so that `useDebugFlags()` can be called in `RootProviders` to access debug state during provider initialization.

### Centrifuge SDK Integration

The app wraps the Centrifuge SDK's RxJS observables with React hooks using a custom `useObservable` pattern:

- **`useObservable`** (`src/cfg/hooks/useObservable.ts`): Converts RxJS observables to React state using `useSyncExternalStore`
- Features caching via WeakMap to prevent unnecessary re-subscriptions
- All data fetching in `src/cfg/hooks/*` follows this pattern

**SDK Configuration** (in Root.tsx):
- Environment: `VITE_CENTRIFUGE_ENV` (mainnet/testnet)
- Multi-chain RPC URLs for Ethereum, Base, Arbitrum, Avalanche, Celo
- Polling interval: 15000ms
- **BNB Chain injection**: BSC is NOT part of Centrifuge SDK by default - the app explicitly injects it using wagmi's `bsc`/`bscTestnet` exports

### Context-Driven State Management

Three main business logic contexts coordinate data flow:

1. **PoolContext** (`src/contexts/PoolContext.tsx`):
   - Manages selected pool (from URL params: `/pool/:poolId`)
   - Provides: pools list, pool details, active networks, holdings
   - Network auto-selected based on connected chain ID

2. **VaultsContext** (`src/contexts/VaultsContext.tsx`):
   - Depends on PoolContext for pool/network/shareClass
   - Manages: selected vault, vaults list, vault details, investments
   - Auto-selects first available vault

3. **TransactionProvider** (`src/cfg/hooks/TransactionProvider.tsx`):
   - Manages transaction lifecycle: creating → unconfirmed → pending → succeeded/failed
   - Renders `<TransactionToasts />` for notifications

### Data Fetching Patterns

**Primary Pattern: Observable-based queries via Centrifuge SDK**

```typescript
// Standard pattern in src/cfg/hooks/
const centrifuge = useCentrifuge()
const data$ = useMemo(() => centrifuge.someQuery(), [centrifuge])
return useObservable(data$)  // Returns { data, error, status, isLoading, ... }
```

**Key characteristics:**
- Observables created via `useMemo` for stability
- `enabled` option for conditional queries
- `combineLatest` for multiple observables
- `switchMap` for chained observables

**Special wrapper: `usePoolsQuery`**
- Handles RxJS subscription cycles that temporarily emit undefined
- Stores last valid data in `useRef` to prevent UI flickering
- Only shows `isLoading` when initially loading (not on updates)

### Wallet Integration

**Stack:** Reown AppKit + Wagmi 2 + Viem

**Configuration** (`src/wallet/WalletProvider.tsx`):
- Custom connectors: Safe.global support + injected wallets
- Featured wallets: MetaMask, Rabby, Bitget, OKX
- Features disabled: email, socials, swaps, send

**Transaction Flow** (`src/cfg/hooks/useCentrifugeTransaction.tsx`):
1. Get signer via `useConnectorClient()` from Wagmi
2. Set signer on Centrifuge SDK: `centrifuge.setSigner(client)`
3. Execute transaction observable with RxJS `tap` to capture state updates
4. Update TransactionProvider context with lifecycle events

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
  │  └─ /pool/:poolId (PoolRoute)
  └─ HashUrlHandler (legacy URL migration)
```

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

### Observable Subscription Cycles
The Centrifuge SDK uses RxJS observables that may temporarily emit `undefined` during re-subscription. Use `usePoolsQuery` wrapper or store last valid data in `useRef` to prevent UI flickering.

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

2. **Network Filtering** (NetworkButton.tsx):
   - `MAINNET_CHAIN_IDS` and `TESTNET_CHAIN_IDS` constants define which networks to show
   - NetworkButton filters displayed networks based on `showMainnet` flag
   - Users only see relevant networks in the UI, but all networks remain available to AppKit

3. **Data Layer Switching**:
   - When `showMainnet=true`: Centrifuge SDK fetches mainnet pool data, NetworkButton shows only mainnet chains
   - When `showMainnet=false`: Centrifuge SDK fetches testnet pool data, NetworkButton shows only testnet chains
   - Pool queries, vault queries, and all SDK data automatically update when flag changes

**Why This Architecture:**
- Reown AppKit cannot dynamically update its network list after initialization (it's a global singleton)
- Solution: Load all networks but filter what's displayed in the UI
- WalletProvider has all networks; NetworkButton and ConnectionGuard show only relevant ones

### BNB Chain Support
BSC/BNB Chain is not part of Centrifuge SDK's default networks. The app explicitly checks for and injects BNB mainnet (56) or BNB testnet (97) using wagmi's chain exports.

### TanStack Query Usage
QueryClient is configured but minimally used. Primary data fetching uses Centrifuge SDK observables wrapped with `useObservable`. TanStack Query may be reserved for future non-Centrifuge data sources.

## Project Structure

### Core Directories

- **`src/cfg/`** - Centrifuge SDK integration layer: hooks, utilities, queries, and business logic for SDK types
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
- Centrifuge SDK 0.17.0 (RxJS observables)
- Wagmi 2 + Viem 2 + Reown AppKit 1.8
- Chakra UI 3 (custom theme system)
- React Router v7
- TanStack Query 5 (minimal usage)
- react-hook-form 7 + Zod validation
- RxJS 7 for reactive programming

## Development Notes

### When Adding New SDK Queries

1. Create hook in `src/cfg/hooks/` following the observable pattern
2. Use `useMemo` to create stable observable references
3. Wrap with `useObservable` for React state management
4. Consider using `usePoolsQuery` pattern if subscription cycles are problematic
5. Add to relevant context (PoolContext/VaultsContext) if shared across components

### When Working with Transactions

1. Use `useCentrifugeTransaction` hook for executing SDK transactions
2. Always check wallet connection via `useAccount()` first
3. Transaction flow: get signer → set on SDK → execute observable → update provider
4. TransactionProvider automatically handles toast notifications

### When Adding UI Components

1. Follow Chakra UI v3 patterns (recipes and slot recipes)
2. Use semantic tokens from theme system for colors
3. Theme is forced to light mode - no dark mode support needed
4. Consider adding to Storybook for documentation
