import { base } from 'viem/chains'
import { chainExplorer, formatBalance } from '@cfg'
import { Flex, Heading, Image, Link, Spinner, Stack, Text } from '@chakra-ui/react'
import type { SwapStep, TokenDef } from '@hooks/useAeroSwap'
import { Button } from '@ui'
import aerodromeLogo from '../../assets/logos/aerodrome-logo.svg'

const BASE_EXPLORER = chainExplorer[base.id]

interface TransactionOverlayProps {
  swapStep: SwapStep
  fromTokenDef: TokenDef
  toTokenDef: TokenDef
  submittedSwap: { fromAmount: string; toAmount: string }
  swapTxHash: string | null
  onClose: () => void
}

export function TransactionOverlay({
  swapStep,
  fromTokenDef,
  toTokenDef,
  submittedSwap,
  swapTxHash,
  onClose,
}: TransactionOverlayProps) {
  return (
    <Flex direction="column" align="center" justify="center" minH="300px" gap={4} py={8}>
      {swapStep === 'swapping' && (
        <>
          <Spinner size="xl" color="yellow.500" borderWidth="3px" />
          <Heading size="md">Processing transaction</Heading>
        </>
      )}
      {swapStep === 'success' && (
        <>
          <Flex
            align="center"
            justify="center"
            w="64px"
            h="64px"
            borderRadius="full"
            border="3px solid"
            borderColor="green.400"
          >
            <Text fontSize="2xl" color="green.400">
              &#10003;
            </Text>
          </Flex>
          <Heading size="md">Transaction successful</Heading>
        </>
      )}
      {swapStep === 'error' && (
        <>
          <Flex
            align="center"
            justify="center"
            w="64px"
            h="64px"
            borderRadius="full"
            border="3px solid"
            borderColor="red.400"
          >
            <Text fontSize="2xl" color="red.400">
              &#10007;
            </Text>
          </Flex>
          <Heading size="md">Transaction failed</Heading>
        </>
      )}

      <Flex align="center" gap={2}>
        <Image src={fromTokenDef.icon} boxSize="20px" borderRadius="full" />
        <Text fontSize="sm" fontWeight="medium">
          {formatBalance(submittedSwap.fromAmount, { precision: fromTokenDef.decimals === 6 ? 2 : 6 })}
        </Text>
        <Text color="fg.muted">&#8594;</Text>
        <Image src={toTokenDef.icon} boxSize="20px" borderRadius="full" />
        <Text fontSize="sm" fontWeight="medium">
          {formatBalance(submittedSwap.toAmount, { precision: toTokenDef.decimals === 6 ? 2 : 6 })}
        </Text>
      </Flex>

      {swapStep === 'swapping' && (
        <Text fontSize="sm" color="fg.muted">
          Waiting for the transaction to be mined
        </Text>
      )}

      <Stack gap={2} width="100%" mt={4}>
        {swapTxHash && (
          <Flex justify="flex-end">
            <Link
              href={`${BASE_EXPLORER}/tx/${swapTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              color="yellow.700"
            >
              View transaction &#8599;
            </Link>
          </Flex>
        )}
        <Button
          label={swapStep === 'error' ? 'Try again' : 'Close'}
          colorPalette="yellow"
          borderRadius="3xl"
          width="100%"
          onClick={onClose}
        />
      </Stack>

      <Flex justify="center" align="center" gap={1.5} pt={1}>
        <Text fontSize="xs" color="fg.muted">
          Powered by
        </Text>
        <Image src={aerodromeLogo} height="16px" alt="Aerodrome" />
      </Flex>
    </Flex>
  )
}
