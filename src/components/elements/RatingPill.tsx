import { Badge, Icon, Image, Text } from '@chakra-ui/react'
import type { PoolMetadata } from '@centrifuge/sdk'

type RatingsArray = NonNullable<PoolMetadata['pool']['poolRatings']>

type FirstRating = RatingsArray[0]

import moodyLogo from '../../assets/logos/moody.svg'
import spLogo from '../../assets/logos/sp.svg'
import particulaLogo from '../../assets/logos/particula.svg'
import { Tooltip } from '@ui'

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
  if (!rating) return null
  return (
    <Tooltip content={<Text>View rating</Text>}>
      <a href={rating.reportUrl ?? ''} target="_blank" rel="noopener noreferrer">
        <Badge variant="outline">
          <Icon>
            <Image src={logo?.logo || spLogo} alt={rating.agency} />
          </Icon>
          <Text>{rating.value}</Text>
        </Badge>
      </a>
    </Tooltip>
  )
}
