import type { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { RiCheckboxCircleLine, RiExternalLinkLine } from 'react-icons/ri'
import { truncateAddress } from '@cfg'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { BridgeAction, type BridgeActionType } from '@components/InvestRedeemSection/components/defaults'
import { useFormContext } from '@forms'
import { SummaryRow } from '../components/SummaryRow'

export interface BridgeSuccessData {
  asset: string
  assetAmount: string
  fromChainName: string
  toChainName: string
  recipientAddress: string
  sourceTx?: {
    chainName: string
    hash: string
    explorerUrl: string
  }
  destinationTx?: {
    chainName: string
    hash: string
    explorerUrl: string
  }
}

interface BridgeSuccessProps {
  setActionType: Dispatch<SetStateAction<BridgeActionType>>
  data?: BridgeSuccessData
}

export function BridgeSuccess({ setActionType, data }: BridgeSuccessProps) {
  const { reset } = useFormContext()

  const handleDismiss = () => {
    reset()
    setActionType(BridgeAction.BRIDGE_FORM)
  }

  return (
    <Box height="100%">
      <Flex direction="column" justifyContent="space-between" height="100%">
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={6}>
            <Heading size="md">Bridge successful</Heading>
            <Icon size="lg" color="green.solid">
              <RiCheckboxCircleLine />
            </Icon>
          </Flex>

          <Box px={1} mb={6}>
            <SummaryRow label="Asset" value={data?.asset ?? '—'} />
            <SummaryRow label="Asset amount" value={data?.assetAmount ?? '—'} />
            <SummaryRow label="From chain" value={data?.fromChainName ?? '—'} />
            <SummaryRow label="To chain" value={data?.toChainName ?? '—'} />
            <SummaryRow
              label="Recipient address"
              value={data?.recipientAddress ? truncateAddress(data.recipientAddress) : '—'}
            />
          </Box>

          <Box border="1px solid" borderColor="border.input" borderRadius="lg" p={5}>
            {data?.sourceTx && (
              <Box mb={data.destinationTx ? 6 : 0}>
                <Text fontSize="sm" fontWeight={500} mb={2}>
                  Source chain transaction
                </Text>
                <TxCard
                  chainName={data.sourceTx.chainName}
                  hash={data.sourceTx.hash}
                  explorerUrl={data.sourceTx.explorerUrl}
                />
              </Box>
            )}

            {data?.destinationTx && (
              <Box>
                <Text fontSize="sm" fontWeight={500} mb={2}>
                  Destination chain transaction
                </Text>
                <TxCard
                  chainName={data.destinationTx.chainName}
                  hash={data.destinationTx.hash}
                  explorerUrl={data.destinationTx.explorerUrl}
                />
              </Box>
            )}

            {!data?.sourceTx && !data?.destinationTx && (
              <Text fontSize="sm" color="fg.muted">
                Transaction details will be available once the bridge is complete.
              </Text>
            )}
          </Box>
        </Box>

        <Box mt={6}>
          <Button variant="outline" width="100%" borderRadius="3xl" onClick={handleDismiss}>
            Dismiss
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}

function TxCard({ chainName, hash, explorerUrl }: { chainName: string; hash: string; explorerUrl: string }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      border="1px solid"
      borderColor="border.input"
      borderRadius="md"
      px={3.5}
      py={2.5}
    >
      <Text fontSize="sm" fontWeight={500}>
        {chainName}
      </Text>
      <Flex alignItems="center" gap={1} color="fg.muted" _hover={{ color: 'fg.solid' }} transition="color 0.15s">
        <Link to={explorerUrl} target="_blank" rel="noopener noreferrer">
          <Text fontSize="sm">{truncateAddress(hash, 10, 6)}</Text>
          <RiExternalLinkLine size={16} />
        </Link>
      </Flex>
    </Flex>
  )
}
