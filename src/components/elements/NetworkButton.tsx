import { useEffect, useRef, useMemo } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useChains, useChainId, useSwitchChain } from 'wagmi'
import { Box, Button, ButtonProps, Icon, Image, Portal, VStack, useDisclosure } from '@chakra-ui/react'
import { useDebugFlags } from '@cfg'
import { useWalletConnection } from '@wallet/useWalletConnection'
import { NetworkIcon } from '@ui'
import SolanaSVG from '../../assets/logos/solana.svg'

// Mainnet chain IDs
const MAINNET_CHAIN_IDS = [
  1, // Ethereum
  8453, // Base
  42161, // Arbitrum
  43114, // Avalanche
  42220, // Celo
  56, // BSC
]

// Testnet chain IDs
const TESTNET_CHAIN_IDS = [
  11155111, // Sepolia
  84532, // Base Sepolia
  421612, // Arbitrum Sepolia
  431142, // Avalanche Fuji
  11142220, // Celo Alfajores
  97, // BSC Testnet
]

export function NetworkButton(props: ButtonProps) {
  const allChains = useChains()
  const { showMainnet } = useDebugFlags()
  const { walletType } = useWalletConnection()
  const connectedChain = useChainId()
  const { switchChain } = useSwitchChain()
  const { open, onToggle, onClose } = useDisclosure()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const chains = useMemo(() => {
    const isMainnet = showMainnet || import.meta.env.VITE_CENTRIFUGE_ENV === 'mainnet'
    const allowedChainIds = isMainnet ? MAINNET_CHAIN_IDS : TESTNET_CHAIN_IDS
    return allChains.filter((chain) => allowedChainIds.includes(chain.id))
  }, [allChains, showMainnet])

  const handleChainSwitch = (chainId: number) => {
    switchChain({ chainId })
    onClose()
  }

  const getDropdownPosition = () => {
    if (!buttonRef.current) return {}

    const rect = buttonRef.current.getBoundingClientRect()
    return {
      position: 'fixed' as const,
      top: rect.bottom + 4,
      left: rect.left,
      zIndex: 1000,
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose])

  return (
    <>
      <Button
        ref={buttonRef}
        backgroundColor="bg.solid"
        variant="solid"
        onClick={onToggle}
        _hover={{ backgroundColor: 'bg.subtle' }}
        _active={{ backgroundColor: 'bg.subtle' }}
        {...props}
      >
        {walletType === 'solana' ? (
          <Image src={SolanaSVG} boxSize="24px" objectFit="contain" alt="Solana logo" />
        ) : (
          <>
            <NetworkIcon networkId={connectedChain} />
            <Icon size="xs" textAlign="right">
              <FaChevronDown fill="#91969B" />
            </Icon>
          </>
        )}
      </Button>

      {open && walletType !== 'solana' && (
        <Portal>
          <Box
            ref={dropdownRef}
            {...getDropdownPosition()}
            backgroundColor="bg.solid"
            border="1px solid"
            borderColor="border.input"
            borderRadius="md"
            boxShadow="lg"
            py={2}
            minW="120px"
          >
            <VStack gap={2} align="stretch">
              {chains
                .filter((chain) => connectedChain && chain.id !== connectedChain)
                .map((chain) => (
                  <Box
                    key={chain.id}
                    px={3}
                    py={2}
                    cursor="pointer"
                    _hover={{ backgroundColor: 'bg.subtle' }}
                    onClick={() => handleChainSwitch(chain.id)}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <NetworkIcon networkId={chain.id} />
                    <Box fontSize="sm">{chain.name}</Box>
                  </Box>
                ))}
            </VStack>
          </Box>
        </Portal>
      )}
    </>
  )
}
