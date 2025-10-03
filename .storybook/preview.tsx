import type { Preview } from '@storybook/react-vite'
import { ChakraProvider } from '@chakra-ui/react'
import system from '../src/ui/theme/theme'
import './storybook.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      hideNoControlsWarning: true,
    },

    a11y: {
      test: 'todo',
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F6F6F6', // grayScale[50]
        },
        {
          name: 'white',
          value: '#ffffff',
        },
      ],
    },
  },

  decorators: [
    (Story) => (
      <ChakraProvider value={system}>
        <div style={{ fontFamily: 'Inter, ui-sans-serif' }}>
          <Story />
        </div>
      </ChakraProvider>
    ),
  ],
}

export default preview
