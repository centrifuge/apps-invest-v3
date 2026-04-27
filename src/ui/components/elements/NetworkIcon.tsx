import React from 'react'
import { Image, type ImageProps, Flex, Box, Text } from '@chakra-ui/react'
import { useBlockchainByCentrifugeId } from '@cfg'
import PharosLogo from '@assets/logos/pharos.png'

// Fallback data for chains where the SDK doesn't provide data
const CHAIN_FALLBACKS: Record<number, { icon: string; name: string }> = {
  97: {
    icon: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    name: 'BNB Smart Chain Testnet',
  },
  998: {
    icon: 'https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg',
    name: 'Hyperliquid EVM Testnet',
  },
}

// Fallback data keyed by Centrifuge ID for chains the indexer hasn't populated yet.
const CENTRIFUGE_ID_FALLBACKS: Record<number, { icon: string; name: string }> = {
  12: { icon: PharosLogo, name: 'Pharos Mainnet' },
}

interface NetworkIconProps extends Omit<ImageProps, 'src'> {
  centrifugeId?: number
  chainId?: number
  srcOverride?: string
  alt?: string
  withLabel?: boolean
  labelGap?: number
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({
  centrifugeId,
  chainId,
  srcOverride,
  boxSize = '24px',
  alt,
  withLabel = false,
  labelGap = 2,
  ...rest
}) => {
  const { data: blockchain } = useBlockchainByCentrifugeId(centrifugeId)

  const chainFallback = chainId ? CHAIN_FALLBACKS[chainId] : undefined
  const centrifugeFallback = centrifugeId !== undefined ? CENTRIFUGE_ID_FALLBACKS[centrifugeId] : undefined
  const networkName = blockchain?.name || chainFallback?.name || centrifugeFallback?.name
  const networkIcon = blockchain?.icon
  const src = srcOverride || networkIcon || chainFallback?.icon || centrifugeFallback?.icon || undefined

  if (!withLabel) {
    return src ? (
      <Image
        src={src}
        boxSize={boxSize}
        objectFit="contain"
        alt={alt ?? `${networkName} logo`}
        {...rest}
        display="inline-block"
      />
    ) : (
      <Box
        as="span"
        borderRadius={8}
        border="1px solid"
        borderColor="border.solid"
        height={boxSize}
        width={boxSize}
        backgroundColor="bg.muted"
        display="inline-block"
      />
    )
  }

  return (
    <Flex alignItems="center" gap={labelGap} display="inline-flex">
      {src ? (
        <Image
          src={src}
          boxSize={boxSize}
          objectFit="contain"
          alt={alt ?? `${networkName} logo`}
          {...rest}
          display="inline-block"
        />
      ) : (
        <Box
          as="span"
          borderRadius={8}
          border="1px solid"
          borderColor="border.solid"
          height={boxSize}
          width={boxSize}
          backgroundColor="bg.muted"
          display="inline-block"
        />
      )}
      {withLabel && networkName && (
        <Text fontSize={rest.fontSize ?? 'inherit'} fontWeight={rest.fontWeight ?? 'inherit'} as="span">
          {networkName}
        </Text>
      )}
    </Flex>
  )
}

interface NetworkIconsProps {
  centrifugeIds?: number[]
  boxSize?: string
}

export const NetworkIcons: React.FC<NetworkIconsProps> = ({ centrifugeIds, boxSize = '24px' }) => {
  if (!centrifugeIds || centrifugeIds.length === 0) return null

  return (
    <Flex role="group" align="center" className="group">
      {centrifugeIds.map((centrifugeId, i) => (
        <Box
          key={centrifugeId}
          ml={i === 0 ? 0 : '-6px'}
          transition="margin-left 200ms ease"
          _groupHover={{ marginLeft: i === 0 ? 0 : '1px' }}
        >
          <NetworkIcon centrifugeId={centrifugeId} boxSize={boxSize} />
        </Box>
      ))}
    </Flex>
  )
}

interface NetworkNameProps {
  centrifugeId?: number
}

export const NetworkName: React.FC<NetworkNameProps> = ({ centrifugeId }) => {
  const { data: blockchain } = useBlockchainByCentrifugeId(centrifugeId)
  const fallback = centrifugeId !== undefined ? CENTRIFUGE_ID_FALLBACKS[centrifugeId] : undefined
  return <>{blockchain?.name ?? fallback?.name ?? '-'}</>
}
