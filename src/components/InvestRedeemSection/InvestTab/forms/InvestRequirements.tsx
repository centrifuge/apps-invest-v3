import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { useFormContext, Checkbox, SubmitButton } from '@forms'

const options = [
  { name: 'requirement_nonUsCitizen', label: 'I am a non-US citizen or entity' },
  { name: 'requirement_nonSanctionedList', label: 'I am not on a sanctioned list' },
  {
    name: 'requirement_redeemLater',
    label: 'I will KYC upon redeeming or sell over Uniswap or anther 3rd party market provider',
  },
]

export function InvestRequirements() {
  const { getValues, setValue } = useFormContext()
  const investorRequirements: boolean[] = getValues('investorRequirements')
  return (
    <Box>
      <Heading mt={4} mb={4}>
        Investor Requirements
      </Heading>
      <Text>In order to invest in the following token you need to confirm the following:</Text>
      <Flex flexDirection="column" gap={4} mt={4} mb={4}>
        {options.map((option, index) => (
          <Checkbox
            key={option.name}
            name={option.name}
            label={option.label}
            variant="outline"
            size="lg"
            onChange={(checked) => {
              const updatedRequirements = [...investorRequirements]
              updatedRequirements.splice(index, 1, checked)
              return setValue('investorRequirements', updatedRequirements)
            }}
          />
        ))}
      </Flex>
      <SubmitButton colorPalette="yellow" width="100%">
        Confirm
      </SubmitButton>
    </Box>
  )
}
