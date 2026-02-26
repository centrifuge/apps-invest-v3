import { useAddress, useBlockchainsMapByChainId, ALL_CHAINS } from '@cfg'
import { NetworkIcon } from '@ui'
import { Button, Stack, Text } from '@chakra-ui/react'
import { useAppKit } from '@reown/appkit/react'
import { useAppKitNetwork } from '@reown/appkit/react'
import type { ReactNode } from 'react'

type Props = {
  chainId: number
  children: ReactNode
  message?: string
}

export function ConnectionGuard({ chainId, children, message = 'Unsupported network.' }: Props) {
  const { switchNetwork } = useAppKitNetwork()
  const { open } = useAppKit()
  const { isConnected, chainId: connectedChainId } = useAddress()
  const { data: blockchainsMap } = useBlockchainsMapByChainId()

  if (!isConnected || !connectedChainId) {
    return (
      <Stack gap={2}>
        <Text>Connect to continue</Text>
        <Button onClick={() => open()}>Connect</Button>
      </Stack>
    )
  }

  if (connectedChainId === chainId) {
    return <>{children}</>
  }

  const blockchain = blockchainsMap?.get(chainId)
  const networkName = blockchain?.name ?? String(chainId)
  const centrifugeId = blockchain?.centrifugeId

  const handleSwitch = () => {
    const targetNetwork = ALL_CHAINS.find((c) => Number(c.id) === chainId)
    if (targetNetwork) {
      switchNetwork(targetNetwork)
    }
  }

  return (
    <Stack gap={2}>
      <Text>{message}</Text>
      <Button onClick={handleSwitch}>
        <NetworkIcon centrifugeId={centrifugeId} />
        Switch to {networkName}
      </Button>
    </Stack>
  )
}
