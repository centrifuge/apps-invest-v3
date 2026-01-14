import { Dispatch, SetStateAction, useMemo, useState, type ComponentType } from 'react'
import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import type { Vault } from '@centrifuge/sdk'
import { ConnectionGuard } from '@components/elements/ConnectionGuard'
import { InfoWrapper } from '@components/InvestRedeemSection/components/InfoWrapper'
import { InvestTab } from '@components/InvestRedeemSection/InvestTab/InvestTab'
import { RedeemTab } from '@components/InvestRedeemSection/RedeemTab/RedeemTab'
import { InvestRedeemClaimForm } from '@components/InvestRedeemSection/components/InvestRedeemClaimForm'
import { useVaultsContext } from '@contexts/VaultsContext'
import { InvestorOnboardingFeedback } from '@components/InvestRedeemSection/components/InvestorOnboardingFeedback'
import { PendingTab } from '@components/InvestRedeemSection/PendingTab/PendingTab'
import { useGeolocation } from '@hooks/useGeolocation'
import { useGetPoolRestrictedCountries } from '@hooks/useGetPoolRestrictedCountries'
import { useGetPoolsByIds } from '@hooks/useGetPoolsByIds'
import { useChainId } from 'wagmi'
import {
  type PoolDetails,
  useAddress,
  useBlockchainsMapByChainId,
  useBlockchainsMapByCentrifugeId,
  useIsMember,
} from '@cfg'
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
      <InfoWrapper text="Unfortunately you are unable to invest at this time due to your location. Restrictions apply to US Persons and residents of sanctioned jurisdictions." />
    </Flex>
  )
}

export function InvestRedeemSection({ pool: poolDetails }: { pool?: PoolDetails }) {
  const connectedChain = useChainId()
  const { data: blockchainsMapByChainId } = useBlockchainsMapByChainId()
  const { network, networks, isLoading: isPoolContextLoading, isPoolDataReady, shareClassId } = usePoolContext()
  const { investment, isLoading: isVaultsContextLoading, vault } = useVaultsContext()
  const { data: isMember, isLoading: isMemberLoading } = useIsMember(shareClassId, network?.centrifugeId, {
    enabled: isPoolDataReady && !!shareClassId && !!network?.centrifugeId,
  })

  // Handle check restricted countries
  const { getIsDeRwaPool } = useGetPoolsByIds()
  const isLocationQueryReady = isPoolDataReady && !isPoolContextLoading && !isVaultsContextLoading
  const { data: location } = useGeolocation({
    enabled: isLocationQueryReady,
  })
  const poolRestrictedCountries = useGetPoolRestrictedCountries(
    poolDetails?.id.toString(),
    getIsDeRwaPool(poolDetails?.id.toString())
  )
  const kycCountries = poolDetails?.metadata?.onboarding?.kycRestrictedCountries ?? []
  const kybCountries = poolDetails?.metadata?.onboarding?.kybRestrictedCountries ?? []
  const restrictedCountries = [...kycCountries, ...kybCountries, ...poolRestrictedCountries]
  const isRestrictedCountry = restrictedCountries.includes(location?.country_code ?? '')

  // Find if invest and redeem is possible
  const isInvestableChain = useMemo(() => {
    if (!networks || !blockchainsMapByChainId) return false
    const connectedCentrifugeId = blockchainsMapByChainId.get(connectedChain)?.centrifugeId
    return networks.some((n) => n.centrifugeId === connectedCentrifugeId)
  }, [networks, connectedChain, blockchainsMapByChainId])
  const isInvestorWhiteListed = useMemo(() => !!isMember, [isMember, vault, connectedChain])
  // Account for leftover dust that is technically claimable but not worth claiming
  const oneUSDC = 10n ** 6n
  const hasClaimableAssets = useMemo(
    () =>
      (investment?.claimableDepositShares.toBigInt() ?? 0n) >= oneUSDC ||
      (investment?.claimableRedeemAssets.toBigInt() ?? 0n) >= oneUSDC,
    [investment, vault, connectedChain]
  )
  const [isClaimFormDisplayed, setIsClaimFormDisplayed] = useState(hasClaimableAssets)

  const isTabLoading = isVaultsContextLoading || isPoolContextLoading || isMemberLoading
  const isTabDisabled = useMemo(
    () => !isInvestorWhiteListed || !vault || !isInvestableChain || isClaimFormDisplayed,
    [isInvestorWhiteListed, vault, isInvestableChain, isClaimFormDisplayed]
  )

  if (!poolDetails) return null

  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border.solid"
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
  const { networks } = usePoolContext()
  const { investment, vault } = useVaultsContext()
  const { chainId } = useAddress()
  const { data: blockchainsMapByCentrifugeId } = useBlockchainsMapByCentrifugeId()

  const chainIds = useMemo(() => {
    if (!networks || !blockchainsMapByCentrifugeId) return []
    return networks
      .map((network) => blockchainsMapByCentrifugeId.get(network.centrifugeId)?.chainId)
      .filter((id): id is number => id !== undefined)
  }, [networks, blockchainsMapByCentrifugeId])

  const shouldRenderOnboarding = useMemo(
    () => vault && chainId && chainIds.includes(chainId) && !isInvestorWhiteListed,
    [vault, chainId, chainIds, isInvestorWhiteListed]
  )

  if (isLoading) {
    return (
      <Box height="100%" minH="182px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="fg.solid" />
      </Box>
    )
  }

  if (isClaimFormDisplayed && vault) {
    return (
      <InvestRedeemClaimForm
        claimableDepositShares={investment?.claimableDepositShares}
        claimableRedeemAssets={investment?.claimableRedeemAssets}
        claimableDepositAssetEquivalent={investment?.claimableDepositAssetEquivalent}
        claimableRedeemSharesEquivalent={investment?.claimableRedeemSharesEquivalent}
        asset={investment?.asset}
        share={investment?.share}
        vault={vault}
        setIsClaimFormDisplayed={setIsClaimFormDisplayed}
      />
    )
  }

  if (shouldRenderOnboarding) {
    return (
      <InvestorOnboardingFeedback
        investCurrencyAddress={investment?.asset.address}
        shareCurrencyAddress={investment?.share.address}
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
