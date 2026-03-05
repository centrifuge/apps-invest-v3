import { useAppKit } from '@reown/appkit/react'
import type { Address } from 'viem'
import { Button, ButtonColorPalette, ButtonVariant } from '@ui'
import { useAddress } from '@cfg'

function truncateAddress(string: Address) {
  const first = string.slice(0, 7)
  const last = string.slice(-7)

  return `${first}...${last}`
}

export function WalletButton({
  colorPalette = ['black', 'black'],
  variant = ['solid', 'solid'],
}: {
  colorPalette?: ButtonColorPalette[]
  variant?: ButtonVariant[]
}) {
  const [connectedBtnColor, disconnectedBtnColor] = colorPalette
  const [connectedBtnVariant, disconnectedBtnVariant] = variant

  const { open } = useAppKit()
  const { isConnected, address } = useAddress()

  const handleConnect = () => {
    open()
  }

  const label = isConnected && address ? truncateAddress(address) : 'Connect wallet'
  const palette = isConnected ? connectedBtnColor : disconnectedBtnColor
  const v = isConnected ? connectedBtnVariant : disconnectedBtnVariant

  return (
    <Button
      onClick={handleConnect}
      label={label}
      colorPalette={palette}
      variant={v}
      bg="charcoal.700"
      _hover={{ bg: 'charcoal.600' }}
      rounded="3xl"
    />
  )
}
