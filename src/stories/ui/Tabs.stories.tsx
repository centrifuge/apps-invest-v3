import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from '../../ui/components/elements/Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Elements/Tabs',
  component: Tabs,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    elements: [
      {
        label: 'Tab One',
        value: 'tab1',
        body: 'Content for Tab One',
      },
      {
        label: 'Tab Two',
        value: 'tab2',
        body: 'Content for Tab Two',
      },
    ],
  },
}

export const WithDisabledTab: Story = {
  args: {
    elements: [
      {
        label: 'Active Tab',
        value: 'active',
        body: 'This is an active tab that users can interact with.',
      },
      {
        label: 'Disabled Tab',
        value: 'disabled',
        disabled: true,
        body: "This content won't be accessible because the tab is disabled.",
      },
      {
        label: 'Another Active Tab',
        value: 'active2',
        body: 'This is another active tab.',
      },
    ],
  },
}
