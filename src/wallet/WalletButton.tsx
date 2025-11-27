import { useAppKit } from '@reown/appkit/react'
import { truncateAddress } from '@cfg'
import { Button, ButtonColorPalette, ButtonVariant } from '@ui'
import { useWalletConnection } from './useWalletConnection'

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
  const { isConnected, address } = useWalletConnection()

  const handleConnect = () => {
    open()
  }

  const btnColorPalette = isConnected ? connectedBtnColor : disconnectedBtnColor
  const btnVariant = isConnected ? connectedBtnVariant : disconnectedBtnVariant
  const label = isConnected && address ? truncateAddress(address) : 'Connect wallet'

  return <Button onClick={handleConnect} label={label} colorPalette={btnColorPalette} variant={btnVariant} />
}
