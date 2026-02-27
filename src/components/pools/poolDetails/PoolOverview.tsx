import { Link } from 'react-router-dom'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { chainExplorer, formatBalance, useBlockchainsMapByCentrifugeId } from '@cfg'
import { getAgencyNormalisedName, RatingPill } from '@components/elements/RatingPill'
import { usePoolContext } from '@contexts/PoolContext'
import { useVaultsContext } from '@contexts/VaultsContext'
import { NetworkIcon, Tooltip } from '@ui'

export function PoolOverview() {
  const { networks, poolDetails, shareClass, shareClassId } = usePoolContext()
  const { investment } = useVaultsContext()
  const { data: blockchainsMap } = useBlockchainsMapByCentrifugeId()
  const metadata = poolDetails?.metadata
  const assetType = `${metadata?.pool.asset.class ? metadata.pool.asset.class : ''}${metadata?.pool.asset.subClass ? ` - ${metadata.pool.asset.subClass}` : '-'}`
  const metadataShareClass = shareClassId ? metadata?.shareClasses[shareClassId.toString()] : undefined
  const apyPercentage = shareClass?.details.apyPercentage || metadataShareClass?.apyPercentage
  const apy = shareClass?.details.apy || metadataShareClass?.apy
  const underlyingAssetAddress = investment?.share.address

  const getExplorerUrl = (centrifugeId: number) => {
    const chainId = blockchainsMap?.get(centrifugeId)?.chainId
    return chainId ? chainExplorer[chainId] : undefined
  }

  const items = [
    { label: 'Asset type', value: assetType },
    { label: 'APY', value: apyPercentage ? `${apyPercentage}%` : null },
    { label: 'Average asset maturity', value: apy },
    { label: 'Min. investment', value: formatBalance(shareClass?.details.minInitialInvestment ?? 0, { currency: 'USD' }) },
    { label: 'Investor type', value: metadata?.pool.investorType || 'Non-US Professional' },
    {
      label: 'Available networks',
      value: (
        <Flex gap={1}>
          {networks?.map((network, index) => {
            const explorerUrl = getExplorerUrl(network.centrifugeId)
            return (
              <Tooltip key={network.centrifugeId} content={<Text>View transactions</Text>}>
                <Link
                  to={underlyingAssetAddress && explorerUrl ? `${explorerUrl}/token/${underlyingAssetAddress}` : ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: '-10px' }}
                >
                  <NetworkIcon key={index} centrifugeId={network.centrifugeId} />
                </Link>
              </Tooltip>
            )
          })}
        </Flex>
      ),
    },
    { label: 'Pool structure', value: poolDetails?.metadata?.pool.poolStructure || 'Unknown' },
    {
      label: ' Rating',
      value:
        metadata?.pool?.poolRatings && metadata?.pool?.poolRatings[0]?.value ? (
          <Flex alignItems="center" justifyContent="flex-end">
            {metadata?.pool.poolRatings?.map((rating) => {
              const agency = getAgencyNormalisedName(rating.agency)
              const normalisedRating = {
                ...rating,
                agency,
              }
              return (
                <Box ml={2} key={rating.agency}>
                  <RatingPill rating={normalisedRating} />
                </Box>
              )
            })}
          </Flex>
        ) : null,
    },
    // Todo: expense ratio in the future would come from onchain and not metadata
    { label: 'Expense ratio', value: (poolDetails?.metadata?.pool as any)?.expenseRatio || 'Unknown' },
    // TODO: add back when chronicle integration is working
    // {
    //   label: 'Verified by',
    //   value: getIsChroniclePool(poolId) ? <ChronicleBadge /> : null,
    // },
  ]

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Overview
      </Heading>

      <Box
        bg="bg.solid"
        width="100%"
        padding={{ base: 6, md: 8 }}
        borderRadius={10}
        border="1px solid"
        borderColor="border.solid"
        shadow="xs"
      >
        {items
          .filter((i) => !!i.value)
          .map((item) => (
            <Flex key={item.label} justifyContent="space-between" alignItems="center" mb={4} _last={{ mb: 0 }}>
              <Text fontWeight={500} fontSize="0.75rem" lineHeight="100%" color="fg.muted">
                {item.label}
              </Text>
              {typeof item.value === 'string' ? (
                <Text fontWeight={600} fontSize="0.75rem" lineHeight="100%" color="fg.solid" textAlign="right">
                  {item.value}
                </Text>
              ) : (
                item.value
              )}
            </Flex>
          ))}
      </Box>
    </>
  )
}
