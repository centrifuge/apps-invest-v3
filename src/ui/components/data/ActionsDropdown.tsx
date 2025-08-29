import { Button, ButtonProps, Menu, Portal } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FiMoreVertical } from 'react-icons/fi'

type MenuItem = {
  label: string
  element: ReactNode
}

const ActionsDropdown = ({ items, ...rest }: { items: MenuItem[] } & ButtonProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm" _hover={{ bg: 'transparent', boxShadow: 'none' }}>
          <FiMoreVertical />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {items.map((item, index) => (
              <Menu.Item
                key={index}
                value={item.label}
                _hover={{ bg: '#F9FAFB', cursor: 'pointer' }}
                style={{ minWidth: '200px', padding: '16px' }}
                asChild
              >
                {item.element}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export { ActionsDropdown }
