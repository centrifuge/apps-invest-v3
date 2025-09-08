import { Button, MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'
import { useTenderly, type TransactionMode } from '@contexts/TenderlyContext'

interface TransactionModeSelectorProps {
  onInvest: () => void
  disabled?: boolean
  children: React.ReactNode
}

export function TransactionModeSelector({ onInvest, disabled, children }: TransactionModeSelectorProps) {
  const { transactionMode, setTransactionMode, isTransactionModeAvailable, isLoading } = useTenderly()

  const handleModeSelect = (mode: TransactionMode) => {
    setTransactionMode(mode)
    onInvest()
  }

  // If transaction mode switching is not available, render a simple button
  if (!isTransactionModeAvailable) {
    return (
      <Button colorPalette="yellow" width="100%" disabled={disabled} onClick={onInvest} mt={6}>
        {children}
      </Button>
    )
  }

  // Show current mode in button text
  const getModeLabel = (mode: TransactionMode) => {
    switch (mode) {
      case 'sepolia':
        return 'Sepolia Testnet'
      case 'tenderly':
        return 'Tenderly Fork'
      default:
        return 'Unknown'
    }
  }

  const getCurrentModeIcon = () => {
    switch (transactionMode) {
      case 'sepolia':
        return '🌐'
      case 'tenderly':
        return '🔧'
      default:
        return ''
    }
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button colorPalette="yellow" width="100%" disabled={disabled || isLoading} mt={6} icon={<FaChevronDown />}>
          {getCurrentModeIcon()} {children} ({getModeLabel(transactionMode)})
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          onClick={() => handleModeSelect('sepolia')}
          bg={transactionMode === 'sepolia' ? 'yellow.100' : 'transparent'}
        >
          🌐 Use Sepolia Testnet
        </MenuItem>
        <MenuItem
          onClick={() => handleModeSelect('tenderly')}
          bg={transactionMode === 'tenderly' ? 'yellow.100' : 'transparent'}
          disabled={isLoading}
        >
          🔧 Use Tenderly Fork {isLoading ? '(Loading...)' : ''}
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}
