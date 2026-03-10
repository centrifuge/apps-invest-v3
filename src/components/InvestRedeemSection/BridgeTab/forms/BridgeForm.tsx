import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react'
import { RiFileCopyLine } from 'react-icons/ri'
import { HexString } from '@centrifuge/sdk'
import {
  allPoolsVaultsQueryKey,
  formatBalance,
  useBlockchainsMapByCentrifugeId,
  usePoolsAccessStatusQuery,
  type Investment,
  type PoolNetworkVaultData,
} from '@cfg'
import { Badge, Box, Button, Flex, Input, Separator, Text } from '@chakra-ui/react'
import type { BridgeActionType } from '@components/InvestRedeemSection/components/defaults'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { BalanceInput, Checkbox, SubmitButton, useFormContext, useWatch } from '@forms'
import { useQueryClient } from '@tanstack/react-query'
import { ChainSelect, type ChainOption } from '../components/ChainSelect'

interface BridgeFormProps {
  isDisabled: boolean
  setActionType: Dispatch<SetStateAction<BridgeActionType>>
}

export function BridgeForm({ isDisabled }: BridgeFormProps) {
  const { networks, selectedPoolId, pools } = usePoolContext()
  const { vaultDetails, investment } = useVaultsContext()
  const { data: blockchainsMap } = useBlockchainsMapByCentrifugeId()
  const { setValue, control } = useFormContext()
  const queryClient = useQueryClient()

  const poolIds = useMemo(() => pools?.map((p) => p.id) ?? [], [pools])
  const { data: accessStatus } = usePoolsAccessStatusQuery(poolIds)
  const memberNetworkIds = selectedPoolId ? accessStatus?.get(selectedPoolId.toString())?.memberNetworkIds : undefined

  const fromChain = useWatch({ control, name: 'fromChain' })
  const toChain = useWatch({ control, name: 'toChain' })
  const sendToDifferentAddress = useWatch({ control, name: 'sendToDifferentAddress' })
  const recipientAddress = useWatch({ control, name: 'recipientAddress' })

  const shareSymbol = vaultDetails?.share.symbol ?? ''

  // Read cached vault and investment data (already fetched by PoolTable)
  const shareBalanceByChain = useMemo(() => {
    const map = new Map<number, string>()
    if (!pools || !selectedPoolId) return map

    const poolIdsKey = pools
      .map((p) => p.id.toString())
      .sort()
      .join(',')
    const allPoolVaults = queryClient.getQueryData<PoolNetworkVaultData[]>(allPoolsVaultsQueryKey(poolIdsKey))
    if (!allPoolVaults) return map

    // Filter to current pool and pick one vault per network
    const vaultsForPool: PoolNetworkVaultData[] = []
    const cachedAllPoolVaults = new Set<number>()
    for (const v of allPoolVaults) {
      if (v.poolId !== selectedPoolId.toString() || cachedAllPoolVaults.has(v.centrifugeId)) continue
      cachedAllPoolVaults.add(v.centrifugeId)
      vaultsForPool.push(v)
    }

    // Look up cached investments — PoolTable caches all vaults' investments as a single batch,
    // so search by key prefix and build a vault address -> investment map
    const vaultAddresses = new Set(vaultsForPool.map((v) => v.vault.address))
    const cachedInvestmentsPerVaults = queryClient.getQueriesData<Investment[]>({ queryKey: ['investmentsPerVaults'] })
    const investmentByAddress = new Map<string, Investment>()

    for (const [key, investments] of cachedInvestmentsPerVaults) {
      if (!investments) continue
      const addressesStr = key[1] as string
      const addresses = addressesStr.split(',') as HexString[]
      addresses.forEach((addr, i) => {
        if (vaultAddresses.has(addr) && investments[i]) {
          investmentByAddress.set(addr, investments[i])
        }
      })
    }

    const fallback = `0.00 ${shareSymbol}`.trim()
    for (const v of vaultsForPool) {
      const inv = investmentByAddress.get(v.vault.address)
      map.set(
        v.centrifugeId,
        inv?.shareBalance ? formatBalance(inv.shareBalance, { currency: shareSymbol, precision: 2 }) : fallback
      )
    }

    return map
  }, [pools, selectedPoolId, queryClient, shareSymbol])

  const chainOptions: ChainOption[] = useMemo(() => {
    if (!networks || !blockchainsMap) return []
    return networks
      .filter((n) => !memberNetworkIds || memberNetworkIds.has(n.centrifugeId))
      .map((n) => {
        const blockchain = blockchainsMap.get(n.centrifugeId)
        if (!blockchain) return null
        const balanceLabel = shareBalanceByChain.get(n.centrifugeId)
        return {
          centrifugeId: n.centrifugeId,
          name: blockchain.name,
          hasBalance: !!balanceLabel && !balanceLabel.startsWith('0.00'),
          balanceLabel,
        }
      })
      .filter(Boolean) as ChainOption[]
  }, [networks, blockchainsMap, shareBalanceByChain, memberNetworkIds])

  const toChainOptions = useMemo(
    () => chainOptions.filter((o) => o.centrifugeId !== Number(fromChain)),
    [chainOptions, fromChain]
  )

  const selectedFromChain = useMemo(
    () => chainOptions.find((o) => o.centrifugeId === Number(fromChain)),
    [chainOptions, fromChain]
  )

  const selectedToChain = useMemo(
    () => chainOptions.find((o) => o.centrifugeId === Number(toChain)),
    [chainOptions, toChain]
  )

  const hasNoSharesOnAnyChain = chainOptions.length > 0 && chainOptions.every((o) => !o.hasBalance)
  const isBridgeDisabled = isDisabled || chainOptions.length <= 1 || hasNoSharesOnAnyChain

  const maxAmount = useMemo(() => {
    return investment?.shareBalance
      ? formatBalance(investment.shareBalance, { currency: shareSymbol, precision: 2 })
      : `0.00 ${shareSymbol}`
  }, [investment?.shareBalance, shareSymbol])

  const setMaxAmount = useCallback(() => {
    if (!investment?.shareBalance) return
    setValue('amount', investment.shareBalance.toDecimal().toString(), { shouldValidate: true })
  }, [investment?.shareBalance, setValue])

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

          {/* Amount input */}
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
            <SummaryRow label="Asset amount" value={shareSymbol ? `— ${shareSymbol}` : '—'} />
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justifyContent="space-between" alignItems="center" mb={1.5}>
      <Text fontSize="sm" color="fg.muted">
        {label}
      </Text>
      <Text fontSize="sm" fontWeight={500}>
        {value}
      </Text>
    </Flex>
  )
}
