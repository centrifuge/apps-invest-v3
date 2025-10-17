import { ReactNode, useState } from 'react'
import { Button, Text, Input, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../../ui/components/elements/Modal'

const meta: Meta<typeof Modal> = {
  title: 'UI/Elements/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
    },
    title: {
      control: { type: 'text' },
    },
    primaryActionText: {
      control: { type: 'text' },
    },
    isPrimaryActionLoading: {
      control: { type: 'boolean' },
    },
    isPrimaryActionDisabled: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
  },
  args: {
    onClose: () => console.log('Modal closed'),
    onPrimaryAction: () => console.log('Primary action clicked'),
  },
}

export default meta
type Story = StoryObj<typeof meta>

const ModalWrapper = ({ children, ...args }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        title="Example Modal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPrimaryAction={() => {
          console.log('Primary action clicked')
          setIsOpen(false)
        }}
      >
        {children}
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <Text>This is the default modal content. It demonstrates the basic modal functionality.</Text>
    </ModalWrapper>
  ),
  args: {
    title: 'Default Modal',
    primaryActionText: 'Save changes',
  },
}

export const WithoutPrimaryAction: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <Text>This modal doesn't have a primary action button, only the close button.</Text>
    </ModalWrapper>
  ),
  args: {
    title: 'Information Modal',
    onPrimaryAction: undefined,
  },
}

export const WithForm: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <VStack align="stretch">
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Name
          </Text>
          <Input placeholder="Enter your name" />
        </div>
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Email
          </Text>
          <Input placeholder="Enter your email" type="email" />
        </div>
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Message
          </Text>
          <Input placeholder="Enter your message" />
        </div>
      </VStack>
    </ModalWrapper>
  ),
  args: {
    title: 'Contact Form',
    primaryActionText: 'Submit',
  },
}

export const LoadingState: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <Text>This modal shows the loading state of the primary action button.</Text>
    </ModalWrapper>
  ),
  args: {
    title: 'Processing Request',
    primaryActionText: 'Processing...',
    isPrimaryActionLoading: true,
  },
}

export const DisabledPrimaryAction: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <Text>The primary action button is disabled until certain conditions are met.</Text>
    </ModalWrapper>
  ),
  args: {
    title: 'Confirmation Required',
    primaryActionText: 'Confirm',
    isPrimaryActionDisabled: true,
  },
}

export const LargeModal: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <VStack align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Large Modal Content
        </Text>
        <Text>
          This is a large modal that can accommodate more content. It's useful for complex forms, detailed information,
          or when you need more space to display data.
        </Text>
        <Text>
          You can add multiple sections, forms, tables, or any other components that require more screen real estate.
        </Text>
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Additional Form Field
          </Text>
          <Input placeholder="More form inputs can be added here" />
        </div>
      </VStack>
    </ModalWrapper>
  ),
  args: {
    title: 'Large Modal Example',
    primaryActionText: 'Save All Changes',
    size: 'lg',
  },
}

export const SmallModal: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <Text>This is a smaller modal for simple confirmations or brief messages.</Text>
    </ModalWrapper>
  ),
  args: {
    title: 'Confirm Action',
    primaryActionText: 'Confirm',
    size: 'sm',
  },
}

export const CustomPrimaryActionText: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <Text>This modal has custom text for the primary action button.</Text>
    </ModalWrapper>
  ),
  args: {
    title: 'Delete Item',
    primaryActionText: 'Delete Forever',
  },
}
