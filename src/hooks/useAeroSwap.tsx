import { useState, useMemo, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { erc20Abi, formatUnits, parseUnits, type Address } from 'viem'
import { base } from 'viem/chains'
import { useWalletClient, useReadContract, usePublicClient } from 'wagmi'
import { chainExplorer, useAddress, formatBalance, toaster } from '@cfg'
import { getDefaultConfig, getQuoteForSwap, swap, type SugarWagmiConfig, type Token } from '@dromos-labs/sdk.js'
import { useQuery } from '@tanstack/react-query'
import usdcIcon from '../ui/assets/logos/usdc.svg'

// Docs found here:
// https://github.com/velodrome-finance/sdk.js/blob/main/packages/demo-web/src/components/Swapper.tsx

export const BASE_CHAIN_ID = base.id
const BASE_EXPLORER = chainExplorer[BASE_CHAIN_ID]
const USDC_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address
const USDC_DECIMALS = 6

export interface TokenDef {
  name: string
  symbol: string
  address: Address
  decimals: number
  icon: string
}

export const USDC_DEF: TokenDef = {
  name: 'USD Coin',
  symbol: 'USDC',
  address: USDC_BASE,
  decimals: USDC_DECIMALS,
  icon: usdcIcon,
}

export type Direction = 'buy' | 'sell'
export type SwapStep = 'idle' | 'approving' | 'approved' | 'swapping' | 'success' | 'error'

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY
const BASE_RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`

// Separate Wagmi config for the Dromos/Aerodrome SDK. This is needed because the SDK
// requires its own config with chain-specific Sugar contract addresses. We sign transactions
// manually via `unsignedTransactionOnly: true` using the app's own wallet client, so the
// SDK never needs access to the connected wallet state from the app's Wagmi provider.
let aeroConfig: SugarWagmiConfig | null = null
function getAeroConfig(): SugarWagmiConfig {
  if (!aeroConfig) {
    aeroConfig = getDefaultConfig({
      chains: [{ chain: base, rpcUrl: BASE_RPC_URL }],
    })
  }
  return aeroConfig
}

function makeToken(address: Address, symbol: string, decimals: number, name?: string): Token {
  return {
    chainId: BASE_CHAIN_ID,
    address: address.toLowerCase() as Address,
    name,
    symbol,
    listed: true,
    decimals,
    balance: 0n,
    price: 0n,
    balanceValue: 0n,
  }
}

function useErc20Balance(tokenAddress: Address, account: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    chainId: BASE_CHAIN_ID,
    query: { enabled: !!account },
  })
}

function useErc20Allowance(tokenAddress: Address, owner: Address | undefined, spender: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    chainId: BASE_CHAIN_ID,
    query: { enabled: !!owner && !!spender },
  })
}

function txHashLink(message: string, txHash?: string) {
  return (
    <>
      <p>{message}</p>
      {txHash && (
        <a href={`${BASE_EXPLORER}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          {`Hash: ${txHash}`}
        </a>
      )}
    </>
  )
}

