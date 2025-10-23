import type { PoolMetadata } from '@centrifuge/sdk'
import { Badge, Icon, Image, Text } from '@chakra-ui/react'
import { Tooltip } from '@ui'

import moodyLogo from '../../assets/logos/moody.svg'
import spLogo from '../../assets/logos/sp.svg'
import particulaLogo from '../../assets/logos/particula.svg'

type RatingsArray = NonNullable<PoolMetadata['pool']['poolRatings']>

type FirstRating = RatingsArray[0]

export const getAgencyNormalisedName = (agency: string | undefined): string => {
  switch (agency) {
    case "Moody's":
      return 'moody'
    case 'S&P Global':
      return 'sp'
    case 'Particula':
      return 'particula'
    default:
      return agency || ''
  }
}

const logos = [
  {
    agency: 'moody',
    logo: moodyLogo,
  },
  {
    agency: 'sp',
    logo: spLogo,
  },
  {
    agency: 'particula',
    logo: particulaLogo,
  },
]

export const RatingPill = ({ rating }: { rating: FirstRating }) => {
  const logo = logos.find((logo) => rating.agency?.toLowerCase().includes(logo.agency))
  if (!rating || !rating.agency || !rating.reportUrl) return null
  return (
    <Tooltip content={<Text>View rating</Text>}>
      <a href={rating.reportUrl ?? ''} target="_blank" rel="noopener noreferrer">
        <Badge variant="outline" py={3} px={2}>
          <Icon>
            <Image src={logo?.logo || spLogo} alt={rating.agency} />
          </Icon>
          <Text fontSize="xs" color="fg.solid">
            {rating.value}
          </Text>
        </Badge>
      </a>
    </Tooltip>
  )
}
