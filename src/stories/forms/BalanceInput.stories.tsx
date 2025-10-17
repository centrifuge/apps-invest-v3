import { ReactNode } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Box, Text } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BalanceInput } from '../../forms/components/BalanceInput'

const meta: Meta<typeof BalanceInput> = {
  title: 'Forms/Components/BalanceInput',
  component: BalanceInput,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    currency: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
    },
    subLabel: {
      control: { type: 'text' },
    },
    buttonLabel: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    decimals: {
      control: { type: 'number', min: 0, max: 18 },
    },
    displayDecimals: {
      control: { type: 'number', min: 0, max: 18 },
    },
    size: {
      control: { type: 'select' },
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  args: {
    onChange: (value: string) => console.log('Value changed:', value),
    onBlur: () => console.log('Input blurred'),
    onSelectChange: (value: string | number) => console.log('Select changed:', value),
    onButtonClick: () => console.log('Button clicked'),
  },
}

export default meta
type Story = StoryObj<typeof meta>

const FormWrapper = ({ children, defaultValues = {} }: { children: ReactNode; defaultValues: object }) => {
  const methods = useForm({ defaultValues })

  return (
    <FormProvider {...methods}>
      <form>
        <div style={{ maxWidth: '400px', background: 'white', padding: '2rem', borderRadius: '10px' }}>{children}</div>
        <Box mt={4}>
          <Text fontSize="sm" color="gray.600">
            Current form values: {JSON.stringify(methods.watch(), null, 2)}
          </Text>
        </Box>
      </form>
    </FormProvider>
  )
}

export const Default: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ amount: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'amount',
    label: 'Amount',
    currency: 'USDC',
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ investment: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'investment',
    label: 'Investment Amount',
    currency: 'USDC',
  },
}

export const WithSubLabel: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ balance: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'balance',
    label: 'Account Balance',
    subLabel: 'Available: $1,234.56',
    currency: 'USDC',
  },
}

export const WithSelectOptions: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ payment: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'payment',
    label: 'Payment Amount',
    selectOptions: [
      { label: 'USDC', value: 'USDC' },
      { label: 'ETH', value: 'ETH' },
      { label: 'BTC', value: 'BTC' },
    ],
  },
}

export const Disabled: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ readonly: '123.45' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'readonly',
    label: 'Read-only Amount',
    currency: 'USDC',
    disabled: true,
  },
}

export const HighDecimals: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ crypto: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'crypto',
    label: 'Crypto Amount',
    currency: 'BTC',
    decimals: 18,
    displayDecimals: 18,
  },
}

export const LowDecimals: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ simple: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'simple',
    label: 'Simple Amount',
    currency: 'USDC',
    decimals: 2,
    displayDecimals: 2,
  },
}

export const SmallSize: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ small: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'small',
    label: 'Small Input',
    currency: 'USDC',
    size: 'sm',
  },
}

export const LargeSize: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ large: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'large',
    label: 'Large Input',
    currency: 'USDC',
    size: 'lg',
  },
}

export const WithValidation: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ validated: '' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'validated',
    label: 'Amount (Required)',
    currency: 'USDC',
    rules: { required: 'Amount is required' },
  },
}

export const PrefilledValue: Story = {
  render: (args) => (
    <FormWrapper defaultValues={{ prefilled: '1234.56' }}>
      <BalanceInput {...args} />
    </FormWrapper>
  ),
  args: {
    name: 'prefilled',
    label: 'Prefilled Amount',
    currency: 'USDC',
  },
}
