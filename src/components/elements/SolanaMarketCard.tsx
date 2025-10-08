import { Box, Center, Heading, Link } from '@chakra-ui/react'
import { Card } from '@ui'
import { usePoolContext } from '@contexts/PoolContext'
import solanaIcon from '../../assets/kamino-solana-icons.svg'
import { Image } from '@chakra-ui/react'

export function SolanaMarketCard() {
  const { poolId } = usePoolContext()

  if (poolId !== '281474976710659') {
    return null
  }

  return (
    <Card>
      <Box textAlign="center">
        <Center>
          <Image src={solanaIcon} alt="Solana Market" mb={4} h="64px" fit="contain" />
        </Center>
        <Heading size="xl">deJAAA on Solana</Heading>
        <Link
          href="https://app.kamino.finance/swap/"
          fontSize="lg"
          color="fg.muted"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Kamino to find deJAAA on Solana
        </Link>
      </Box>
    </Card>
  )
}
