import { Box, Text, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../ui/components/elements/Button'

const ThemeDebugger = () => {
  const getCurrentFontFamily = () => {
    if (typeof window !== 'undefined') {
      try {
        return getComputedStyle(document.body).fontFamily
      } catch (e) {
        console.error(e)
        return 'Unable to detect'
      }
    }
    return 'N/A (SSR)'
  }

  return (
    <Box p={4} bg="gray.200" border="1px solid" borderColor="gray.200" borderRadius="md" fontSize="sm">
      <Text fontWeight="bold" mb={2}>
        🔍 CSS Debug Info:
      </Text>
      <VStack align="start">
        <Text>
          <strong>Expected Font:</strong> Inter, ui-sans-serif
        </Text>
        <Text>
          <strong>Current computed font:</strong>{' '}
          <span style={{ fontFamily: 'inherit' }}>{getCurrentFontFamily()}</span>
        </Text>
        <Text>
          <strong>Font Size (this text):</strong>{' '}
          <span style={{ fontSize: 'var(--chakra-font-sizes-md, 1rem)' }}>1rem (16px)</span>
        </Text>
        <Text>
          <strong>Background color:</strong>{' '}
          <span style={{ color: 'var(--chakra-colors-yellow-500, #FFC012)' }}>#FFC012 (yellow.500)</span>
        </Text>
        <Box mt={2} p={2} border="1px dashed" borderColor="gray.300">
          <Text fontSize="xs" fontWeight="bold">
            Font Test Samples:
          </Text>
          <Text fontSize="sm">Small (14px): Sample font size</Text>
          <Text fontSize="md">Medium (16px): Sample font size</Text>
          <Text fontSize="lg">Large (18px): Sample font size</Text>
        </Box>
        <Text mt={2} fontWeight="bold">
          💡 CSS Inspection Tips:
        </Text>
        <Text fontSize="xs" color="gray.600">
          • Right-click any element → "Inspect Element"
        </Text>
        <Text fontSize="xs" color="gray.600">
          • In DevTools: Elements tab → Styles panel shows all CSS
        </Text>
        <Text fontSize="xs" color="gray.600">
          • Computed tab shows final rendered values
        </Text>
        <Text fontSize="xs" color="gray.600">
          • Use Controls panel below to modify props live
        </Text>
      </VStack>
    </Box>
  )
}

const meta: Meta<typeof Button> = {
  title: 'UI/Elements/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button component with Chakra UI theme integration. Use the browser DevTools to inspect CSS properties, or check the "WithThemeDebugger" story for theme values.',
      },
    },
  },
  args: {
    onClick: () => console.log('Button clicked'),
  },
  argTypes: {
    colorPalette: {
      control: { type: 'select' },
      options: ['yellow', 'black', 'gray'],
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'subtle', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Default Button',
  },
}

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    colorPalette: 'yellow',
    variant: 'solid',
  },
}

export const Outline: Story = {
  args: {
    label: 'Outline Button',
    colorPalette: 'yellow',
    variant: 'outline',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
}

export const WithThemeDebugger: Story = {
  args: {
    label: 'Button with Debug Info',
  },
  render: (args) => (
    <VStack>
      <Button {...args} />
      <ThemeDebugger />
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This story shows the button with theme debugging information to help inspect CSS properties and font settings.',
      },
    },
  },
}
