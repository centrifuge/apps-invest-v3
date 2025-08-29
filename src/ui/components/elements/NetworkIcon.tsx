import React from 'react'
import { Image, type ImageProps, Flex, Box } from '@chakra-ui/react'
import { Network, NETWORK_IDS } from '@cfg'

import EthereumSvg from '../../assets/logos/ethereum.svg'
import ArbitrumSvg from '../../assets/logos/arbitrum.svg'
import CeloSvg from '../../assets/logos/celo.svg'
import BaseSvg from '../../assets/logos/base.svg'
import PlumeSvg from '../../assets/logos/plume.svg'
import AvalancheSvg from '../../assets/logos/avalanche.svg'
import BnBSVG from '../../assets/logos/bnb.svg'

export const capitalizeNetworkName = (networkId: number): string => {
  return NETWORK_IDS[networkId].charAt(0).toUpperCase() + NETWORK_IDS[networkId].slice(1)
}

interface NetworkIconProps extends Omit<ImageProps, 'src'> {
  networkId?: number
  srcOverride?: string
  alt?: string
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({
  networkId = 1,
  srcOverride,
  boxSize = '24px',
  alt,
  ...rest
}) => {
  const localMap: Record<Network, string> = {
    ethereum: EthereumSvg,
    arbitrum: ArbitrumSvg,
    celo: CeloSvg,
    base: BaseSvg,
    plume: PlumeSvg,
    avalanche: AvalancheSvg,
    bnb: BnBSVG,
  }

  const resolvedNetwork = NETWORK_IDS[networkId] || 'ethereum'
  const src = srcOverride || localMap[resolvedNetwork]

  return <Image src={src} boxSize={boxSize} objectFit="contain" alt={alt ?? `${resolvedNetwork} logo`} {...rest} />
}

interface NetworkIconsProps {
  networkIds?: number[]
  boxSize?: string
}

export const NetworkIcons: React.FC<NetworkIconsProps> = ({ networkIds, boxSize = '24px' }) => {
  const resolvedNetworks = networkIds?.map((id) => NETWORK_IDS[id]).filter(Boolean) as Network[]

  if (!networkIds) return null

  return (
    <Flex role="group" align="center" className="group">
      {resolvedNetworks.map((network, i) => (
        <Box
          key={network}
          ml={i === 0 ? 0 : '-6px'}
          transition="margin-left 200ms ease"
          _groupHover={{ marginLeft: i === 0 ? 0 : '1px' }}
        >
          <NetworkIcon networkId={networkIds[i]} boxSize={boxSize} />
        </Box>
      ))}
    </Flex>
  )
}
