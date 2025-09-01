import { Box, Input, Select as ChakraSelect, createListCollection, InputGroup } from '@chakra-ui/react'
import { IconSearch } from '../icons'
import React, { useState, useMemo, useEffect } from 'react'

type SelectProps = Omit<ChakraSelect.RootProps, 'collection' | 'defaultValue' | 'value'> & {
  items: { value: string; label: string; children?: React.ReactNode }[]
  label?: string
  placeholder: string
  withIndicator?: boolean
  loading?: boolean
  onSelectionChange?: (value: string) => void
  color?: string
  defaultValue?: string
  value?: string
  withSearch?: boolean
  inputRef?: React.Ref<HTMLInputElement>
  open?: boolean
}

export const Select = ({
  items,
  label,
  placeholder,
  withIndicator = false,
  loading = false,
  onSelectionChange,
  color,
  defaultValue,
  value,
  withSearch,
  inputRef,
  open,
  ...rest
}: SelectProps) => {
  const [internalSearch, setInternalSearch] = useState('')

  const handleSelectionChange = (details: { value: string[] }) => {
    onSelectionChange?.(details.value[0])
  }

  const collection = createListCollection({
    items,
  })

  const filteredItemsForRender = useMemo(() => {
    if (!internalSearch) return items
    return items.filter((item) => item.label.toLowerCase().includes(internalSearch.toLowerCase()))
  }, [items, internalSearch])

  useEffect(() => {
    if (!open) {
      setInternalSearch('')
    }
  }, [open])

  return (
    <ChakraSelect.Root
      collection={collection}
      size="sm"
      disabled={loading}
      onValueChange={handleSelectionChange}
      value={value ? [value] : []}
      defaultValue={defaultValue ? [defaultValue] : []}
      open={open}
      {...rest}
    >
      <ChakraSelect.HiddenSelect />
      {label && <ChakraSelect.Label>{label}</ChakraSelect.Label>}
      <ChakraSelect.Control>
        <ChakraSelect.Trigger color={color}>
          <ChakraSelect.ValueText placeholder={placeholder} />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <ChakraSelect.Positioner>
        <ChakraSelect.Content>
          {withSearch && (
            <Box p={2} borderBottomWidth="1px">
              <InputGroup startElement={<IconSearch size={16} />}>
                <Input
                  ref={inputRef}
                  placeholder="Search"
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  pl={8}
                  borderRadius="md"
                  size="xs"
                  color="black"
                />
              </InputGroup>
            </Box>
          )}
          {filteredItemsForRender.map((item) => (
            <ChakraSelect.Item
              item={item}
              key={item.value}
              color="black"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              border="1px solid"
              borderColor={withSearch ? 'gray.200' : 'transparent'}
              bg={withSearch ? 'white' : 'transparent'}
              borderRadius="md"
              _hover={{ bg: 'gray.100' }}
              _selected={{ bg: 'gray.100' }}
              _focus={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.100' }}
              mt={withSearch ? 2 : 0}
            >
              {item.children ?? item.label}
              {withIndicator && <ChakraSelect.ItemIndicator />}
            </ChakraSelect.Item>
          ))}
        </ChakraSelect.Content>
      </ChakraSelect.Positioner>
    </ChakraSelect.Root>
  )
}
