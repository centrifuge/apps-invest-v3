import { Box, Text, Stack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LineChart } from '../../ui/components/data/LineChart'

interface PerformanceData {
  date: string
  value: number
  volume: number
  growth: number
}

interface SalesData {
  month: string
  sales: number
  profit: number
  expenses: number
}

const performanceData: PerformanceData[] = [
  { date: '2025-01-01', value: 1000, volume: 50, growth: 0 },
  { date: '2025-02-01', value: 1100, volume: 65, growth: 10 },
  { date: '2025-03-01', value: 950, volume: 45, growth: -5 },
  { date: '2025-04-01', value: 1200, volume: 80, growth: 15 },
  { date: '2025-05-01', value: 1350, volume: 90, growth: 25 },
  { date: '2025-06-01', value: 1250, volume: 75, growth: 20 },
]

const salesData: SalesData[] = [
  { month: '2025-01-01', sales: 50000, profit: 15000, expenses: 35000 },
  { month: '2025-02-01', sales: 60000, profit: 18000, expenses: 42000 },
  { month: '2025-03-01', sales: 55000, profit: 16500, expenses: 38500 },
  { month: '2025-04-01', sales: 70000, profit: 21000, expenses: 49000 },
  { month: '2025-05-01', sales: 75000, profit: 22500, expenses: 52500 },
  { month: '2025-06-01', sales: 80000, profit: 24000, expenses: 56000 },
]

const meta: Meta<typeof LineChart> = {
  title: 'UI/Data/LineChart',
  component: LineChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible chart component supporting both line and bar series with customizable styling.',
      },
    },
  },
  argTypes: {
    height: {
      control: { type: 'number', min: 100, max: 800 },
    },
    showGrid: {
      control: { type: 'boolean' },
    },
    showTooltip: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const SingleLine: Story = {
  args: {
    data: performanceData,
    xAccessor: (row: unknown) => (row as PerformanceData).date,
    series: [
      {
        id: 'value',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).value,
        colorToken: 'yellow.500',
        strokeWidth: 2,
      },
    ],
    height: 300,
  },
}

export const MultipleLines: Story = {
  args: {
    data: performanceData,
    xAccessor: (row: unknown) => (row as PerformanceData).date,
    series: [
      {
        id: 'value',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).value,
        colorToken: 'yellow.500',
        strokeWidth: 2,
      },
      {
        id: 'volume',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).volume * 10,
        colorToken: 'gray.800',
        strokeWidth: 2,
      },
    ],
    height: 300,
    yDomain: [0, 1500],
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with multiple line series showing different data points.',
      },
    },
  },
}

export const WithBars: Story = {
  args: {
    data: salesData,
    xAccessor: (row: unknown) => (row as SalesData).month,
    series: [
      {
        id: 'sales',
        type: 'bar',
        accessor: (row: unknown) => (row as SalesData).sales,
        colorToken: 'yellow.500',
        barSize: 40,
      },
      {
        id: 'profit',
        type: 'line',
        accessor: (row: unknown) => (row as SalesData).profit,
        colorToken: 'gray.800',
        strokeWidth: 3,
      },
    ],
    height: 350,
    yDomain: [0, 90000],
  },
  parameters: {
    docs: {
      description: {
        story: 'Mixed chart with both bar and line series.',
      },
    },
  },
}

export const CustomFormatters: Story = {
  args: {
    data: salesData,
    xAccessor: (row: unknown) => (row as SalesData).month,
    series: [
      {
        id: 'sales',
        type: 'line',
        accessor: (row: unknown) => (row as SalesData).sales,
        colorToken: 'yellow.500',
        strokeWidth: 2,
      },
    ],
    height: 300,
    yDomain: [40000, 90000],
    xTickFormatter: (x) => new Date(x).toLocaleDateString('en-US', { month: 'short' }),
    yTickFormatter: (y) => `$${(y / 1000).toFixed(0)}k`,
    tooltipYTickFormatter: (y) => `$${y.toLocaleString()}`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart with custom formatters for axes and tooltips.',
      },
    },
  },
}

export const NoGrid: Story = {
  args: {
    data: performanceData,
    xAccessor: (row: unknown) => (row as PerformanceData).date,
    series: [
      {
        id: 'value',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).value,
        colorToken: 'yellow.500',
        strokeWidth: 2,
      },
    ],
    height: 250,
    showGrid: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart without grid lines for a cleaner look.',
      },
    },
  },
}

export const NoTooltip: Story = {
  args: {
    data: performanceData,
    xAccessor: (row: unknown) => (row as PerformanceData).date,
    series: [
      {
        id: 'value',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).value,
        colorToken: 'yellow.500',
        strokeWidth: 2,
      },
    ],
    height: 250,
    showTooltip: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart without tooltip interaction.',
      },
    },
  },
}

export const SmallChart: Story = {
  args: {
    data: performanceData.slice(0, 4),
    xAccessor: (row: unknown) => (row as PerformanceData).date,
    series: [
      {
        id: 'value',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).value,
        colorToken: 'yellow.500',
        strokeWidth: 1,
      },
    ],
    height: 150,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact chart suitable for dashboards or small widgets.',
      },
    },
  },
}

export const LargeChart: Story = {
  args: {
    data: salesData,
    xAccessor: (row: unknown) => (row as SalesData).month,
    series: [
      {
        id: 'sales',
        type: 'bar',
        accessor: (row: unknown) => (row as SalesData).sales,
        colorToken: 'yellow.500',
        barSize: 60,
      },
      {
        id: 'profit',
        type: 'line',
        accessor: (row: unknown) => (row as SalesData).profit,
        colorToken: 'gray.800',
        strokeWidth: 3,
      },
      {
        id: 'expenses',
        type: 'line',
        accessor: (row: unknown) => (row as SalesData).expenses,
        colorToken: 'blue.500',
        strokeWidth: 2,
      },
    ],
    height: 500,
    margin: { top: 20, right: 30, bottom: 20, left: 20 },
    yDomain: [0, 90000],
  },
  parameters: {
    docs: {
      description: {
        story: 'Large chart with multiple series and generous margins.',
      },
    },
  },
}

export const WithWrapper: Story = {
  render: (args) => (
    <Stack gap={4} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Performance Dashboard
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Monthly performance metrics with value and volume tracking
        </Text>
        <LineChart {...args} />
      </Box>
      <Box p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="sm">
          <strong>Current Value:</strong> {(args.data as PerformanceData[])?.[args.data.length - 1]?.value || 'N/A'}
        </Text>
      </Box>
    </Stack>
  ),
  args: {
    data: performanceData,
    xAccessor: (row: unknown) => (row as PerformanceData).date,
    series: [
      {
        id: 'value',
        type: 'line',
        accessor: (row: unknown) => (row as PerformanceData).value,
        colorToken: 'yellow.500',
        strokeWidth: 2,
      },
    ],
    height: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chart wrapped with additional context and information.',
      },
    },
  },
}
