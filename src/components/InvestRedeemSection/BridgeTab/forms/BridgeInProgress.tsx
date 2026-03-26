import type { Dispatch, SetStateAction } from 'react'
import { IoMdTimer } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { RiCheckboxCircleLine, RiExternalLinkLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { BridgeAction, type BridgeActionType } from '@components/InvestRedeemSection/components/defaults'
import { useFormContext } from '@forms'

export interface BridgeProgress {
  explorerUrl?: string
  estimatedTime?: string
  steps: BridgeStep[]
}

export interface BridgeStep {
  label: string
  status: 'completed' | 'active' | 'pending'
  timeEstimate?: string
  progress?: number
}

const defaultSteps: BridgeStep[] = [
  { label: 'Approving tokens', status: 'pending' },
  { label: 'Confirmation on source chain', status: 'pending' },
  { label: 'Sending over bridge', status: 'pending', timeEstimate: '±10 - 20 minutes' },
  { label: 'Minting on destination chain', status: 'pending' },
]

interface BridgeInProgressProps {
  setActionType: Dispatch<SetStateAction<BridgeActionType>>
  progress?: BridgeProgress
}

export function BridgeInProgress({ setActionType, progress }: BridgeInProgressProps) {
  const { reset } = useFormContext()
  const steps = progress?.steps ?? defaultSteps

  const handleClose = () => {
    reset()
    setActionType(BridgeAction.BRIDGE_FORM)
  }

  return (
    <Box height="100%">
      <Flex direction="column" gap={4} height="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md">Bridge in progress</Heading>
          <Icon size="lg" cursor="pointer" onClick={handleClose}>
            <IoClose />
          </Icon>
        </Flex>

        <Box bg="bg.info" border="1px solid" borderColor="border.info" borderRadius="lg" p={3.5}>
          <Flex gap={3}>
            <Icon size="lg" color="fg.warning" flexShrink={0} mt={0.5}>
              <IoMdTimer />
            </Icon>
            <Box>
              <Text fontWeight={600} fontSize="sm" mb={1}>
                Bridge in progress
              </Text>
              <Text fontSize="sm" color="fg.muted" mb={2}>
                Your bridge has been submitted to the blockchain.
                {progress?.estimatedTime && ` Estimated time remaining: ${progress.estimatedTime}.`}
              </Text>
              {progress?.explorerUrl && (
                <>
                  <Box borderTop="1px solid" borderColor="border.info" my={2} />
                  <Flex alignItems="center" gap={1} fontSize="sm" fontWeight={500}>
                    <Link to={progress.explorerUrl} target="_blank" rel="noopener noreferrer">
                      View on block explorer
                      <RiExternalLinkLine size={16} />
                    </Link>
                  </Flex>
                </>
              )}
            </Box>
          </Flex>
        </Box>

        <Flex direction="column" gap={0}>
          {steps.map((step, index) => (
            <Box
              key={index}
              border="1px solid"
              borderColor="border.input"
              borderRadius="lg"
              px={3.5}
              py={3.5}
              mb={index < steps.length - 1 ? 4 : 0}
              opacity={step.status === 'pending' ? 0.5 : 1}
            >
              <Flex alignItems="center" gap={3}>
                <StepIcon step={step} index={index} />
                <Flex flex={1} alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" fontWeight={500}>
                    {step.label}
                  </Text>
                  {step.status === 'active' && step.timeEstimate && (
                    <Text fontSize="sm" color="fg.muted">
                      {step.timeEstimate}
                    </Text>
                  )}
                </Flex>
              </Flex>
              {step.status === 'active' && step.progress !== undefined && (
                <Box mt={3} h="6px" bg="bg.emphasized" borderRadius="full" overflow="hidden">
                  <Box
                    h="100%"
                    bg="yellow.solid"
                    borderRadius="full"
                    w={`${Math.min(step.progress, 100)}%`}
                    transition="width 0.3s ease"
                  />
                </Box>
              )}
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  )
}

function StepIcon({ step, index }: { step: BridgeStep; index: number }) {
  if (step.status === 'completed') {
    return (
      <Icon size="lg" color="green.solid">
        <RiCheckboxCircleLine />
      </Icon>
    )
  }

  // Active or pending: show step number
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      w="24px"
      h="24px"
      borderRadius="full"
      border="1px solid"
      borderColor={step.status === 'active' ? 'fg.solid' : 'border.input'}
      flexShrink={0}
    >
      <Text fontSize="xs" fontWeight={600}>
        {index + 1}
      </Text>
    </Flex>
  )
}
