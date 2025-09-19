import { ReactNode } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Box, Text, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../forms/components/Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A checkbox component integrated with react-hook-form with validation support.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    labelStart: {
      control: { type: 'boolean' },
    },
    label: {
      control: { type: 'text' },
    },
  },
  args: {
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
}

export default meta
type Story = StoryObj<typeof meta>

const FormWrapper = ({
  children,
  defaultValues = {},
  showFormState = true,
}: {
  children: ReactNode
  defaultValues?: object
  showFormState?: boolean
}) => {
  const methods = useForm({ defaultValues })

  return (
    <FormProvider {...methods}>
      <form>
        <VStack align="stretch">
          <Box maxWidth="400px" background="white" padding="2rem" borderRadius="10px">
            {children}
          </Box>
          {showFormState && (
            <Box p={4} bg="gray.200" borderRadius="md">
              <Text fontSize="sm" color="gray.600" fontWeight="bold" mb={2}>
                Form State:
              </Text>
              <Text fontSize="xs" color="gray.600" fontFamily="mono">
                {JSON.stringify(methods.watch(), null, 2)}
              </Text>
            </Box>
          )}
        </VStack>
      </form>
    </FormProvider>
  )
}

export const Default: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ agreement: false }}>
      <Checkbox {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'agreement',
    label: 'I agree to the terms and conditions',
  },
}

export const LabelAtEnd: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ newsletter: false }}>
      <Checkbox {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'newsletter',
    label: 'Subscribe to newsletter',
    labelStart: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with label positioned after the checkbox control.',
      },
    },
  },
}

export const PreChecked: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ notifications: true }}>
      <Checkbox {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'notifications',
    label: 'Enable notifications',
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox that is checked by default.',
      },
    },
  },
}

export const Disabled: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ readonly: false }}>
      <Checkbox {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'readonly',
    label: 'This option is disabled',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ readonlyChecked: true }}>
      <Checkbox {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'readonlyChecked',
    label: 'This option is disabled and checked',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox that is both disabled and checked.',
      },
    },
  },
}

export const WithValidation: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ required: false }}>
      <Checkbox {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'required',
    label: 'You must accept this (required)',
    rules: { required: 'This field is required' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with required validation. Try submitting without checking.',
      },
    },
  },
}

export const MultipleCheckboxes: Story = {
  render: () => (
    <FormWrapper
      defaultValues={{
        feature1: false,
        feature2: true,
        feature3: false,
      }}
      showFormState={true}
    >
      <VStack align="stretch">
        <Text fontWeight="bold" fontSize="md" mb={2}>
          Select features:
        </Text>
        <Checkbox name="feature1" label="Feature 1 - Basic functionality" />
        <Checkbox name="feature2" label="Feature 2 - Advanced options" />
        <Checkbox name="feature3" label="Feature 3 - Premium features" disabled />
      </VStack>
    </FormWrapper>
  ),
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkboxes in a form with different states.',
      },
    },
  },
}

export const ComplexLabel: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ complex: false }}>
      <Checkbox
        {...args}
        label={
          <Box>
            <Text fontWeight="bold">Terms and Conditions</Text>
            <Text fontSize="sm" color="fg.solid" mt={1}>
              I agree to the{' '}
              <Text as="span" color="blue.500" textDecoration="underline">
                terms of service
              </Text>{' '}
              and{' '}
              <Text as="span" color="blue.500" textDecoration="underline">
                privacy policy
              </Text>
            </Text>
          </Box>
        }
      />
    </FormWrapper>
  ),
  args: {
    name: 'complex',
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with a complex label containing multiple elements.',
      },
    },
  },
}

export const CustomStyling: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ styled: false }}>
      <Box p={4} bg="blue.100" borderRadius="lg" border="1px solid" borderColor="blue.200">
        <Checkbox {...args} />
      </Box>
    </FormWrapper>
  ),
  args: {
    name: 'styled',
    label: 'Checkbox in styled container',
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox within a custom styled container.',
      },
    },
  },
}
