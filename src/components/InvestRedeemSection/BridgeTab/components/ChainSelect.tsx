import { useState, useRef, useEffect } from 'react'
import { Box, Flex, Text, Input, Field } from '@chakra-ui/react'
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri'
import { NetworkIcon } from '@ui'
import { useController, type FieldPath, type FieldValues } from 'react-hook-form'
import { useFormContext } from '@forms'
import { useGetFormError } from '../../../../forms/hooks/useGetFormError'

export interface ChainOption {
  centrifugeId: number
  name: string
  balance?: string
  balanceLabel?: string
}

interface ChainSelectProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>
  label: string
  options: ChainOption[]
  variant?: 'from' | 'to'
  disabled?: boolean
  onSelectChange?: (centrifugeId: number) => void
}

export function ChainSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  variant = 'from',
  disabled = false,
  onSelectChange,
}: ChainSelectProps<TFieldValues>) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { error },
    formState,
  } = useController({ name, control })
  const { isError, errorMessage } = useGetFormError({ error, name })

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showOnlyWithBalance, setShowOnlyWithBalance] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.centrifugeId === Number(field.value))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter((o) => {
    if (search && !o.name.toLowerCase().includes(search.toLowerCase())) return false
    if (showOnlyWithBalance && (!o.balance || o.balance === '0')) return false
    return true
  })

  const isDisabled = formState.isSubmitting || disabled

  const handleSelect = (centrifugeId: number) => {
    field.onChange(String(centrifugeId))
    setIsOpen(false)
    setSearch('')
    onSelectChange?.(centrifugeId)
  }

  return (
    <Field.Root invalid={isError} disabled={isDisabled}>
      <Field.Label fontSize="sm" fontWeight={500}>
        {label}
      </Field.Label>
      <Box position="relative" ref={containerRef} w="100%">
        <Flex
          as="button"
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          alignItems="center"
          gap={2}
          px={2.5}
          h="16"
          border="1px solid"
          borderColor={isError ? 'border.error' : 'border.input'}
          borderRadius="lg"
          bg="bg.input"
          cursor={isDisabled ? 'not-allowed' : 'pointer'}
          opacity={isDisabled ? 0.5 : 1}
          w="100%"
          _hover={isDisabled ? {} : { borderColor: 'border.emphasized' }}
          _focusVisible={{ border: '2px solid', borderColor: 'border.accent', outline: 'none' }}
          transition="border-color 0.2s"
        >
          {selected ? (
            <Flex alignItems="center" gap={2} flex={1} minW={0}>
              <NetworkIcon centrifugeId={selected.centrifugeId} boxSize="36px" />
              <Text fontSize="sm" fontWeight={500} truncate>
                {selected.name}
              </Text>
            </Flex>
          ) : (
            <Text fontSize="sm" color="fg.muted" flex={1} textAlign="left">
              Select chain
            </Text>
          )}
          <Box color="fg.muted" flexShrink={0}>
            <RiArrowDownSLine size={20} />
          </Box>
        </Flex>

        {isOpen && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="white"
            border="1px solid"
            borderColor="border.solid"
            borderRadius="lg"
            shadow="md"
            zIndex={10}
            overflow="hidden"
          >
            {variant === 'from' && (
              <>
                <Box p={3}>
                  <Flex
                    alignItems="center"
                    gap={2}
                    px={3}
                    border="1px solid"
                    borderColor="border.input"
                    borderRadius="md"
                    bg="bg.input"
                  >
                    <RiSearchLine size={20} color="var(--chakra-colors-fg-muted)" />
                    <Input
                      placeholder="Type here...."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      variant="subtle"
                      size="sm"
                      px={0}
                      _focus={{ boxShadow: 'none' }}
                    />
                  </Flex>
                </Box>
                <Box borderBottom="1px solid" borderColor="border.solid" />
                <Box px={4} py={2}>
                  <ChakraCheckbox.Root
                    size="sm"
                    checked={showOnlyWithBalance}
                    onCheckedChange={(details) => setShowOnlyWithBalance(!!details.checked)}
                  >
                    <ChakraCheckbox.HiddenInput />
                    <ChakraCheckbox.Control />
                    <ChakraCheckbox.Label>
                      <Text fontSize="sm" color="fg.muted">
                        Show only assets with balance {'>'} 0
                      </Text>
                    </ChakraCheckbox.Label>
                  </ChakraCheckbox.Root>
                </Box>
              </>
            )}
            <Box overflowY="auto">
              {filteredOptions.map((option) => (
                <Flex
                  key={option.centrifugeId}
                  as="button"
                  onClick={() => handleSelect(option.centrifugeId)}
                  alignItems="center"
                  justifyContent="space-between"
                  w="100%"
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{ bg: 'bg.subtle' }}
                  transition="background 0.15s"
                  borderBottom={variant === 'to' ? '1px solid' : 'none'}
                  borderColor="border.input"
                >
                  <Flex alignItems="center" gap={2}>
                    <NetworkIcon centrifugeId={option.centrifugeId} boxSize="24px" />
                    <Text fontSize="sm" fontWeight={500}>
                      {option.name}
                    </Text>
                  </Flex>
                  {variant === 'from' && option.balanceLabel && (
                    <Text fontSize="sm" color="fg.muted">
                      {option.balanceLabel}
                    </Text>
                  )}
                </Flex>
              ))}
              {filteredOptions.length === 0 && (
                <Box px={4} py={3}>
                  <Text fontSize="sm" color="fg.muted">
                    No chains found
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {isError && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
    </Field.Root>
  )
}
