import { useState, useMemo } from 'react'
import { z } from 'zod'
import { Box, Spinner } from '@chakra-ui/react'
import { Form, useForm, safeParse, createBalanceSchema } from '@forms'
import { Balance } from '@centrifuge/sdk'
import {
  formatBalance,
  useAddress,
  useCentrifugeTransaction,
  useSolanaInvest,
  useInvestment,
  useVaultDetails,
  useSolanaUsdcBalance,
} from '@cfg'
import {
  type InvestActionType,
  InvestAction,
  InvestFormDefaultValues,
} from '@components/InvestRedeemSection/components/defaults'
import { InvestTabForm } from '@components/InvestRedeemSection/InvestTab/forms/InvestTabForm'
import { TabProps } from '@components/InvestRedeemSection'
import { useGetPortfolioDetails } from '@hooks/useGetPortfolioDetails'
import { usePoolContext } from '@contexts/PoolContext'
import { useSolanaWalletAdapter, walletAdapterFallback } from '@wallet/useSolanaWalletAdapter'

export function InvestTab({ isLoading: isTabLoading, vault }: TabProps) {
  const { walletType } = useAddress()

  // Only call useSolanaWalletAdapter for Solana wallets to avoid AppKit provider errors
  const solanaAdapter = walletType === 'solana' ? useSolanaWalletAdapter() : walletAdapterFallback
  const { publicKey, signTransaction } = solanaAdapter

  const { shareClass } = usePoolContext()
  const { data: vaultDetails, isLoading: isVaultDetailsLoading } = useVaultDetails(vault)
  const { data: investment, isLoading: isInvestmentLoading } = useInvestment(vault)
  const { portfolioBalance, isPortfolioLoading } = useGetPortfolioDetails(vaultDetails)
  const { data: solanaUsdcBalance, isLoading: isSolanaBalanceLoading } = useSolanaUsdcBalance()
  const { execute: executeEvm, isPending: isEvmPending } = useCentrifugeTransaction()
  const { invest: investSolanaUsdc, isPending: isSolanaPending } = useSolanaInvest(shareClass?.shareClass.id)
  const [actionType, setActionType] = useState<InvestActionType>(InvestAction.INVEST_AMOUNT)

  const isPending = walletType === 'solana' ? isSolanaPending : isEvmPending

  const investBalance = walletType === 'solana' ? solanaUsdcBalance : portfolioBalance

  const maxInvestAmount = useMemo(() => {
    if (!investBalance) return '0'
    return investBalance.toFloat().toFixed(0)
  }, [investBalance])

  const formattedMaxInvestAmount = useMemo(() => {
    if (!investBalance) return '0'
    const currencySymbol = walletType === 'solana' ? 'USDC' : investment?.investmentCurrency.symbol
    return formatBalance(investBalance, currencySymbol, 0) ?? '0'
  }, [investBalance, walletType, investment])

  function invest(amount: Balance) {
    executeEvm(vault.increaseInvestOrder(amount))
  }

  const investmentDecimals = walletType === 'solana' ? 6 : (vaultDetails?.investmentCurrency.decimals ?? 18)

  const schema = z.object({
    investAmount: createBalanceSchema(investmentDecimals, z.number().min(1).max(Number(maxInvestAmount))),
    receiveAmount: createBalanceSchema(vaultDetails?.shareCurrency.decimals ?? 18).optional(),
    // TODO: Use these when we need to add the sync invest action
    // requirement_nonUsCitizen: z.boolean().refine((val) => val === true, {
    //   message: 'Non-US citizen requirement must be confirmed',
    // }),
    // requirement_nonSanctionedList: z.boolean().refine((val) => val === true, {
    //   message: 'Non-sanctioned list requirement must be confirmed',
    // }),
    // requirement_redeemLater: z.boolean().refine((val) => val === true, {
    //   message: 'Redeem later requirement must be confirmed',
    // }),
    // investorRequirements: z.array(z.boolean()).length(3, 'Array must contain exactly 3 requirements'),
  })

  const form = useForm({
    schema,
    defaultValues: InvestFormDefaultValues,
    mode: 'onChange',
    onSubmit: async (values) => {
      if (walletType === 'solana') {
        if (signTransaction === undefined || !publicKey) {
          throw new Error('Solana wallet missing publicKey or signTransaction')
        }
        investSolanaUsdc(values.investAmount, { publicKey, signTransaction })
      } else {
        invest(values.investAmount)
      }
      setActionType(InvestAction.CONFIRM)
    },
    onSubmitError: (error) => console.error('Invest form submission error:', error),
  })

  const { watch, formState } = form
  const [investAmount, receiveAmount] = watch(['investAmount', 'receiveAmount'])

  const parsedInvestAmount = useMemo(
    () => safeParse(schema.shape.investAmount, investAmount) ?? 0,
    [investAmount, schema.shape.investAmount]
  )

  const parsedReceiveAmount = useMemo(
    () => safeParse(schema.shape.receiveAmount, receiveAmount) ?? 0,
    [receiveAmount, schema.shape.receiveAmount]
  )

  const isLoading =
    isTabLoading ||
    isVaultDetailsLoading ||
    isInvestmentLoading ||
    (walletType === 'solana' ? isSolanaBalanceLoading : isPortfolioLoading)

  const isDisabled =
    isPending ||
    !vaultDetails ||
    !formState.isValid ||
    (walletType === 'evm' && !investment) ||
    (walletType === 'solana' && (!publicKey || !signTransaction))

  if (isLoading) {
    return (
      <Box height="182px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="fg.solid" />
      </Box>
    )
  }

  return (
    <Form form={form} style={{ height: '100%' }}>
      <Box mt={4} height="100%">
        <InvestTabForm
          actionType={actionType}
          isDisabled={isDisabled}
          formattedMaxInvestAmount={formattedMaxInvestAmount}
          maxInvestAmount={maxInvestAmount}
          parsedInvestAmount={parsedInvestAmount}
          parsedReceiveAmount={parsedReceiveAmount}
          setActionType={setActionType}
        />
      </Box>
    </Form>
  )
}
