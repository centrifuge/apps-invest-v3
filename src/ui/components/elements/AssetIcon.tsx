import React from 'react'
import { Image, type ImageProps, Flex, Heading, Box, Text } from '@chakra-ui/react'
import usdc from '../../assets/logos/usdc.svg'
import usdt from '../../assets/logos/usdt.svg'
import bitcoin from '../../assets/logos/bitcoin.svg'
import frax from '../../assets/logos/frax.svg'
import pUSD from '../../assets/logos/plume.svg'

interface AssetIconProps extends Omit<ImageProps, 'src'> {
  assetSymbol?: AssetSymbol
  alt?: string
}

export type AssetSymbol = 'USDC' | 'USDT' | 'WBTC' | 'TFRAX' | 'PUSD'

export const AssetIcon: React.FC<AssetIconProps> = ({ assetSymbol, boxSize = '24px', alt, ...rest }) => {
  const iconMaps: Record<AssetSymbol, string> = {
    USDC: usdc,
    USDT: usdt,
    WBTC: bitcoin,
    TFRAX: frax,
    PUSD: pUSD,
  }

  const src = iconMaps[assetSymbol?.toUpperCase() as AssetSymbol]
  return src ? (
    <Image src={src} boxSize={boxSize} objectFit="contain" alt={alt ?? `${assetSymbol} logo`} {...rest} />
  ) : (
    <Box borderRadius={8} border="1px solid" borderColor="gray.200">
      <Text fontSize="10px" mx={1} my={1}>
        {assetSymbol}
      </Text>
    </Box>
  )
}

export const AssetIconText: React.FC<AssetIconProps> = ({ assetSymbol, boxSize = '24px', alt, ...rest }) => {
  return (
    <Flex alignItems="center" gap={2}>
      <AssetIcon assetSymbol={assetSymbol} boxSize={boxSize} alt={alt} {...rest} />
      <Heading size="sm">{assetSymbol}</Heading>
    </Flex>
  )
}
