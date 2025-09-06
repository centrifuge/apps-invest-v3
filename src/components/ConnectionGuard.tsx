import { useAddress } from '@cfg'
import { NetworkIcon } from '@ui'
import { Button, Menu, Stack, Text } from '@chakra-ui/react'
import { useAppKit } from '@reown/appkit/react'
import type { ReactNode } from 'react'
import { useChains, useSwitchChain } from 'wagmi'

type Props = {
  networks?: number[]
  children: ReactNode
  message?: string
}

export function ConnectionGuard({ networks, children, message = 'Unsupported network.' }: Props) {
  const { switchChain } = useSwitchChain()
  const chains = useChains()
  const { open } = useAppKit()
  const { isConnected, chainId } = useAddress()
  function getName(chainId: number) {
    const chain = chains.find((c) => c.id === chainId)
    return chain?.name || chainId.toString()
  }

  if (!isConnected || !chainId) {
    return (
      <Stack gap={2}>
        <Text>Connect to continue</Text>
        <Button data-testid="connection-guard-connect" onClick={() => open()}>
          Connect
        </Button>
      </Stack>
    )
  }

  if (!networks || networks.includes(chainId)) {
    return <>{children}</>
  }

  return (
    <Stack gap={2}>
      <Text>{message}</Text>
      {networks.length === 1 ? (
        <Button onClick={() => switchChain({ chainId: networks[0] })}>Switch to {getName(networks[0])}</Button>
      ) : (
        <Menu.Root positioning={{ placement: 'bottom-start' }}>
          <Menu.Trigger asChild>
            <Button>Switch network</Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              {networks.map((network) => (
                <Menu.Item
                  key={network}
                  value={String(network)}
                  onClick={() => {
                    switchChain({ chainId: network })
                  }}
                >
                  <NetworkIcon networkId={network} />
                  {getName(network)}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      )}
    </Stack>
  )
}
