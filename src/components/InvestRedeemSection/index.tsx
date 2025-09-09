import { Dispatch, SetStateAction, useMemo, useState, type ComponentType } from 'react'
import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import type { Vault } from '@centrifuge/sdk'
import { useGeolocation } from '@hooks/useGeolocation'
import { ConnectionGuard } from '@components/elements/ConnectionGuard'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { InvestTab } from '@components/InvestRedeemSection/InvestTab/InvestTab'
import { RedeemTab } from '@components/InvestRedeemSection/RedeemTab/RedeemTab'
import { InvestRedeemClaimForm } from '@components/InvestRedeemSection/components/InvestRedeemClaimForm'
import { useVaultsContext } from '@contexts/VaultsContext'
import { InvestorOnboardingFeedback } from '@components/InvestRedeemSection/components/InvestorOnboardingFeedback'
import { PendingTab } from '@components/InvestRedeemSection/PendingTab/PendingTab'
import { useChainId } from 'wagmi'
import { type PoolDetails, useAddress, useIsMember } from '@cfg'
import { usePoolContext } from '@contexts/PoolContext'
import { Tabs } from '@ui'

export interface TabProps {
  isLoading: boolean
  vault: Vault
}
interface VaultGuardProps {
  isClaimFormDisplayed: boolean
  isInvestorWhiteListed: boolean
  isLoading: boolean
  tab: ComponentType<TabProps>
  setIsClaimFormDisplayed: Dispatch<SetStateAction<boolean>>
}

const RestrictedCountry = () => {
  return (
    <Flex direction="column" gap={2} mt={4} flex={1}>
      <Heading>Investor requirements</Heading>
      <InfoWrapper text="Unfortunately you are unable to invest at this time due to your location.  Geo restrictions apply to all US citizens and countries that are sanctioned." />
    </Flex>
  )
}

export function InvestRedeemSection({ pool: poolDetails }: { pool?: PoolDetails }) {
  const connectedChain = useChainId()
  const { network, networks, isLoading: isPoolContextLoading, isPoolDataReady, shareClassId } = usePoolContext()
  const { investment, isLoading: isVaultsContextLoading, vault } = useVaultsContext()
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, network?.chainId, {
    enabled: isPoolDataReady && !!shareClassId && !!network?.chainId,
  })

  // Handle check restricted countries
  const isLocationQueryReady = isPoolDataReady && !isPoolContextLoading && !isVaultsContextLoading
  const { data: location } = useGeolocation({
    enabled: isLocationQueryReady,
  })
  const kycCountries = poolDetails?.metadata?.onboarding?.kycRestrictedCountries ?? []
  const kybCountries = poolDetails?.metadata?.onboarding?.kybRestrictedCountries ?? []
  const restrictedCountries = [...kycCountries, ...kybCountries]
  const isRestrictedCountry = restrictedCountries.includes(location?.country_code ?? '')

  // Find if invest and redeem is possible
  const isInvestableChain = useMemo(
    () => networks?.map((n) => n.chainId).includes(connectedChain),
    [networks, connectedChain]
  )
  const isInvestorWhiteListed = useMemo(() => !!isMember, [isMember, vault, connectedChain])
  const hasClaimableAssets = useMemo(
    () =>
      (investment?.claimableInvestShares.toBigInt() ?? 0n) > 0n ||
      (investment?.claimableRedeemCurrency.toBigInt() ?? 0n) > 0n,
    [investment, vault, connectedChain]
  )
  const [isClaimFormDisplayed, setIsClaimFormDisplayed] = useState(hasClaimableAssets)

  const isTabLoading = isVaultsContextLoading || isPoolContextLoading || isMemberLoading
  const isTabDisabled = useMemo(
    () => !isInvestorWhiteListed || !vault || !isInvestableChain || isClaimFormDisplayed,
    [isInvestorWhiteListed, vault, isInvestableChain, isClaimFormDisplayed]
  )
  // TODO: Handle sync vs async invest and redeem transactions
  // const isSyncInvestVault = vaultDetails?.isSyncInvest || false

  if (!poolDetails) return null

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border-primary"
      borderRadius="10px"
      shadow="xs"
      bg="white"
      h="100%"
      overflow="hidden"
    >
      <Tabs
        elements={[
          {
            label: 'Invest',
            value: 'tab-invest',
            disabled: isTabDisabled,
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard
                isClaimFormDisplayed={isClaimFormDisplayed}
                isInvestorWhiteListed={isInvestorWhiteListed}
                isLoading={isTabLoading}
                tab={InvestTab}
                setIsClaimFormDisplayed={setIsClaimFormDisplayed}
              />
            ),
          },
          {
            label: 'Redeem',
            value: 'tab-redeem',
            disabled: isTabDisabled,
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard
                isClaimFormDisplayed={isClaimFormDisplayed}
                isInvestorWhiteListed={isInvestorWhiteListed}
                isLoading={isTabLoading}
                tab={RedeemTab}
                setIsClaimFormDisplayed={setIsClaimFormDisplayed}
              />
            ),
          },
          {
            label: 'Pending',
            value: 'tab-pending',
            disabled: isTabDisabled,
            body: isRestrictedCountry ? (
              <RestrictedCountry />
            ) : (
              <VaultGuard
                isClaimFormDisplayed={isClaimFormDisplayed}
                isInvestorWhiteListed={isInvestorWhiteListed}
                isLoading={isTabLoading}
                tab={PendingTab}
                setIsClaimFormDisplayed={setIsClaimFormDisplayed}
              />
            ),
          },
        ]}
      />
    </Flex>
  )
}

function VaultGuard({
  isClaimFormDisplayed,
  isInvestorWhiteListed,
  isLoading,
  tab: Tab,
  setIsClaimFormDisplayed,
}: VaultGuardProps) {
  const { network, networks } = usePoolContext()
  const { investment, vault } = useVaultsContext()
  const { chainId } = useAddress()

  const chainIds = networks?.map((network) => network.chainId) ?? []
  const shouldRenderOnboarding = useMemo(
    () => vault && chainId && chainIds.includes(chainId) && !isInvestorWhiteListed,
    [network, vault, chainId, isInvestorWhiteListed]
  )

  if (isLoading) {
    return (
      <Box height="100%" minH="182px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="black.solid" />
      </Box>
    )
  }

  if (isClaimFormDisplayed && vault) {
    return (
      <InvestRedeemClaimForm
        claimableInvestShares={investment?.claimableInvestShares}
        claimableRedeemCurrency={investment?.claimableRedeemCurrency}
        claimableInvestCurrencyEquivalent={investment?.claimableInvestCurrencyEquivalent}
        claimableRedeemSharesEquivalent={investment?.claimableRedeemSharesEquivalent}
        investmentCurrency={investment?.investmentCurrency}
        shareCurrency={investment?.shareCurrency}
        vault={vault}
        setIsClaimFormDisplayed={setIsClaimFormDisplayed}
      />
    )
  }

  if (shouldRenderOnboarding) {
    return (
      <InvestorOnboardingFeedback
        investCurrencyAddress={investment?.investmentCurrency.address}
        shareCurrencyAddress={investment?.shareCurrency.address}
        chainId={chainId}
      />
    )
  }

  return (
    <ConnectionGuard
      networks={chainIds}
      message="This pool is only available on specific networks. Please switch to one of the supported networks to continue."
    >
      {!vault ? (
        <Text>No vaults found for this pool on this network.</Text>
      ) : (
        <Stack height="100%">
          <Tab isLoading={isLoading} vault={vault} />
        </Stack>
      )}
    </ConnectionGuard>
  )
}
