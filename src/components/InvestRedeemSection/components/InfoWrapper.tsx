import { Flex, Heading, Icon } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { IoMdInformationCircleOutline } from 'react-icons/io'

interface InfoWrapperProps {
  text: string | ReactNode
  title?: string
  type?: 'info' | 'error'
  icon?: React.ReactNode
}

export const InfoWrapper = ({ text, title, icon, type = 'info' }: InfoWrapperProps) => {
  return (
    <Flex mt={4} border="1px solid" borderColor={type} borderRadius={10} p={4}>
      <Icon size="lg" color={type} mr={2}>
        {icon || <IoMdInformationCircleOutline />}
      </Icon>
      <Flex direction="column">
        <Heading fontSize="md" fontWeight="bold" color={type}>
          {title}
        </Heading>
        {typeof text === 'string' ? (
          <Heading fontSize="sm" color={type} lineHeight={1.5} whiteSpace="pre-wrap">
            {text}
          </Heading>
        ) : (
          text
        )}
      </Flex>
    </Flex>
  )
}
