import { Badge, Image, Text } from '@chakra-ui/react'
import ChronicleSvg from '../../assets/logos/chronicle.svg'

export function ChronicleBadge() {
  return (
    <Badge variant="outline" py={3} px={2}>
      <Image src={ChronicleSvg} boxSize="16px" objectFit="contain" alt="Chronicle-logo" />
      <Text fontSize="xs" ml={1} color="fg.solid">
        Chronicle
      </Text>
    </Badge>
  )
}
