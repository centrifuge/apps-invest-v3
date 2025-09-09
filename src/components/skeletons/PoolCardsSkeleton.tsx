import { Grid, Skeleton } from '@chakra-ui/react'

export function PoolCardsSkeleton() {
  // TODO: Change to 6 with 2 rows of 3 after MVP is out
  const cards = Array.from(Array(3).keys())

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="6">
      {cards.map((_, index) => (
        <Skeleton key={index} height="292px" borderRadius="md" />
      ))}
    </Grid>
  )
}
