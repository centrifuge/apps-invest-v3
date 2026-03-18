import { useCallback } from 'react'
import { base } from 'viem/chains'
import { useWalletClient } from 'wagmi'
import centrifugeLogo from '@assets/logos/centrifuge-logo-lg.svg'
import { ALL_CHAINS, useAddress } from '@cfg'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { Widget, type TxData } from '@kyberswap/widgets'
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'

const BASE_CHAIN_ID = base.id
const USDC_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
const DESPXA_BASE = '0x9c5C365e764829876243d0b289733B9D2b729685'
// TODO: remove deJAAA token after testing
const DEJAA_BASE = '0xaaa0008c8cf3a7dca931adaf04336a5d808c82cc'

const USDC_TOKEN = {
  name: 'USD Coin',
  symbol: 'USDC',
  address: USDC_BASE,
  decimals: 6,
  logoURI:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  chainId: BASE_CHAIN_ID,
}

const POOL_TOKENS: Record<string, { name: string; symbol: string; address: string; decimals: number }> = {
  '281474976710659': { name: 'deJAAA', symbol: 'deJAAA', address: DEJAA_BASE, decimals: 18 },
  '281474976710668': { name: 'deSPXA Token', symbol: 'deSPXA', address: DESPXA_BASE, decimals: 18 },
}

const kyberTheme = {
  primary: '#FFFFFF',
  secondary: '#F5F5F5',
  dialog: '#FFFFFF',
  borderRadius: '10px',
  buttonRadius: '8px',
  stroke: '#FFFFFF',
  interactive: '#FFFFFF',
  accent: '#FFC012',
  success: '#31C48D',
  warning: '#FF9901',
  error: '#FF537B',
  text: '#252B34',
  subText: '#6B6B6B',
  fontFamily: 'Inter',
  boxShadow: 'none',
}

export function KyberSwapWidget({ poolId }: { poolId: string }) {
  const { address, chainId: connectedChainId } = useAddress()
  const { data: walletClient } = useWalletClient()
  const { open } = useAppKit()
  const { switchNetwork } = useAppKitNetwork()

  const poolToken = POOL_TOKENS[poolId]
  const tokenList = poolToken
    ? [
        USDC_TOKEN,
        {
          ...poolToken,
          logoURI: centrifugeLogo,
          chainId: BASE_CHAIN_ID,
        },
      ]
    : [USDC_TOKEN]
  const defaultTokenOut = poolToken?.address ?? USDC_BASE

  const handleSubmitTx = useCallback(
    async (txData: TxData): Promise<string> => {
      if (!walletClient || !address) {
        await open()
        throw new Error('Wallet not connected')
      }

      const hash = await walletClient.sendTransaction({
        to: txData.to as `0x${string}`,
        value: BigInt(txData.value),
        data: txData.data as `0x${string}`,
        gas: BigInt(txData.gasLimit),
      })

      return hash
    },
    [walletClient, address, open]
  )

  const handleSwitchChain = useCallback(() => {
    const baseNetwork = ALL_CHAINS.find((c) => Number(c.id) === BASE_CHAIN_ID)
    if (baseNetwork) {
      switchNetwork(baseNetwork)
    }
  }, [switchNetwork])

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
          Acquire pool tokens on the secondary market via Base network.
        </Text>
      </Box>
      <Flex p={4} justify="center">
        <Widget
          client="centrifuge"
          tokenList={tokenList}
          theme={kyberTheme}
          chainId={BASE_CHAIN_ID}
          defaultTokenIn={USDC_BASE}
          defaultTokenOut={defaultTokenOut}
          connectedAccount={{
            address,
            chainId: connectedChainId ?? BASE_CHAIN_ID,
          }}
          onSubmitTx={handleSubmitTx}
          onSwitchChain={handleSwitchChain}
          enableRoute
        />
      </Flex>
    </Flex>
  )
}
