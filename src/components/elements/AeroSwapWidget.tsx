import { useState } from 'react'
import { type Address } from 'viem'
import { formatBalance, ipfsToHttp } from '@cfg'
import { Box, Flex, Heading, Image, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import { ConnectionGuard } from '@components/elements/ConnectionGuard'
import { StepIndicator } from '@components/elements/StepIndicator'
import { SlippageSelector } from '@components/elements/SlippageSelector'
import { TransactionOverlay } from '@components/elements/TransactionOverlay'
import { useAeroSwap, BASE_CHAIN_ID, type TokenDef } from '@hooks/useAeroSwap'
import { Button } from '@ui'
import centrifugeIcon from '../../assets/logos/centrifuge-logo-lg.svg'
import aerodromeLogo from '../../assets/logos/aerodrome-logo.svg'

const DESPXA_BASE = '0x9c5C365e764829876243d0b289733B9D2b729685' as Address
const DEJAA_BASE = '0xaaa0008c8cf3a7dca931adaf04336a5d808c82cc' as Address

const POOL_TOKENS: Record<string, TokenDef> = {
  '281474976710659': { name: 'deJAAA', symbol: 'deJAAA', address: DEJAA_BASE, decimals: 18, icon: centrifugeIcon },
  '281474976710668': {
    name: 'deSPXA Token',
    symbol: 'deSPXA',
    address: DESPXA_BASE,
    decimals: 18,
    icon: centrifugeIcon,
  },
}

const DEFAULT_SLIPPAGE = 0.01

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

function SwapForm({ poolToken }: { poolToken: TokenDef }) {
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE)

  const {
    isBuy,
    inputAmount,
    setInputAmount,
    swapStep,
    setSwapStep,
    swapTxHash,
    submittedSwap,
    fromTokenDef,
    toTokenDef,
    fromBalanceFormatted,
    toBalanceFormatted,
    quote,
    isQuoteLoading,
    quoteError,
    amountIn,
    formattedOutput,
    rate,
    minReceived,
    priceImpact,
    tokenPrice,
    needsApproval,
    insufficientBalance,
    isPending,
    canSwap,
    buttonLabel,
    handleApproveAndSwap,
    handleFlipDirection,
    resetOverlay,
  } = useAeroSwap(poolToken, slippage)

  // Transaction status overlay
  const showOverlay = swapStep === 'swapping' || swapStep === 'success' || swapStep === 'error'

  if (showOverlay && submittedSwap) {
    return (
      <TransactionOverlay
        swapStep={swapStep}
        fromTokenDef={fromTokenDef}
        toTokenDef={toTokenDef}
        submittedSwap={submittedSwap}
        swapTxHash={swapTxHash}
        onClose={resetOverlay}
      />
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
        <Flex align="center" border="1px solid" borderColor="border.solid" borderRadius="lg" px={3} py={2} gap={2}>
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
          <Text fontSize="xs" color="fg.muted">
            =
          </Text>
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
      {tokenPrice != null && (
        <Text fontSize="xs" color="fg.muted" textAlign="center">
          {poolToken.symbol} price: ${formatBalance(tokenPrice, { precision: 4 })}
        </Text>
      )}

      {/* Slippage selector */}
      <SlippageSelector slippage={slippage} onSlippageChange={setSlippage} />

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

      {/* Step indicator — only shown during approve+swap flow when approval is needed */}
      {swapStep !== 'idle' && needsApproval && (
        <StepIndicator
          action="Swap"
          isFailed={swapStep === 'error'}
          isStep1Successful={swapStep !== 'approving'}
          isStep2Successful={swapStep === 'success'}
        />
      )}

      {/* Inline error states */}
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
