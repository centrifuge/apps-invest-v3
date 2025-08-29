import { forwardRef } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { Box, Field, Input, Flex, Icon, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react'
import { CiCalendar } from 'react-icons/ci'

interface DatePickerProps {
  label: string
  date: Date | undefined
  onChange: (date: Date) => void
}

const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
  <Flex onClick={onClick} ref={ref} alignItems="center" position="relative" cursor="pointer">
    <Box position="absolute" left="12px" zIndex="1" color="gray.600">
      <Icon as={CiCalendar} />
    </Box>
    <Input height="40px" fontSize="md" value={value} readOnly pl="40px" />
  </Flex>
))

export function DatePicker({ date, label, onChange }: DatePickerProps) {
  const formattedDate = date ? format(date, 'MM/dd/yyyy') : ''

  const customStyles = `
    .rdp-root {
      --rdp-accent-color: var(--chakra-colors-yellow-500);
      --rdp-cell-size: 38px;
      --rdp-background-color: white;
      --rdp-color: var(--chakra-colors-gray-800);
      --rdp-outline: 2px solid var(--chakra-colors-gray-100);
      --rdp-outline-selected: 2px solid var(--chakra-colors-gray-100);
    }
    .rdp-day_selected {
      background-color: var(--chakra-colors-gray-100) !important;
      color: var(--chakra-colors-gray-600) !important;
    }
    .rdp-day_today {
      font-weight: bold;
    }
    .rdp-day:not(.rdp-day_selected):hover {
      background-color: var(--chakra-colors-gray-100) !important;
    }
    .rdp-caption {
      color: var(--chakra-colors-gray-800);
    }
    .rdp-button {
      color: var(--chakra-colors-gray-800);
    }
    .rdp-button:focus:not([disabled]) {
      box-shadow: 0 0 0 2px var(--chakra-colors-black-500);
      outline: none;
    }
  `

  return (
    <Field.Root position="relative">
      <Field.Label fontSize="sm">{label}</Field.Label>
      <Box position="relative">
        <style>{customStyles}</style>
        <Popover.Root positioning={{ placement: 'bottom-end' }}>
          <PopoverTrigger>
            <CustomInput value={formattedDate} readOnly />
          </PopoverTrigger>
          <Popover.Positioner>
            <PopoverContent bg="white" border={`1px solid #91969B`} borderRadius="md" boxShadow="lg" p={2}>
              <DayPicker required mode="single" selected={date} onSelect={onChange} />
            </PopoverContent>
          </Popover.Positioner>
        </Popover.Root>
      </Box>
    </Field.Root>
  )
}

export default DatePicker
