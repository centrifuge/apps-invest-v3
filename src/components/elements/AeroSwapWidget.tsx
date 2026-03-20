import { useState, useMemo, useCallback } from 'react'
import { base } from 'viem/chains'
import { erc20Abi, formatUnits, parseUnits, type Address } from 'viem'
import { useWalletClient, useReadContract, usePublicClient } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  getDefaultConfig,
  getQuoteForSwap,
  swap,
  type SugarWagmiConfig,
  type Token,
} from '@dromos-labs/sdk.js'
import { Box, Flex, Heading, Image, Spinner, Stack, Text } from '@chakra-ui/react'
import { Button } from '@ui'
import { useAddress, formatBalance } from '@cfg'
import { ConnectionGuard } from '@components/elements/ConnectionGuard'
import { StepIndicator } from '@components/elements/StepIndicator'
import { toaster } from '../../cfg/components/TransactionToasts/TransactionToaster'
import { chainExplorer } from '../../cfg/utils/chainExplorer'
import { Input } from '@chakra-ui/react'
import usdcIcon from '../../ui/assets/logos/usdc.svg'
import centrifugeIcon from '../../assets/logos/centrifuge-logo-lg.svg'
import aerodromeLogo from '../../assets/logos/aerodrome-logo.svg'
import { ipfsToHttp } from '../../cfg/utils/formatting'

const BASE_CHAIN_ID = base.id
const BASE_EXPLORER = chainExplorer[BASE_CHAIN_ID]
const USDC_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address
const DESPXA_BASE = '0x9c5C365e764829876243d0b289733B9D2b729685' as Address
const DEJAA_BASE = '0xaaa0008c8cf3a7dca931adaf04336a5d808c82cc' as Address
const USDC_DECIMALS = 6

interface TokenDef {
  name: string
  symbol: string
  address: Address
  decimals: number
  icon: string
}

const USDC_DEF: TokenDef = { name: 'USD Coin', symbol: 'USDC', address: USDC_BASE, decimals: USDC_DECIMALS, icon: usdcIcon }

