import { useState } from 'react'
import { Field, Input, Group, IconButton, Text, Flex } from '@chakra-ui/react'
import { isAddress } from 'viem'
import { IoAddOutline } from 'react-icons/io5'
import { FaRegTrashAlt } from 'react-icons/fa'
import { truncateAddress } from '@cfg'
import { NetworkIcon } from '../elements/NetworkIcon'
import { HexString } from '@centrifuge/sdk'

export interface AddressInputProps {
  onAdd: (address: HexString) => void
  withSelection?: boolean
  addresses?: { address: HexString; centrifugeId?: number }[]
  onDelete?: ({ address, centrifugeId }: { address: HexString; centrifugeId?: number }) => void
  centrifugeId?: number
  label?: string
}

export const AddressInputLabel = ({
  address,
  centrifugeId,
  onDelete,
  disabled = false,
}: {
  address: HexString
  centrifugeId?: number
  disabled?: boolean
  onDelete: ({ address, centrifugeId }: { address: HexString; centrifugeId?: number }) => void
}) => {
  if (!isAddress(address)) return null

  return (
    <Flex
      justifyContent="space-between"
      border="1px solid"
      borderColor="border.solid"
      alignItems="center"
      mt={4}
      pl={1}
      pr={1}
      w="full"
    >
      <Text fontSize="sm">{truncateAddress(address)}</Text>
      <NetworkIcon centrifugeId={centrifugeId} withLabel fontSize="sm" />
      <IconButton
        disabled={disabled}
        size="sm"
        backgroundColor="white"
        color="fg.disabled"
        onClick={() => onDelete({ address, centrifugeId })}
      >
        <FaRegTrashAlt />
      </IconButton>
    </Flex>
  )
}

export const AddressInput = ({ onAdd, onDelete, addresses, label = 'Wallet Address' }: AddressInputProps) => {
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleClick = () => {
    const valid = isAddress(value)
    setIsValid(valid)

    if (valid && typeof onAdd === 'function') {
      onAdd(value)
      setValue('')
    }
  }

  const handleDelete = ({ address, centrifugeId }: { address: HexString; centrifugeId?: number }) => {
    if (typeof onDelete === 'function') {
      onDelete({ address, centrifugeId })
    }
  }

  return (
    <Field.Root invalid={!isValid && value !== ''}>
      {label && <Field.Label>{label}</Field.Label>}
      <Group attached w="full" maxW="sm" display="flex" flexDirection="column" gap={2} alignItems="flex-start">
        <Flex alignItems="flex-start" w="full">
          <Input
            flex="1"
            placeholder="Add wallet address"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setIsValid(true)
            }}
            onBlur={() => setIsValid(isAddress(value))}
            size="sm"
            background="border.input"
            borderRadius={4}
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            zIndex={1}
          />
          <IconButton
            onClick={handleClick}
            aria-label="Add address"
            size="sm"
            backgroundColor="border.input"
            color="fg.disabled"
            borderColor="border.solid"
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            borderLeft="none"
            variant="outline"
          >
            <IoAddOutline />
          </IconButton>
        </Flex>

        {addresses?.length
          ? addresses.map((address) => (
              <AddressInputLabel
                key={address.address}
                disabled={addresses.length <= 1}
                address={address.address}
                onDelete={handleDelete}
                centrifugeId={address.centrifugeId}
              />
            ))
          : null}
      </Group>

      {!isValid && value !== '' && <Field.ErrorText>Invalid address.</Field.ErrorText>}
    </Field.Root>
  )
}
