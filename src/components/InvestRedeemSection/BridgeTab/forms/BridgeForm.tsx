import { useCallback, useEffect, useMemo, type Dispatch, type SetStateAction } from 'react'
import { RiFileCopyLine } from 'react-icons/ri'
import { HexString } from '@centrifuge/sdk'
import {
  formatBalance,
  useAddress,
  useBlockchainsMapByCentrifugeId,
  useAllowedBridgeDestinations,
  useShareClassDeployments,
  useAllPoolsVaults,
  useInvestmentsPerVaults,
  type Investment,
  type PoolNetworkVaultData,
} from '@cfg'
import { Badge, Box, Button, Flex, Input, Separator, Text } from '@chakra-ui/react'
import type { BridgeActionType } from '@components/InvestRedeemSection/components/defaults'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { BalanceInput, Checkbox, SubmitButton, useFormContext, useWatch } from '@forms'
import { ChainSelect, type ChainOption } from '../components/ChainSelect'
import { SummaryRow } from '../components/SummaryRow'

interface BridgeFormProps {
  isDisabled: boolean
  setActionType: Dispatch<SetStateAction<BridgeActionType>>
}

export function BridgeForm({ isDisabled }: BridgeFormProps) {
  const { selectedPoolId, pools, shareClass } = usePoolContext()
  const { vaultDetails } = useVaultsContext()
  const { data: blockchainsMap } = useBlockchainsMapByCentrifugeId()
  const { setValue, control, clearErrors } = useFormContext()
  const { address } = useAddress()

  const fromChain = useWatch({ control, name: 'fromChain' })
  const toChain = useWatch({ control, name: 'toChain' })
  const amount = useWatch({ control, name: 'amount' })
  const sendToDifferentAddress = useWatch({ control, name: 'sendToDifferentAddress' })
  const recipientAddress = useWatch({ control, name: 'recipientAddress' })

  const shareSymbol = vaultDetails?.share.symbol ?? ''

  // Bridge validation criteria 1, 2, 4: Fetch all networks where the share token AND its hook (restriction manager) are deployed
  const { data: deployments } = useShareClassDeployments(shareClass?.shareClass, {
    enabled: !!shareClass?.shareClass,
  })

  const deployedCentrifugeIds = useMemo(() => new Set(deployments?.map((d) => d.centrifugeId) ?? []), [deployments])

  // The receiver for transfer restriction checks — use custom recipient if set, otherwise connected wallet
  const effectiveReceiver = useMemo(
    () => (sendToDifferentAddress && recipientAddress ? recipientAddress : address) as HexString | undefined,
    [sendToDifferentAddress, recipientAddress, address]
  )

  // Criteria 3 & 5: Validate transfer restrictions for all potential destination chains
  // given the selected source chain and receiver address
  const { data: allowedDestinations, isLoading: isRestrictionsLoading } = useAllowedBridgeDestinations(
    shareClass?.shareClass,
    fromChain ? Number(fromChain) : undefined,
    effectiveReceiver,
    { enabled: !!fromChain && !!effectiveReceiver }
  )

  const poolIds = useMemo(() => pools?.map((p) => p.id) ?? [], [pools])
  const { data: allPoolVaults } = useAllPoolsVaults(poolIds)

  // Filter to current pool and pick one vault per network
  const vaultsForPool = useMemo(() => {
    if (!allPoolVaults || !selectedPoolId) return []
    const seen = new Set<number>()
    const result: PoolNetworkVaultData[] = []
    for (const v of allPoolVaults) {
      if (v.poolId !== selectedPoolId.toString() || seen.has(v.centrifugeId)) continue
      seen.add(v.centrifugeId)
      result.push(v)
    }
    return result
  }, [allPoolVaults, selectedPoolId])

  const vaultObjects = useMemo(() => vaultsForPool.map((v) => v.vault), [vaultsForPool])
  const { data: investments } = useInvestmentsPerVaults(vaultObjects)

  const { shareBalanceByChain, investmentByChain } = useMemo(() => {
    const balanceMap = new Map<number, string>()
    const investmentMap = new Map<number, Investment>()
    const fallback = `0.00 ${shareSymbol}`.trim()

    for (let i = 0; i < vaultsForPool.length; i++) {
      const v = vaultsForPool[i]
      const inv = investments?.[i]
      balanceMap.set(
        v.centrifugeId,
        inv?.shareBalance ? formatBalance(inv.shareBalance, { currency: shareSymbol, precision: 2 }) : fallback
      )
      if (inv) investmentMap.set(v.centrifugeId, inv)
    }

    return { shareBalanceByChain: balanceMap, investmentByChain: investmentMap }
  }, [vaultsForPool, investments, shareSymbol])

  // Chain options filtered by deployment (criteria 1, 2, 4): only show chains where
  // the share token AND hook (restriction manager) are deployed
  const chainOptions: ChainOption[] = useMemo(() => {
    if (!blockchainsMap || deployedCentrifugeIds.size === 0) return []
    return Array.from(deployedCentrifugeIds)
      .map((centrifugeId) => {
        const blockchain = blockchainsMap.get(centrifugeId)
        if (!blockchain) return null
        const balanceLabel = shareBalanceByChain.get(centrifugeId)
        return {
          centrifugeId,
          name: blockchain.name,
          hasBalance: !!balanceLabel && !balanceLabel.startsWith('0.00'),
          balanceLabel,
        }
      })
      .filter(Boolean) as ChainOption[]
  }, [blockchainsMap, shareBalanceByChain, deployedCentrifugeIds])

  // "To" chain options: exclude selected fromChain and filter by transfer restrictions (criteria 3 & 5)
  const toChainOptions = useMemo(() => {
    const fromId = Number(fromChain)
    return chainOptions.filter((o) => {
      if (o.centrifugeId === fromId) return false
      // Only show destinations that are confirmed allowed by transfer restrictions
      if (!allowedDestinations || allowedDestinations.size === 0) return false
      return allowedDestinations.get(o.centrifugeId) === true
    })
  }, [chainOptions, fromChain, allowedDestinations])

  // Clear toChain if it's no longer in the valid options (e.g., transfer restrictions loaded)
  useEffect(() => {
    if (toChain && toChainOptions.length > 0 && !toChainOptions.some((o) => String(o.centrifugeId) === toChain)) {
      setValue('toChain', '', { shouldValidate: true })
    }
  }, [toChain, toChainOptions, setValue])

  // Reset amount and clear errors when fromChain changes
  useEffect(() => {
    setValue('amount', '', { shouldValidate: false })
    clearErrors('amount')
  }, [fromChain, setValue, clearErrors])

  const selectedFromChain = useMemo(
    () => chainOptions.find((o) => o.centrifugeId === Number(fromChain)),
    [chainOptions, fromChain]
  )

  const selectedToChain = useMemo(
    () => chainOptions.find((o) => o.centrifugeId === Number(toChain)),
    [chainOptions, toChain]
  )

  // Use the selected fromChain's investment data for max amount
  const fromChainInvestment = fromChain ? investmentByChain.get(Number(fromChain)) : undefined

  const hasNoSharesOnAnyChain = chainOptions.length > 0 && chainOptions.every((o) => !o.hasBalance)
  const hasNoSharesOnFromChain = !fromChainInvestment?.shareBalance || fromChainInvestment.shareBalance.isZero()
  const isRestrictionsNotReady = !!fromChain && isRestrictionsLoading
  const isBridgeDisabled =
    isDisabled || chainOptions.length <= 1 || hasNoSharesOnAnyChain || hasNoSharesOnFromChain || isRestrictionsNotReady

  const maxAmount = useMemo(() => {
    return fromChainInvestment?.shareBalance
      ? formatBalance(fromChainInvestment.shareBalance, { currency: shareSymbol, precision: 2 })
      : `0.00 ${shareSymbol}`
  }, [fromChainInvestment?.shareBalance, shareSymbol])

  const setMaxAmount = useCallback(() => {
    if (!fromChainInvestment?.shareBalance) return
    setValue('amount', fromChainInvestment.shareBalance.toDecimal().toString(), { shouldValidate: true })
  }, [fromChainInvestment?.shareBalance, setValue])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setValue('recipientAddress', text, { shouldValidate: true })
    } catch {
      // Clipboard access denied
    }
  }

  return (
    <Box height="100%">
      <Flex direction="column" justifyContent="space-between" height="100%">
        <Box>
          <Flex gap={4}>
            <Box flex={1}>
              <ChainSelect
                name="fromChain"
                label="From"
                options={chainOptions}
                variant="from"
                disabled={isDisabled}
                onSelectChange={(id) => {
                  // Clear toChain if it's the same as the newly selected fromChain
                  if (String(id) === toChain) setValue('toChain', '', { shouldValidate: true })
                }}
              />
            </Box>
            <Box flex={1}>
              <ChainSelect
                name="toChain"
                label="To"
                options={toChainOptions}
                variant="to"
                disabled={isDisabled || !fromChain}
              />
            </Box>
          </Flex>

          <Box mt={5}>
            <BalanceInput
              name="amount"
              label="Amount"
              decimals={vaultDetails?.share.decimals}
              placeholder="0.00"
              currency={shareSymbol}
              disabled={isBridgeDisabled}
            />
            <Flex mt={2} alignItems="center" gap={2}>
              <Badge
                background="bg.subtle"
                color="fg.solid"
                opacity={0.5}
                borderRadius={10}
                px={3}
                h="24px"
                borderColor="border.dark-muted !important"
                border="1px solid"
                cursor={isBridgeDisabled ? 'not-allowed' : 'pointer'}
                onClick={isBridgeDisabled ? undefined : setMaxAmount}
              >
                MAX
              </Badge>
              <Text color="fg.solid" opacity={0.5} fontSize="sm">
                {maxAmount} available
              </Text>
            </Flex>
          </Box>

          <Separator my={6} borderColor="border.input" />

          <Box>
            <Checkbox
              name="sendToDifferentAddress"
              label={<Text fontSize="sm">Sending to a different address?</Text>}
              labelStart={false}
              disabled={isBridgeDisabled}
            />
            {sendToDifferentAddress && (
              <Flex mt={2} gap={2.5} alignItems="stretch">
                <Input
                  placeholder="0x..."
                  size="md"
                  borderRadius="md"
                  bg="bg.input"
                  flex={1}
                  value={recipientAddress || ''}
                  onChange={(e) => setValue('recipientAddress', e.target.value, { shouldValidate: true })}
                />
                <Button
                  onClick={handlePaste}
                  size="md"
                  variant="solid"
                  bg="bg.inverted"
                  color="fg.inverted"
                  borderRadius="md"
                  px={4}
                  _hover={{ bg: 'bg.inverted-muted' }}
                >
                  <RiFileCopyLine />
                  Paste
                </Button>
              </Flex>
            )}
          </Box>

          <Separator my={6} borderColor="border.input" />

          <Box px={1}>
            <SummaryRow label="Asset amount" value={amount ? `${amount} ${shareSymbol}` : '—'} />
            <SummaryRow label="From chain" value={selectedFromChain?.name ?? '—'} />
            <SummaryRow label="To chain" value={selectedToChain?.name ?? '—'} />
            <SummaryRow label="Bridge fee" value="—" />
            <SummaryRow label="Estimated time" value="—" />
          </Box>
        </Box>

        <Box mt={6}>
          <SubmitButton colorPalette="yellow" width="100%" disabled={isDisabled}>
            Bridge now
          </SubmitButton>
        </Box>
      </Flex>
    </Box>
  )
}
