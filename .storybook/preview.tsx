import type { Preview } from '@storybook/react-vite'
import { ChakraProvider as ChakraUiProvider } from '@chakra-ui/react'
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
      <ChakraUiProvider value={system}>
        <div style={{ fontFamily: 'Inter, ui-sans-serif', minHeight: '100vh' }}>
          <Story />
        </div>
      </ChakraUiProvider>
    ),
  ],
}

export default preview
