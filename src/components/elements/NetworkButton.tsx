import { NetworkIcon } from '@ui'
import { Box, Button, ButtonProps, Icon, Portal, VStack, useDisclosure } from '@chakra-ui/react'
import { useChains, useChainId, useSwitchChain } from 'wagmi'
import { useEffect, useRef } from 'react'
import { FaChevronDown } from 'react-icons/fa'

export function NetworkButton(props: ButtonProps) {
  const chains = useChains()
  const connectedChain = useChainId()
  const { switchChain } = useSwitchChain()
  const { open, onToggle, onClose } = useDisclosure()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        backgroundColor="white"
        variant="solid"
        onClick={onToggle}
        _hover={{ backgroundColor: 'gray.50' }}
        _active={{ backgroundColor: 'gray.100' }}
        data-testid="network-button"
        {...props}
      >
        <NetworkIcon networkId={connectedChain} />
        <Icon size="xs" textAlign="right" data-testid={`network-id-${connectedChain}`}>
          <FaChevronDown fill="#91969B" />
        </Icon>
      </Button>

      {open && (
        <Portal>
          <Box
            ref={dropdownRef}
            {...getDropdownPosition()}
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="lg"
            py={2}
            minW="120px"
          >
            <VStack gap={2} align="stretch">
              {chains
                .filter((chain) => chain.id !== connectedChain)
                .map((chain) => (
                  <Box
                    key={chain.id}
                    px={3}
                    py={2}
                    cursor="pointer"
                    _hover={{ backgroundColor: 'gray.50' }}
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
