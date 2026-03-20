 # TODOS
       3 ## AeroSwapWidget: Extract into smaller components
       4 **What:** Split `SwapForm` (~870 lines) into `TransactionOverlay`, `SlippageSelector`,
         and `useAeroSwap` hook.
       5 **Why:** Single-function component with 9 useState hooks is approaching maintainability
          limits. Extracting logic into a hook makes it testable in isolation.
       6 **Pros:** Better separation of concerns, testable business logic, easier to modify UI w
         ithout touching transaction logic.
       7 **Cons:** Premature while `@dromos-labs/sdk.js` is at `0.3.0-alpha.3` — API may change
         and refactoring twice is waste.
       8 **Context:** Eng review Issue 6 (2026-03-20). File: `src/components/elements/AeroSwapWi
         dget.tsx`.
       9 **Depends on:** `@dromos-labs/sdk.js` reaching stable release (>=1.0.0).
      10
      11 ## Component test infrastructure
      12 **What:** Set up vitest + @testing-library/react for component tests. Start with AeroSw
         apWidget covering: direction toggle, approval flow, balance validation, slippage states
         , overlay transitions.
      13 **Why:** The swap widget handles real token approvals and swaps with 9 distinct codepat
         hs and zero automated test coverage. Financial operations should not rely solely on man
         ual QA.
      14 **Pros:** Catch regressions in approval amounts (was maxUint256, now exact amount), sta
         te machine transitions, edge cases like stale quotes.
      15 **Cons:** One-time setup cost for test infrastructure. Need to mock wagmi hooks and Aer
         o SDK.
      16 **Context:** Eng review Issue 9 (2026-03-20). Codebase has zero component tests current
         ly.
      17 **Depends on:** Nothing — can be done anytime.