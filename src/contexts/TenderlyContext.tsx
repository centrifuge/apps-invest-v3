import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react'
import { sepolia } from 'viem/chains'
import { TenderlyFork, type TenderlyConfig } from '../utils/tenderly'

export type TransactionMode = 'sepolia' | 'tenderly'

interface TenderlyContextType {
  tenderlyFork?: TenderlyFork
  isEnabled: boolean
  isInitialized: boolean
  isLoading: boolean
  error?: string
  transactionMode: TransactionMode
  setTransactionMode: (mode: TransactionMode) => void
  enable: () => Promise<void>
  disable: () => Promise<void>
  impersonateAccount: (address: `0x${string}`) => void
  fundAccountEth: (address: string, amount: bigint) => Promise<void>
  fundAccountERC20: (address: string, amount: bigint, tokenAddress?: string) => Promise<void>
  getRpcUrl: () => string | undefined
  isTransactionModeAvailable: boolean
}

const TenderlyContext = createContext<TenderlyContextType | null>(null)

export interface TenderlyProviderProps {
  children: ReactNode
  config?: TenderlyConfig
}

const DEFAULT_CONFIG: TenderlyConfig = {
  projectSlug: import.meta.env.VITE_TENDERLY_PROJECT_SLUG || '',
  accountSlug: import.meta.env.VITE_TENDERLY_ACCOUNT_SLUG || '',
  accessKey: import.meta.env.VITE_TENDERLY_ACCESS_KEY || '',
  enableLocalFork: import.meta.env.VITE_TENDERLY_LOCAL === 'true',
}

// Test addresses for development
const TEST_ADDRESSES = {
  // Well-known test addresses with likely existing balances on testnet
  POOL_MANAGER: '0x742d35Cc6635C0532925a3b8D0C9FDf3d9CAF3c3' as const,
  FUND_MANAGER: '0x742d35Cc6635C0532925a3b8D0C9FDf3d9CAF3c3' as const,
  INVESTOR_A: '0x8ba1f109551bD432803012645Hac136c123456789' as const,
  INVESTOR_B: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' as const,
}

export function TenderlyProvider({ children, config = DEFAULT_CONFIG }: TenderlyProviderProps) {
  const [tenderlyFork, setTenderlyFork] = useState<TenderlyFork | undefined>()
  const [isEnabled, setIsEnabled] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [transactionMode, setTransactionMode] = useState<TransactionMode>('sepolia')

  // Check if transaction mode switching is available (only in testnet + localhost)
  const isTransactionModeAvailable = import.meta.env.VITE_CENTRIFUGE_ENV === 'testnet' && 
                                     import.meta.env.DEV === true

  // Initialize Tenderly fork when transaction mode is set to 'tenderly'
  useEffect(() => {
    if (transactionMode === 'tenderly' && !isEnabled && isTransactionModeAvailable) {
      enable()
    } else if (transactionMode === 'sepolia' && isEnabled) {
      disable()
    }
  }, [transactionMode, isEnabled, isTransactionModeAvailable])

  const enable = useCallback(async () => {
    if (isEnabled || isLoading) return
    
    setIsLoading(true)
    setError(undefined)
    
    try {
      console.log('🔧 Initializing Tenderly fork...')
      
      // Validate config
      if (!config.accessKey || !config.accountSlug || !config.projectSlug) {
        throw new Error('Missing Tenderly configuration. Please set VITE_TENDERLY_ACCESS_KEY, VITE_TENDERLY_ACCOUNT_SLUG, and VITE_TENDERLY_PROJECT_SLUG environment variables.')
      }
      
      // Create Tenderly fork
      const fork = await TenderlyFork.create(sepolia, config)
      
      // Set up some test accounts with funds for easier testing
      console.log('💰 Setting up test accounts...')
      await Promise.all([
        fork.fundAccountEth(TEST_ADDRESSES.POOL_MANAGER, 10n ** 18n), // 1 ETH
        fork.fundAccountEth(TEST_ADDRESSES.FUND_MANAGER, 5n ** 18n),  // 0.5 ETH
        fork.fundAccountEth(TEST_ADDRESSES.INVESTOR_A, 2n ** 18n),    // 0.2 ETH
        fork.fundAccountEth(TEST_ADDRESSES.INVESTOR_B, 2n ** 18n),    // 0.2 ETH
        
        // Fund with test USDC (100,000 tokens with 6 decimals)
        fork.fundAccountERC20(TEST_ADDRESSES.POOL_MANAGER, 100000n * 10n ** 6n),
        fork.fundAccountERC20(TEST_ADDRESSES.FUND_MANAGER, 50000n * 10n ** 6n),
        fork.fundAccountERC20(TEST_ADDRESSES.INVESTOR_A, 10000n * 10n ** 6n),
        fork.fundAccountERC20(TEST_ADDRESSES.INVESTOR_B, 10000n * 10n ** 6n),
      ])
      
      setTenderlyFork(fork)
      setIsEnabled(true)
      setIsInitialized(true)
      
      // Persist enabled state
      localStorage.setItem('tenderly-enabled', 'true')
      
      console.log('✅ Tenderly fork initialized successfully!')
      console.log('📖 Available test accounts:', TEST_ADDRESSES)
      console.log('🌐 Fork RPC URL:', fork.rpcUrl)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('❌ Failed to initialize Tenderly fork:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled, isLoading, config])

  const disable = useCallback(async () => {
    if (!isEnabled) return
    
    setIsLoading(true)
    
    try {
      if (tenderlyFork) {
        await tenderlyFork.cleanup()
      }
      setTenderlyFork(undefined)
      setIsEnabled(false)
      setIsInitialized(false)
      
      // Remove persisted state
      localStorage.removeItem('tenderly-enabled')
      
      console.log('🔌 Tenderly fork disabled')
    } catch (err) {
      console.error('❌ Error disabling Tenderly fork:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled, tenderlyFork])

  const impersonateAccount = useCallback((address: `0x${string}`) => {
    if (tenderlyFork) {
      tenderlyFork.impersonateAddress = address
      console.log('👤 Impersonating account:', address)
    }
  }, [tenderlyFork])

  const fundAccountEth = useCallback(async (address: string, amount: bigint) => {
    if (tenderlyFork) {
      await tenderlyFork.fundAccountEth(address, amount)
    }
  }, [tenderlyFork])

  const fundAccountERC20 = useCallback(async (address: string, amount: bigint, tokenAddress?: string) => {
    if (tenderlyFork) {
      await tenderlyFork.fundAccountERC20(address, amount, tokenAddress)
    }
  }, [tenderlyFork])

  const getRpcUrl = useCallback(() => {
    return tenderlyFork?.rpcUrl
  }, [tenderlyFork])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tenderlyFork) {
        // Don't await in cleanup
        tenderlyFork.cleanup().catch(console.error)
      }
    }
  }, [tenderlyFork])

  const value: TenderlyContextType = {
    tenderlyFork,
    isEnabled,
    isInitialized,
    isLoading,
    error,
    transactionMode,
    setTransactionMode,
    enable,
    disable,
    impersonateAccount,
    fundAccountEth,
    fundAccountERC20,
    getRpcUrl,
    isTransactionModeAvailable,
  }

  return <TenderlyContext.Provider value={value}>{children}</TenderlyContext.Provider>
}

export function useTenderly(): TenderlyContextType {
  const context = useContext(TenderlyContext)
  if (!context) {
    throw new Error('useTenderly must be used within a TenderlyProvider')
  }
  return context
}

export { TEST_ADDRESSES }