import { useState } from 'react'
import { Box, Flex, Input, Text } from '@chakra-ui/react'

const SLIPPAGE_PRESETS = [0.005, 0.01, 0.05]

interface SlippageSelectorProps {
  slippage: number
  onSlippageChange: (value: number) => void
}

export function SlippageSelector({ slippage, onSlippageChange }: SlippageSelectorProps) {
  const [showPresets, setShowPresets] = useState(false)
  const [customSlippage, setCustomSlippage] = useState('')

  return (
    <Box>
      <Flex align="center" gap={1} cursor="pointer" onClick={() => setShowPresets((s) => !s)}>
        <Text fontSize="xs" color="fg.muted">
          Max slippage:
        </Text>
        <Text fontSize="xs" fontWeight="bold">
          {(slippage * 100).toFixed(slippage * 100 < 1 ? 2 : 1)}%
        </Text>
        <Text fontSize="2xs" color="fg.muted">
          {showPresets ? '▲' : '▼'}
        </Text>
      </Flex>
      {showPresets && (
        <Flex mt={2} bg="gray.50" borderRadius="full" p={1} align="center">
          {SLIPPAGE_PRESETS.map((preset) => {
            const isActive = slippage === preset && !customSlippage
            return (
              <Box
                key={preset}
                as="button"
                flex={1}
                onClick={() => {
                  onSlippageChange(preset)
                  setCustomSlippage('')
                }}
                py={1.5}
                borderRadius="full"
                fontSize="xs"
                fontWeight={isActive ? 'bold' : 'medium'}
                textAlign="center"
                bg={isActive ? 'white' : 'transparent'}
                shadow={isActive ? 'xs' : 'none'}
                color={isActive ? 'fg' : 'fg.muted'}
                cursor="pointer"
                _hover={{ bg: isActive ? 'white' : 'gray.100' }}
              >
                {(preset * 100).toFixed(preset * 100 < 1 ? 2 : 1)}%
              </Box>
            )
          })}
          <Flex flex={1} align="center" justify="center">
            <Input
              size="xs"
              placeholder="Custom %"
              value={customSlippage}
              onChange={(e) => {
                const val = e.target.value
                setCustomSlippage(val)
                const num = parseFloat(val)
                if (!isNaN(num) && num > 0 && num <= 50) {
                  onSlippageChange(num / 100)
                }
              }}
              textAlign="center"
              fontSize="xs"
              border="none"
              bg="transparent"
              _focus={{ boxShadow: 'none' }}
              width="70px"
            />
          </Flex>
        </Flex>
      )}
      {slippage > 0.02 && (
        <Flex mt={2} p={2} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200" align="center">
          <Text fontSize="xs" color="red.600" fontWeight="medium">
            Warning: High slippage ({(slippage * 100).toFixed(1)}%). Your transaction may be frontrun and result in an
            unfavorable price.
          </Text>
        </Flex>
      )}
    </Box>
  )
}