export function useAeroSwap(poolToken: TokenDef, slippage: number) {
  const { address } = useAddress()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID })
  const [direction, setDirection] = useState<Direction>('buy')
  const [inputAmount, setInputAmount] = useState('')
  const [debouncedAmount] = useDebounce(inputAmount, 500)
  const [swapStep, setSwapStep] = useState<SwapStep>('idle')
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null)
  const [submittedSwap, setSubmittedSwap] = useState<{ fromAmount: string; toAmount: string } | null>(null)

  const isBuy = direction === 'buy'

  const usdcToken = useMemo(() => makeToken(USDC_BASE, 'USDC', USDC_DECIMALS, 'USD Coin'), [])
  const poolSdkToken = useMemo(
    () => makeToken(poolToken.address, poolToken.symbol, poolToken.decimals, poolToken.name),
    [poolToken]
  )

  const fromTokenDef = isBuy ? USDC_DEF : poolToken
  const toTokenDef = isBuy ? poolToken : USDC_DEF
  const fromSdkToken = isBuy ? usdcToken : poolSdkToken
  const toSdkToken = isBuy ? poolSdkToken : usdcToken

  // Balances
  const { data: usdcBalanceRaw, refetch: refetchUsdcBalance } = useErc20Balance(
    USDC_BASE,
    address as Address | undefined
  )
  const { data: poolTokenBalanceRaw, refetch: refetchPoolBalance } = useErc20Balance(
    poolToken.address,
    address as Address | undefined
  )

  const fromBalanceRaw = isBuy ? usdcBalanceRaw : poolTokenBalanceRaw
  const toBalanceRaw = isBuy ? poolTokenBalanceRaw : usdcBalanceRaw
  const fromBalanceFormatted = fromBalanceRaw != null ? formatUnits(fromBalanceRaw, fromTokenDef.decimals) : null
  const toBalanceFormatted = toBalanceRaw != null ? formatUnits(toBalanceRaw, toTokenDef.decimals) : null

  const amountIn = useMemo(() => {
    if (!debouncedAmount || isNaN(Number(debouncedAmount)) || Number(debouncedAmount) <= 0) return null
    try {
      return parseUnits(debouncedAmount, fromTokenDef.decimals)
    } catch {
      return null
    }
  }, [debouncedAmount, fromTokenDef.decimals])

  // Quote
  const {
    data: quote,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useQuery({
    queryKey: ['aero-quote', direction, poolToken.address, debouncedAmount],
    queryFn: async () => {
      if (!amountIn) return null
      const config = getAeroConfig()
      return getQuoteForSwap({ config, fromToken: fromSdkToken, toToken: toSdkToken, amountIn })
    },
    enabled: !!amountIn,
    staleTime: 10_000,
    refetchInterval: 10_000,
    retry: 1,
  })

  // Allowance
  const spenderAddress = quote?.spenderAddress
  const { data: allowance, refetch: refetchAllowance } = useErc20Allowance(
    fromTokenDef.address,
    address as Address | undefined,
    spenderAddress
  )

  const needsApproval = useMemo(() => {
    if (!amountIn || allowance == null) return false
    return allowance < amountIn
  }, [amountIn, allowance])

  const insufficientBalance = useMemo(() => {
    if (!amountIn || fromBalanceRaw == null) return false
    return amountIn > fromBalanceRaw
  }, [amountIn, fromBalanceRaw])

  const isPending = swapStep === 'approving' || swapStep === 'swapping'
  const canSwap = !!quote && !insufficientBalance && !isPending && !!walletClient && !!publicClient

  const refetchBalances = useCallback(() => {
    refetchUsdcBalance()
    refetchPoolBalance()
  }, [refetchUsdcBalance, refetchPoolBalance])

  const handleApproveAndSwap = useCallback(async () => {
    if (!quote || !walletClient || !address || !publicClient || !spenderAddress || !amountIn) return

    let approveToastId: string | undefined
    let swapToastId: string | undefined

    try {
      if (needsApproval) {
        setSwapStep('approving')

        approveToastId = toaster.create({
          title: 'Approve',
          description: 'Signing transaction',
          type: 'loading',
          duration: undefined,
          closable: true,
        })

        const approveHash = await walletClient.writeContract({
          address: fromTokenDef.address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spenderAddress, amountIn],
          chain: base,
        })

        toaster.update(approveToastId, {
          title: 'Approve',
          description: txHashLink('Transaction pending', approveHash),
          type: 'loading',
        })

        await publicClient.waitForTransactionReceipt({ hash: approveHash, timeout: 60_000 })
        await refetchAllowance()

        toaster.dismiss(approveToastId)
        toaster.create({
          title: 'Approve',
          description: txHashLink('Transaction succeeded', approveHash),
          type: 'success',
          duration: 10_000,
          closable: true,
        })

        setSwapStep('approved')
      }

      // Re-fetch quote after approval to avoid executing a stale quote.
      // Approval can take 30-60s+ (user signing + on-chain confirmation),
      // during which prices may have moved.
      const config = getAeroConfig()
      const freshQuote = needsApproval
        ? await getQuoteForSwap({ config, fromToken: fromSdkToken, toToken: toSdkToken, amountIn })
        : quote

      if (!freshQuote) {
        throw new Error('Failed to get an updated quote. Please try again.')
      }

      setSubmittedSwap({
        fromAmount: formatUnits(amountIn, fromTokenDef.decimals),
        toAmount: formatUnits(freshQuote.amountOut, toTokenDef.decimals),
      })
      setSwapTxHash(null)
      setSwapStep('swapping')

      swapToastId = toaster.create({
        title: 'Swap',
        description: 'Signing transaction',
        type: 'loading',
        duration: undefined,
        closable: true,
      })

      const unsignedTx = await swap({
        config,
        quote: freshQuote,
        slippage,
        unsignedTransactionOnly: true,
        account: address as Address,
      })

      const hash = await walletClient.sendTransaction({
        to: unsignedTx.to,
        data: unsignedTx.data,
        value: unsignedTx.value,
        chain: base,
      })

      setSwapTxHash(hash)

      toaster.update(swapToastId, {
        title: 'Swap',
        description: txHashLink('Transaction pending', hash),
        type: 'loading',
      })

      if (hash) {
        await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 })

        toaster.dismiss(swapToastId)
        toaster.create({
          title: 'Swap',
          description: txHashLink('Transaction succeeded', hash),
          type: 'success',
          duration: 10_000,
          closable: true,
        })

        setSwapStep('success')
        setInputAmount('')
        refetchBalances()
      }
    } catch (err) {
      if (approveToastId) toaster.dismiss(approveToastId)
      if (swapToastId) toaster.dismiss(swapToastId)

      setSwapStep('error')
      const message = err instanceof Error ? err.message : 'Transaction failed'
      const reason = message.includes('User rejected') ? 'Transaction rejected' : message

      toaster.create({
        title: 'Swap',
        description: `Transaction failed: ${reason}`,
        type: 'error',
        duration: 60_000,
        closable: true,
      })
    }
  }, [
    quote,
    walletClient,
    address,
    publicClient,
    spenderAddress,
    amountIn,
    slippage,
    needsApproval,
    fromTokenDef,
    toTokenDef,
    fromSdkToken,
    toSdkToken,
    refetchAllowance,
    refetchBalances,
  ])

  const handleFlipDirection = useCallback(() => {
    setDirection((d) => (d === 'buy' ? 'sell' : 'buy'))
    setInputAmount('')
    setSwapStep('idle')
  }, [])

  const resetOverlay = useCallback(() => {
    setSwapStep('idle')
    setSubmittedSwap(null)
    setSwapTxHash(null)
  }, [])

  const formattedOutput = quote ? formatUnits(quote.amountOut, toTokenDef.decimals) : ''
  const rate =
    quote && amountIn
      ? formatBalance(
          Number(formatUnits(quote.amountOut, toTokenDef.decimals)) /
            Number(formatUnits(amountIn, fromTokenDef.decimals)),
          { precision: 4 }
        )
      : null

  const minReceived = quote
    ? formatBalance(Number(formatUnits(quote.amountOut, toTokenDef.decimals)) * (1 - slippage), { precision: 6 })
    : null

  // Dromos SDK returns priceImpact in basis points (e.g. 150 = 1.5%)
  const priceImpact = quote ? Number(quote.priceImpact) / 100 : null

  const tokenPrice =
    quote && amountIn
      ? isBuy
        ? 1 / (Number(formatUnits(quote.amountOut, poolToken.decimals)) / Number(formatUnits(amountIn, USDC_DECIMALS)))
        : Number(formatUnits(quote.amountOut, USDC_DECIMALS)) / Number(formatUnits(amountIn, poolToken.decimals))
      : null

  const buttonLabel = insufficientBalance
    ? 'Insufficient Balance'
    : swapStep === 'approving'
      ? 'Approving...'
      : swapStep === 'swapping'
        ? 'Swapping...'
        : needsApproval
          ? 'Approve & Swap'
          : 'Swap'

  return {
    // State
    direction,
    isBuy,
    inputAmount,
    setInputAmount,
    swapStep,
    setSwapStep,
    swapTxHash,
    submittedSwap,

    // Token info
    fromTokenDef,
    toTokenDef,
    poolToken,

    // Balances
    fromBalanceFormatted,
    toBalanceFormatted,

    // Quote
    quote,
    isQuoteLoading,
    quoteError,
    amountIn,
    formattedOutput,
    rate,
    minReceived,
    priceImpact,
    tokenPrice,

    // Validation
    needsApproval,
    insufficientBalance,
    isPending,
    canSwap,
    buttonLabel,

    // Actions
    handleApproveAndSwap,
    handleFlipDirection,
    resetOverlay,
  }
}
