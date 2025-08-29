import React from 'react'
import { Accordion, Box, Flex, Separator, Span } from '@chakra-ui/react'

type StatItem = {
  value: string
  title: React.ReactNode
  subtitle: React.ReactNode
  content: React.ReactNode
  defaultOpen?: boolean
  disabled?: boolean
}

type StatAccordionProps = {
  items: StatItem[]
  collapsible?: boolean
  unstyled?: boolean
}

export const AccordionList = ({ items, collapsible = true, unstyled = false }: StatAccordionProps) => {
  const defaultValue = items.filter((i) => i.defaultOpen).map((i) => i.value)

  return (
    <Accordion.Root
      collapsible={collapsible}
      defaultValue={defaultValue}
      border={unstyled ? 'none' : '1px solid'}
      multiple
    >
      {items.map((item, index) => (
        <Accordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          border={unstyled ? 'none' : 'inherit'}
          padding={unstyled ? '0' : 'inherit'}
          margin={unstyled ? '0' : 'inherit'}
        >
          {index !== 0 && <Separator mt={4} mb={4} />}
          <Accordion.ItemTrigger gap="8px" px="0" py="6px" alignItems="flex-start">
            <Accordion.ItemIndicator mt="2px" />
            <Flex flexDirection="column" w="full">
              <Span fontSize="sm">{item.title}</Span>
              <Span fontSize="2xl" fontWeight="extrabold">
                {item.subtitle}
              </Span>
            </Flex>
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody pt="8px">{item.content}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
