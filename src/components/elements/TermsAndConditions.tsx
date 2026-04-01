import { Box, Heading, Text } from '@chakra-ui/react'
import { usePoolContext } from '@contexts/PoolContext'

export function TermsAndConditions() {
  const { poolDetails } = usePoolContext()
  const details = poolDetails?.metadata?.pool.details

  if (!details?.length) {
    return null
  }

  return (
    <>
      {details.map((detail, index) => (
        <Box key={index}>
          <Heading size="lg" mt={8} mb={4}>
            {detail.title}
          </Heading>

          <Box
            bg="bg.solid"
            width="100%"
            padding={6}
            borderRadius={10}
            border="1px solid"
            borderColor="border.solid"
            shadow="xs"
          >
            <Text color="fg.muted" fontSize="sm" whiteSpace="pre-line">
              {detail.body}
            </Text>
          </Box>
        </Box>
      ))}
    </>
  )
}
