# Centrifuge Investment App V3

A modern Web3 dApp for the Centrifuge Investment application built with React, TypeScript, and Vite. It is a public application for investing in decentralized finance (DeFi) investment pools.

## 📁 Project Structure

### Src folders

- **`cfg`** - Core hooks, utilities, and business logic for SDK queries and CFG types
- **`contexts`** - [React contexts](https://react.dev/learn/passing-data-deeply-with-context) used for passing data within the app
- **`forms`** - Reusable custom react-hook-form components and validation utilities
- **`hooks`** - Custom [React hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- **`ui`** - Design system and UI component library built with Chakra UI
- **`wallet`** - Wallet connection and Web3 integration utilities

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.0.0

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the application
pnpm dev
```

### Application URL

| Application | URL                   | Description            |
| ----------- | --------------------- | ---------------------- |
| Invest App  | http://localhost:3003 | Investment Application |

## 🛠️ Available Scripts

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `pnpm dev`      | Start the application in development mode    |
| `pnpm lint`     | Run ESLint on all applications               |
| `pnpm lint:fix` | Run ESLint with auto-fix on all applications |
| `pnpm format`   | Run prettier formatter on project src files  |

## 🏗️ Technology Stack

### Frontend

- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Chakra UI 3** - Component library
- **TanStack Query 5** - Data fetching and caching
- **Recharts** - Data visualization

### Web3 & DeFi

- **Centrifuge SDK** - Core blockchain integration
- **Wagmi 2** - React hooks for Web3
- **Viem** - TypeScript Ethereum library
- **Reown AppKit** - Wallet connection

### Development Tools

- **ESLint 9** - Code linting
- **Prettier 3** - Code formatting
- **TypeScript** - Static type checking

## 📦 Package Manager

This project uses [pnpm](https://pnpm.io/) for efficient dependency management and build optimization. The `preinstall` script ensures only pnpm is used for consistency.

## 🔧 Development Guidelines

### Adding Dependencies

```bash
# Add to workspace root
pnpm add <package>
# Add dev dependency
pnpm add -D <dev-dependency>
```

### Code Quality

- ESLint configuration
- TypeScript strict mode is enabled
- Prettier formatting is enforced

## 🚦 Port Configuration

Default ports are configured but will automatically use the next available port if occupied:

- **Invest App**: 3003

## 🚀 Deployment

This project is configured for deployment to Cloudflare Pages using Wrangler. The application supports multiple environments for different stages of development and release.
