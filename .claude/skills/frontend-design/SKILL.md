---
name: frontend-design
description: Provides guidance on frontend design decisions, component patterns, and UI best practices for this project. Use when designing new components, reviewing UI patterns, making styling decisions, or implementing Chakra UI v3 components.
user-invokable: true
disable-model-invocation: false
---

# Frontend Design Guidelines

Use this skill when making frontend design decisions, creating new UI components, or reviewing existing component patterns.

## Design System: Chakra UI v3

This project uses Chakra UI v3 with a custom theme system.

### Theme Structure
- **Theme location**: `src/ui/theme/`
- **Token-based design**: colors, fonts, semantic tokens
- **Custom recipes**: button, badge, heading, input, text
- **Slot recipes**: accordion, card, checkbox, pagination
- **Theme mode**: Forced to "light" via `ColorModeProvider` - no dark mode currently active

### When Creating Components

1. **Check existing patterns first** - Review `src/components/` for similar components
2. **Use semantic tokens** - Reference colors from theme system, not hardcoded values
3. **Follow recipe patterns** - Use existing button, badge, heading, input, text recipes
4. **Responsive design** - Use Chakra's responsive array/object syntax

## Component Architecture

### File Organization
- **UI primitives**: `src/ui/` - Design system and reusable UI components
- **App components**: `src/components/` - Application-specific components
- **Form components**: `src/forms/` - Reusable react-hook-form components with validation

### Import Aliases
Always use TypeScript path aliases:
```typescript
@ui           → src/ui/index
@components/* → src/components/*
@contexts/*   → src/contexts/*
@forms        → src/forms/index
@hooks/*      → src/hooks/*
@assets/*     → src/assets/*
```

### Component Patterns

**Standard component structure:**
```typescript
import { Box, Text } from '@chakra-ui/react'
import type { FC } from 'react'

interface MyComponentProps {
  // Props interface
}

export const MyComponent: FC<MyComponentProps> = ({ ...props }) => {
  return (
    // JSX
  )
}
```

## Context Integration

Components often need to integrate with these contexts:

1. **PoolContext** - Pool selection, networks, holdings
2. **VaultsContext** - Vault data, investments (depends on PoolContext)
3. **TransactionProvider** - Transaction lifecycle management

## Wallet & Web3 Considerations

- **Stack**: Reown AppKit + Wagmi 2 + Viem
- **Connection state**: Use `useAccount()` from Wagmi
- **Featured wallets**: MetaMask, Rabby, Bitget, OKX
- **Safe.global**: Custom connector support included

## Design Decision Workflow

1. **Explore existing patterns** - Check `src/components/` and `src/ui/` for similar implementations
2. **Review theme tokens** - Reference `src/ui/theme/` for colors, spacing, typography
3. **Consider data flow** - Identify which contexts/hooks the component needs
4. **Check wallet integration** - If Web3 related, review `src/wallet/` patterns
5. **Follow minimalism** - Keep solutions simple, avoid over-engineering

## Best Practices

- **Avoid over-engineering** - Only add features that are directly requested
- **No extra abstractions** - Don't create utilities for one-time operations
- **Theme compliance** - Use semantic tokens, not hardcoded colors
- **TypeScript strict** - Define proper interfaces for all props
- **Accessibility** - Consider keyboard navigation and screen readers
- **No emojis** - Unless explicitly requested by the user

## Storybook

Components can be documented in Storybook:
- Run: `pnpm storybook` (port 6006)
- Add stories alongside components when useful for documentation
