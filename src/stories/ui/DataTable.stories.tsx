import { Box, Button, Text, Badge } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable, type ColumnDefinition } from '../../ui/components/data/DataTable/DataTable'

interface SampleUser {
  id: number
  name: string
  email: string
  age: number
  role: string
  status: 'active' | 'inactive'
  salary?: number
}

const sampleData: SampleUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer', status: 'active', salary: 75000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer', status: 'active', salary: 68000 },
  { id: 3, name: 'Tim Lee', email: 'bob@example.com', age: 45, role: 'Manager', status: 'inactive', salary: 95000 },
  {
    id: 4,
    name: 'Ada Lovelace',
    email: 'alice@example.com',
    age: 29,
    role: 'Developer',
    status: 'active',
    salary: 72000,
  },
  {
    id: 5,
    name: 'Linus Turing',
    email: 'charlie@example.com',
    age: 35,
    role: 'DevOps',
    status: 'active',
    salary: 85000,
  },
]

const basicColumns: ColumnDefinition<SampleUser>[] = [
  { header: 'Name', accessor: 'name', sortKey: 'name', justifyContent: 'flex-start' },
  { header: 'Email', accessor: 'email', sortKey: 'email', justifyContent: 'flex-start' },
  { header: 'Age', accessor: 'age', textAlign: 'center', sortKey: 'age', justifyContent: 'center' },
  { header: 'Role', accessor: 'role', sortKey: 'role', justifyContent: 'flex-start', textAlign: 'left' },
]

const advancedColumns: ColumnDefinition<SampleUser>[] = [
  {
    header: 'Name',
    accessor: 'name',
    sortKey: 'name',
    width: '200px',
    justifyContent: 'flex-start',
    render: (row) => (
      <Box className="test">
        <Text fontWeight="bold">{row.name}</Text>
        <Text fontSize="xs" color="gray.500">
          {row.email}
        </Text>
      </Box>
    ),
  },
  {
    header: 'Age',
    accessor: 'age',
    textAlign: 'center',
    sortKey: 'age',
    width: '80px',
    justifyContent: 'center',
  },
  {
    header: 'Role',
    accessor: 'role',
    sortKey: 'role',
    width: '120px',
    justifyContent: 'flex-start',
  },
  {
    header: 'Status',
    sortKey: 'status',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100px',
    render: (row) => (
      <Badge colorPalette={row.status === 'active' ? 'green' : 'red'} variant="solid" size="sm">
        {row.status}
      </Badge>
    ),
  },
  {
    header: 'Salary',
    accessor: 'salary',
    textAlign: 'right',
    sortKey: 'salary',
    justifyContent: 'flex-end',
    width: '120px',
    render: (row) => (row.salary ? `$${row.salary.toLocaleString()}` : 'N/A'),
  },
]

const dataWithActions = sampleData.map((user) => ({
  ...user,
  actions: (row: SampleUser) => (
    <Box>
      <Button size="xs" variant="ghost" onClick={() => console.log('Edit', row.id)}>
        Edit
      </Button>
    </Box>
  ),
}))

const meta: Meta<typeof DataTable> = {
  title: 'UI/Data/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible data table component with sorting, custom rendering, and action support.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    pageSize: {
      control: { type: 'number', min: 1, max: 100 },
    },
    page: {
      control: { type: 'number', min: 1 },
    },
    hideActions: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    columns: basicColumns as any, // eslint-disable-line
    data: sampleData,
  },
}

export const WithCustomRendering: Story = {
  args: {
    columns: advancedColumns as any, // eslint-disable-line
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows custom cell rendering with badges, formatted text, and complex layouts.',
      },
    },
  },
}

export const WithActions: Story = {
  args: {
    columns: basicColumns as any, // eslint-disable-line
    data: dataWithActions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with action buttons in the last column.',
      },
    },
  },
}

export const HiddenActions: Story = {
  args: {
    columns: basicColumns as any, // eslint-disable-line
    data: dataWithActions,
    hideActions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with actions hidden, even when data has actions defined.',
      },
    },
  },
}

export const Pagination: Story = {
  args: {
    columns: basicColumns as any, // eslint-disable-line
    data: sampleData,
    pageSize: 3,
    page: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with pagination showing 3 items per page.',
      },
    },
  },
}

export const LargeSize: Story = {
  args: {
    columns: advancedColumns as any, // eslint-disable-line
    data: sampleData,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with larger size for better readability.',
      },
    },
  },
}

export const SmallSize: Story = {
  args: {
    columns: basicColumns as any, // eslint-disable-line
    data: sampleData,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact table with smaller size.',
      },
    },
  },
}

export const EmptyData: Story = {
  args: {
    columns: basicColumns as any, // eslint-disable-line
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with no data to show empty state handling.',
      },
    },
  },
}

export const SingleColumn: Story = {
  args: {
    columns: [{ header: 'Name', accessor: 'name', sortKey: 'name' }] as any, // eslint-disable-line
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with only one column.',
      },
    },
  },
}

export const NoSorting: Story = {
  args: {
    columns: [
      { header: 'Name', accessor: 'name', textAlign: 'left', justifyContent: 'flex-start' },
      { header: 'Email', accessor: 'email', textAlign: 'center', justifyContent: 'center' },
      { header: 'Role', accessor: 'role', textAlign: 'right', justifyContent: 'flex-end' },
    ] as any, // eslint-disable-line
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Table without sorting capabilities (no sortKey defined).',
      },
    },
  },
}
