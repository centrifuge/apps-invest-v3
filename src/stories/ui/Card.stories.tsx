import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../../ui/components/elements/Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Elements/Card',
  component: Card,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Simple card content',
  },
}

export const WithHeader: Story = {
  args: {
    header: 'Card Title',
    children: 'This card has a header with a title.',
  },
}

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    header: 'Elevated Card',
    children: 'This card uses the elevated variant for a raised appearance.',
  },
}