const POOL_TOKENS: Record<string, TokenDef> = {
  '281474976710659': { name: 'deJAAA', symbol: 'deJAAA', address: DEJAA_BASE, decimals: 18, icon: centrifugeIcon },
  '281474976710668': { name: 'deSPXA Token', symbol: 'deSPXA', address: DESPXA_BASE, decimals: 18, icon: centrifugeIcon },
}
const DEFAULT_SLIPPAGE = 0.01
const SLIPPAGE_PRESETS = [0.005, 0.01, 0.05] // 0.5%, 1%, 5%

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY
const BASE_RPC_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`

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

type Direction = 'buy' | 'sell'

export function AeroSwapWidget({ poolId, poolIconUri }: { poolId: string; poolIconUri?: string }) {
  const poolTokenBase = POOL_TOKENS[poolId]
  const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY || ''
  const resolvedIcon = poolIconUri ? ipfsToHttp(poolIconUri, pinataGateway) : centrifugeIcon
  const poolToken = poolTokenBase ? { ...poolTokenBase, icon: resolvedIcon } : undefined

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border.solid"
      borderRadius="10px"
      shadow="xs"
      bg="white"
      overflow="hidden"
    >
      <Box p={4} borderBottom="1px solid" borderColor="border.solid">
        <Heading size="md">Acquire Tokens</Heading>
        <Text fontSize="sm" color="fg.muted" mt={1}>
          Acquire pool tokens on the secondary market.
        </Text>
      </Box>
      <Box p={4}>
        <ConnectionGuard chainId={BASE_CHAIN_ID}>
          {poolToken ? (
            <SwapForm poolToken={poolToken} />
          ) : (
            <Text color="fg.muted">No supported token for this pool.</Text>
          )}
        </ConnectionGuard>
      </Box>
    </Flex>
  )
}

type SwapStep = 'idle' | 'approving' | 'approved' | 'swapping' | 'success' | 'error'

function SwapForm({
  poolToken,
}: {
  poolToken: TokenDef
}) {
  const { address } = useAddress()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient({ chainId: BASE_CHAIN_ID })
  const [direction, setDirection] = useState<Direction>('buy')
  const [inputAmount, setInputAmount] = useState('')
  const [debouncedAmount] = useDebounce(inputAmount, 500)
  const [swapStep, setSwapStep] = useState<SwapStep>('idle')
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null)
  const [submittedSwap, setSubmittedSwap] = useState<{ fromAmount: string; toAmount: string } | null>(null)
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE)
  const [customSlippage, setCustomSlippage] = useState('')
  const [showSlippage, setShowSlippage] = useState(false)

  const isBuy = direction === 'buy'

  // Token definitions
  const usdcToken = useMemo(() => makeToken(USDC_BASE, 'USDC', USDC_DECIMALS, 'USD Coin'), [])
  const poolSdkToken = useMemo(
    () => makeToken(poolToken.address, poolToken.symbol, poolToken.decimals, poolToken.name),
    [poolToken]
  )

  // Direction-dependent tokens
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

  // Allowance — check the "from" token against the Universal Router
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
  const canSwap = !!quote && !insufficientBalance && !isPending && !!walletClient

  const refetchBalances = useCallback(() => {
    refetchUsdcBalance()
    refetchPoolBalance()
  }, [refetchUsdcBalance, refetchPoolBalance])

  const handleApproveAndSwap = useCallback(async () => {
    if (!quote || !walletClient || !address || !publicClient || !spenderAddress || !amountIn) return

    let approveToastId: string | undefined
    let swapToastId: string | undefined

    try {
      // Step 1: Approve if needed
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

      // Step 2: Swap
      setSubmittedSwap({
        fromAmount: formatUnits(amountIn, fromTokenDef.decimals),
        toAmount: formatUnits(quote.amountOut, toTokenDef.decimals),
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

      const config = getAeroConfig()
      const unsignedTx = await swap({
        config,
        quote,
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
      // Dismiss any pending toasts
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
    refetchAllowance,
    refetchBalances,
  ])

  const handleFlipDirection = useCallback(() => {
    setDirection((d) => (d === 'buy' ? 'sell' : 'buy'))
    setInputAmount('')
    setSwapStep('idle')
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

  // Swap details derived from quote
  const minReceived = quote
    ? formatBalance(
        Number(formatUnits(quote.amountOut, toTokenDef.decimals)) * (1 - slippage),
        { precision: 6 }
      )
    : null
  const priceImpact = quote
    ? Number(quote.priceImpact) / 100
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

  // Transaction status overlay
  const showOverlay = swapStep === 'swapping' || swapStep === 'success' || swapStep === 'error'

  if (showOverlay && submittedSwap) {
    return (
      <Flex direction="column" align="center" justify="center" minH="300px" gap={4} py={8}>
        {swapStep === 'swapping' && (
          <>
            <Spinner size="xl" color="yellow.500" borderWidth="3px" />
            <Heading size="md">Processing transaction</Heading>
          </>
        )}
        {swapStep === 'success' && (
          <>
            <Flex
              align="center"
              justify="center"
              w="64px"
              h="64px"
              borderRadius="full"
              border="3px solid"
              borderColor="green.400"
            >
              <Text fontSize="2xl" color="green.400">
                &#10003;
              </Text>
            </Flex>
            <Heading size="md">Transaction successful</Heading>
          </>
        )}
        {swapStep === 'error' && (
          <>
            <Flex
              align="center"
              justify="center"
              w="64px"
              h="64px"
              borderRadius="full"
              border="3px solid"
              borderColor="red.400"
            >
              <Text fontSize="2xl" color="red.400">
                &#10007;
              </Text>
            </Flex>
            <Heading size="md">Transaction failed</Heading>
          </>
        )}

        {/* Swap amounts */}
        <Flex align="center" gap={2}>
          <Image src={fromTokenDef.icon} boxSize="20px" borderRadius="full" />
          <Text fontSize="sm" fontWeight="medium">
            {formatBalance(submittedSwap.fromAmount, { precision: fromTokenDef.decimals === 6 ? 2 : 6 })}
          </Text>
          <Text color="fg.muted">&#8594;</Text>
          <Image src={toTokenDef.icon} boxSize="20px" borderRadius="full" />
          <Text fontSize="sm" fontWeight="medium">
            {formatBalance(submittedSwap.toAmount, { precision: toTokenDef.decimals === 6 ? 2 : 6 })}
          </Text>
        </Flex>

        {swapStep === 'swapping' && (
          <Text fontSize="sm" color="fg.muted">
            Waiting for the transaction to be mined
          </Text>
        )}

        <Stack gap={2} width="100%" mt={4}>
          {swapTxHash && (
            <Flex justify="flex-end">
              <a
                href={`${BASE_EXPLORER}/tx/${swapTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '14px', color: '#B8860B' }}
              >
                View transaction &#8599;
              </a>
            </Flex>
          )}
          <Button
            label={swapStep === 'error' ? 'Try again' : 'Close'}
            colorPalette="yellow"
            borderRadius="3xl"
            width="100%"
            onClick={() => {
              setSwapStep('idle')
              setSubmittedSwap(null)
              setSwapTxHash(null)
            }}
          />
        </Stack>

        {/* Powered by */}
        <Flex justify="center" align="center" gap={1.5} pt={1}>
          <Text fontSize="xs" color="fg.muted">
            Powered by
          </Text>
          <Image src={aerodromeLogo} height="16px" alt="Aerodrome" />
        </Flex>
      </Flex>
    )
  }

  return (
    <Stack gap={4}>
      {/* From section */}
      <Box>
        <Flex justify="space-between" mb={1}>
          <Text fontSize="sm" fontWeight="medium">
            From
          </Text>
          <Text fontSize="xs" color="fg.muted">
            Balance:{' '}
            {fromBalanceFormatted != null
              ? formatBalance(fromBalanceFormatted, {
                  precision: isBuy ? 2 : 4,
                  currency: fromTokenDef.symbol,
                })
              : '—'}
          </Text>
        </Flex>
        <Flex
          align="center"
          border="1px solid"
          borderColor="border.solid"
          borderRadius="lg"
          px={3}
          py={2}
          gap={2}
        >
          <Input
            flex={1}
            variant="flushed"
            placeholder="0.00"
            value={inputAmount}
            onChange={(e) => {
              const val = e.target.value
              if (val === '' || /^\d*\.?\d*$/.test(val)) {
                setSwapStep('idle')
                setInputAmount(val)
              }
            }}
            type="text"
            inputMode="decimal"
            fontSize="lg"
            border="none"
            _focus={{ boxShadow: 'none' }}
          />
          <Flex align="center" gap={1.5} flexShrink={0}>
            <Image src={fromTokenDef.icon} boxSize="20px" borderRadius="full" />
            <Text fontWeight="bold" fontSize="sm" whiteSpace="nowrap">
              {fromTokenDef.symbol}
            </Text>
          </Flex>
        </Flex>
        {fromBalanceFormatted != null && Number(fromBalanceFormatted) > 0 && (
          <Flex gap={1} mt={1}>
            {[0.25, 0.5, 1].map((pct) => (
              <Button
                key={pct}
                label={pct === 1 ? 'Max' : `${pct * 100}%`}
                size="xs"
                variant="outline"
                onClick={() => {
                  const val = Number(fromBalanceFormatted) * pct
                  setInputAmount(val.toFixed(fromTokenDef.decimals))
                  setSwapStep('idle')
                }}
              />
            ))}
          </Flex>
        )}
      </Box>

      {/* Flip direction arrow */}
      <Flex justify="center">
        <Box
          as="button"
          onClick={handleFlipDirection}
          border="1px solid"
          borderColor="border.solid"
          borderRadius="full"
          p={2}
          bg="white"
          cursor="pointer"
          _hover={{ bg: 'gray.50' }}
          transition="transform 0.2s"
          transform={isBuy ? 'rotate(0deg)' : 'rotate(180deg)'}
        >
          <Text fontSize="lg" lineHeight={1}>
            ↓
          </Text>
        </Box>
      </Flex>

      {/* To section */}
      <Box>
        <Flex justify="space-between" mb={1}>
          <Text fontSize="sm" fontWeight="medium">
            To
          </Text>
          <Text fontSize="xs" color="fg.muted">
            Balance:{' '}
            {toBalanceFormatted != null
              ? formatBalance(toBalanceFormatted, {
                  precision: isBuy ? 4 : 2,
                  currency: toTokenDef.symbol,
                })
              : '—'}
          </Text>
        </Flex>
        <Flex
          align="center"
          border="1px solid"
          borderColor="border.solid"
          borderRadius="lg"
          px={3}
          py={2}
          gap={2}
          bg="gray.50"
        >
          <Text flex={1} fontSize="lg" color={formattedOutput ? 'fg' : 'fg.muted'}>
            {isQuoteLoading ? (
              <Spinner size="sm" />
            ) : formattedOutput ? (
              formatBalance(formattedOutput, { precision: isBuy ? 4 : 2 })
            ) : (
              '0.00'
            )}
          </Text>
          <Flex align="center" gap={1.5} flexShrink={0}>
            <Image src={toTokenDef.icon} boxSize="20px" borderRadius="full" />
            <Text fontWeight="bold" fontSize="sm" whiteSpace="nowrap">
              {toTokenDef.symbol}
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Rate display */}
      {rate && (
        <Flex align="center" justify="center" gap={2} py={1}>
          <Flex align="center" gap={1}>
            <Image src={fromTokenDef.icon} boxSize="16px" borderRadius="full" />
            <Text fontSize="xs" color="fg.muted">
              1 {fromTokenDef.symbol}
            </Text>
          </Flex>
          <Text fontSize="xs" color="fg.muted">=</Text>
          <Flex align="center" gap={1}>
            <Text fontSize="xs" fontWeight="medium">
              {rate}
            </Text>
            <Image src={toTokenDef.icon} boxSize="16px" borderRadius="full" />
            <Text fontSize="xs" color="fg.muted">
              {toTokenDef.symbol}
            </Text>
          </Flex>
        </Flex>
      )}

      {/* Token price */}
      {quote && amountIn && (
        <Text fontSize="xs" color="fg.muted" textAlign="center">
          {poolToken.symbol} price: $
          {isBuy
            ? formatBalance(
                1 / (Number(formatUnits(quote.amountOut, poolToken.decimals)) / Number(formatUnits(amountIn, USDC_DECIMALS))),
                { precision: 4 }
              )
            : formatBalance(
                Number(formatUnits(quote.amountOut, USDC_DECIMALS)) / Number(formatUnits(amountIn, poolToken.decimals)),
                { precision: 4 }
              )}
        </Text>
      )}

      {/* Slippage selector */}
      <Box>
        <Flex
          align="center"
          gap={1}
          cursor="pointer"
          onClick={() => setShowSlippage((s) => !s)}
        >
          <Text fontSize="xs" color="fg.muted">
            Max slippage:
          </Text>
          <Text fontSize="xs" fontWeight="bold">
            {(slippage * 100).toFixed(slippage * 100 < 1 ? 2 : 1)}%
          </Text>
          <Text fontSize="2xs" color="fg.muted">
            {showSlippage ? '▲' : '▼'}
          </Text>
        </Flex>
        {showSlippage && (
          <Flex
            mt={2}
            bg="gray.50"
            borderRadius="full"
            p={1}
            align="center"
          >
            {SLIPPAGE_PRESETS.map((preset) => {
              const isActive = slippage === preset && !customSlippage
              return (
                <Box
                  key={preset}
                  as="button"
                  flex={1}
                  onClick={() => {
                    setSlippage(preset)
                    setCustomSlippage('')
                  }}
                  py={1.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight={isActive ? 'bold' : 'medium'}
                  textAlign="center"
                  bg={isActive ? 'white' : 'transparent'}
                  shadow={isActive ? 'xs' : 'none'}
                  color={isActive ? 'fg' : 'fg.muted'}
                  cursor="pointer"
                  _hover={{ bg: isActive ? 'white' : 'gray.100' }}
                >
                  {(preset * 100).toFixed(preset * 100 < 1 ? 2 : 1)}%
                </Box>
              )
            })}
            <Flex flex={1} align="center" justify="center">
              <Input
                size="xs"
                placeholder="Custom %"
                value={customSlippage}
                onChange={(e) => {
                  const val = e.target.value
                  setCustomSlippage(val)
                  const num = parseFloat(val)
                  if (!isNaN(num) && num > 0 && num <= 50) {
                    setSlippage(num / 100)
                  }
                }}
                textAlign="center"
                fontSize="xs"
                border="none"
                bg="transparent"
                _focus={{ boxShadow: 'none' }}
                width="70px"
              />
            </Flex>
          </Flex>
        )}
        {slippage > 0.02 && (
          <Flex
            mt={2}
            p={2}
            bg="red.50"
            borderRadius="md"
            border="1px solid"
            borderColor="red.200"
            align="center"
          >
            <Text fontSize="xs" color="red.600" fontWeight="medium">
              Warning: High slippage ({(slippage * 100).toFixed(1)}%). Your transaction may be frontrun
              and result in an unfavorable price.
            </Text>
          </Flex>
        )}
      </Box>

      {/* Swap details */}
      {quote && (
        <Box border="1px solid" borderColor="border.solid" borderRadius="lg" px={3} py={2}>
          <Stack gap={1.5}>
            <Flex justify="space-between">
              <Text fontSize="xs" color="fg.muted">
                Minimum received
              </Text>
              <Text fontSize="xs">
                {minReceived} {toTokenDef.symbol}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="xs" color="fg.muted">
                Price impact
              </Text>
              <Text fontSize="xs" color={priceImpact != null && priceImpact > 1 ? 'red.500' : 'fg'}>
                {priceImpact != null ? (priceImpact < 0.01 ? '< 0.01%' : `${priceImpact.toFixed(2)}%`) : '—'}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontSize="xs" color="fg.muted">
                Route
              </Text>
              <Text fontSize="xs">Aerodrome</Text>
            </Flex>
          </Stack>
        </Box>
      )}

      {/* Step indicator — shown during approve+swap flow */}
      {swapStep !== 'idle' && (
        <StepIndicator
          action="Swap"
          isFailed={swapStep === 'error'}
          isStep1Successful={swapStep !== 'approving'}
          isStep2Successful={swapStep === 'success'}
        />
      )}

      {/* Inline error states (non-toast) */}
      {insufficientBalance && (
        <Text fontSize="sm" color="red.500">
          Insufficient {fromTokenDef.symbol} balance
        </Text>
      )}
      {quoteError && (
        <Text fontSize="sm" color="red.500">
          Failed to get quote. Please try again.
        </Text>
      )}
      {amountIn && !isQuoteLoading && !quote && !quoteError && (
        <Text fontSize="sm" color="fg.muted">
          No route found for this pair.
        </Text>
      )}

      {/* Swap button */}
      <Button
        label={buttonLabel}
        colorPalette="yellow"
        borderRadius="3xl"
        width="100%"
        disabled={!canSwap}
        loading={isPending}
        onClick={handleApproveAndSwap}
      />

      {/* Powered by */}
      <Flex justify="center" align="center" gap={1.5} pt={1}>
        <Text fontSize="xs" color="fg.muted">
          Powered by
        </Text>
        <Image src={aerodromeLogo} height="16px" alt="Aerodrome" />
      </Flex>
    </Stack>
  )
}
