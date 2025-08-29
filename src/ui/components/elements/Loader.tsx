import { Spinner, Text, VStack } from '@chakra-ui/react'

// TODO: add better loading component
export const Loader = () => {
  return (
    <VStack mt={10}>
      <Spinner />
      <Text>Loading...</Text>
    </VStack>
  )
}
