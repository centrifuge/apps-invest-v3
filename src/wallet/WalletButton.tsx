import { useAppKit } from '@reown/appkit/react'
import type { Address } from 'viem'
import { Button, ButtonColorPalette, ButtonVariant } from '@ui'
import { useAddress } from '@cfg'

function truncateAddress(string: Address) {
  const first = string.slice(0, 7)
  const last = string.slice(-7)

  return `${first}...${last}`
}

export const WalletButton = ({
  colorPalette = ['yellow', 'gray'],
  variant = ['solid', 'solid'],
}: {
  colorPalette?: ButtonColorPalette[]
  variant?: ButtonVariant[]
}) => {
  const [connectedBtnColor, disconnectedBtnColor] = colorPalette
  const [connectedBtnVariant, disconnectedBtnVariant] = variant

  const { open } = useAppKit()
  const { isConnected, address } = useAddress()

  const handleConnect = () => {
    open()
  }

  return isConnected && address ? (
    <Button
      onClick={handleConnect}
      label={truncateAddress(address)}
      colorPalette={connectedBtnColor}
      variant={connectedBtnVariant}
      data-testid="wallet-button"
    />
  ) : (
    <Button
      onClick={handleConnect}
      label="Connect wallet"
      colorPalette={disconnectedBtnColor}
      variant={disconnectedBtnVariant}
      data-testid="wallet-button"
    />
  )
}
