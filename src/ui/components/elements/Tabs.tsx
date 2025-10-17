import type { CSSProperties } from 'react'
import { Tabs as ChakraTabs } from '@chakra-ui/react'

interface TabsProps extends ChakraTabs.RootProps {
  elements: {
    disabled?: boolean
    label: string
    value: string
    body: React.ReactNode
    style?: CSSProperties
  }[]
}

export const Tabs = ({ elements, ...rest }: TabsProps) => {
  const hasEnabledTabs = elements.some((element) => !element.disabled)

  return (
    <ChakraTabs.Root
      lazyMount
      unmountOnExit
      defaultValue={elements[0].value}
      colorPalette="yellow"
      size="lg"
      variant="line"
      h="100%"
      {...rest}
    >
      <ChakraTabs.List>
        {elements.map((element) => (
          <ChakraTabs.Trigger
            value={element.value}
            key={element.value}
            height="55px"
            alignItems="flex-end"
            disabled={element.disabled ?? false}
            _disabled={{
              borderBottom: 'none',
              borderBottomColor: 'transparent',
              _after: { display: 'none' },
              _before: { display: 'none' },
            }}
          >
            {element.label}
          </ChakraTabs.Trigger>
        ))}
        {hasEnabledTabs && <ChakraTabs.Indicator bg="fg.emphasized" height="2px" borderRadius="1px" bottom="0" />}
      </ChakraTabs.List>

      {elements.map((element) => (
        <ChakraTabs.Content
          key={element.value}
          value={element.value}
          h="calc(100% - 55px)"
          px={4}
          py={3}
          overflowY="hidden"
        >
          {element.body}
        </ChakraTabs.Content>
      ))}
    </ChakraTabs.Root>
  )
}
