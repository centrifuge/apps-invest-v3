import { Box, Flex, Grid, GridItem, Heading, Image, Text } from '@chakra-ui/react'
import { ipfsToHttp } from '@cfg'
import { LinkPill } from '@components/pools/poolDetails/PoolKeyFacts/LinkPill'
import { usePoolContext } from '@contexts/PoolContext'

const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY

export function PoolKeyFacts() {
  const { poolDetails } = usePoolContext()
  const metadata = poolDetails?.metadata
  const factKeys = metadata?.pool.issuer.categories ?? []

  return (
    <>
      <Heading size="lg" mt={8} mb={4}>
        Key facts
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
        <Grid templateColumns={{ base: '1fr', md: '1fr 5fr' }} gap={2}>
          <Flex justifyContent="flex-start" alignItems="center" gap={2} flexDirection={{ base: 'column', md: 'row' }}>
            <Box width={20} mb={{ base: 2, md: 0 }}>
              <Image
                src={ipfsToHttp(metadata?.pool.issuer.logo?.uri ?? '', pinataGateway)}
                alt={metadata?.pool.issuer.name}
                height="2rem"
                fit="contain"
              />
            </Box>
          </Flex>

          <Flex
            justifyContent="flex-end"
            alignItems="center"
            gap={2}
            flexDirection={{ base: 'column', md: 'row' }}
            wrap="wrap"
          >
            {[
              { label: 'Website', href: metadata?.pool.links?.website ?? '' },
              { label: 'Forum', href: metadata?.pool.links?.forum ?? '' },
              { label: 'Email', href: `mailto:${metadata?.pool.issuer.email}` },
              { label: 'Summary', href: ipfsToHttp(metadata?.pool.links?.executiveSummary?.uri ?? '', pinataGateway) },
            ].map((link) => (
              <LinkPill key={link.label} label={link.label} href={link.href} />
            ))}
          </Flex>
        </Grid>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mt={8}>
          <GridItem colSpan={factKeys.length ? 1 : 2}>
            <Flex
              flexDirection="column"
              alignItems={{ base: 'center', md: 'flex-start' }}
              justifyContent={{ base: 'center', md: 'flex-start' }}
              gap={{ base: 0, md: 4 }}
            >
              <Heading
                fontWeight="600"
                lineHeight={'125%'}
                size="xl"
                position="relative"
                _after={{
                  content: '" "',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '54px',
                  height: '2px',
                  bg: 'yellow.500',
                }}
              >
                {metadata?.pool.issuer.name || 'Pool'}
              </Heading>
              <Text fontSize="14px" color="gray.500" fontWeight={400} lineHeight={'160%'} mt={3}>
                {metadata?.pool.issuer.description.replace(/"/g, '') || 'No description available'}
              </Text>
            </Flex>
          </GridItem>
          <GridItem colSpan={factKeys.length ? 1 : 0}>
            <Box bg="bg.solid" shadow="xs" boxShadow="none" pt={4}>
              {factKeys.map((item) => (
                <Flex justifyContent="space-between" alignItems="center" mt={4} key={item.type}>
                  <Text fontWeight={500} fontSize="14px" lineHeight="100%" color="gray.500">
                    {item.type}
                  </Text>
                  <Text fontWeight={600} fontSize="14px" lineHeight="100%" color="gray.800" textAlign="right">
                    {item.value}
                  </Text>
                </Flex>
              ))}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  )
}
