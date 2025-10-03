import { type Dispatch, type SetStateAction } from 'react'
import { IoMdTimer } from 'react-icons/io'
import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { useFormContext } from '@forms'
import { RedeemAction, type RedeemActionType } from '@components/InvestRedeemSection/components/defaults'

interface RedeemTxCancelledProps {
  currencies: { redeemCurrency: string; receiveCurrency: string }
  setActionType: Dispatch<SetStateAction<RedeemActionType>>
}

export function RedeemTxCancelled({
  currencies: { redeemCurrency, receiveCurrency },
  setActionType,
}: RedeemTxCancelledProps) {
  const { getValues } = useFormContext()
  const { reset } = useFormContext()

  return (
    <Box height="100%">
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        gap={2}
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Box width="100%" overflow="hidden">
          <Flex alignItems="center" gap={2} justifyContent="space-between">
            <Heading>Redemption cancelled</Heading>
            <Icon size="xl">
              <IoMdTimer color="fg.subtle" />
            </Icon>
          </Flex>
          <Box opacity={0.5}>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6} width="100%">
              <Box>
                <Text fontWeight={500}>You cancelled redeeming</Text>
                <Heading fontSize="lg">{getValues('redeemAmount').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{redeemCurrency}</Text>
            </Flex>
            <Flex alignItems="center" gap={2} justifyContent="space-between" mt={6}>
              <Box>
                <Text fontWeight={500}>You would have received</Text>
                <Heading fontSize="lg">{getValues('receiveAmount').toString()}</Heading>
              </Box>
              <Text alignSelf="flex-end">{receiveCurrency}</Text>
            </Flex>
          </Box>
        </Box>
        <Button
          colorPalette="yellow"
          type="button"
          mb={4}
          onClick={() => {
            reset()
            setActionType(RedeemAction.REDEEM_AMOUNT)
          }}
          width="100%"
          mt={4}
        >
          Redeem again
        </Button>
      </Flex>
    </Box>
  )
}
