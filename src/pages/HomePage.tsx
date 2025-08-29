import { Flex, Heading, Separator, Spinner } from '@chakra-ui/react'
import { PoolCardsSelect } from '@components/pools/PoolsDetails/PoolCardsSelect'
import { PoolsTvlCard } from '@components/pools/PoolsDetails/PoolsTvlCard'
import { usePoolContext } from '@contexts/usePoolContext'

export default function HomePage() {
  const { pools, isPoolsLoading, setSelectedPoolId } = usePoolContext()
  const poolIds = pools?.map((p) => p.id) ?? []

  if (isPoolsLoading) {
    return <Spinner size="lg" />
  }

  if (!poolIds?.length) return <h3>Sorry, there are no pools available at this time.</h3>

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" wrap="wrap" gap={6} my={16}>
        <Heading as="h1" size="5xl">
          Access Tokenized
          <br />
          Assets on Centrifuge
        </Heading>
        <PoolsTvlCard poolIds={poolIds} />
      </Flex>
      <Separator mb={8} />
      <PoolCardsSelect poolIds={poolIds} setSelectedPoolId={setSelectedPoolId} />
    </>
  )
}
