import { Box, Heading, Text } from '@chakra-ui/react'

export const ChartTooltip = ({
  borderColor,
  xFormatter,
  yFormatter,
  ...props
}: {
  borderColor: string
  xFormatter: (x: string) => string
  yFormatter: (y: number) => string
}) => {
  const { payload, label } = props as { payload: any; label: string }
  if (!payload?.length) return null

  const formattedDate = xFormatter
    ? xFormatter(label)
    : new Date(label)
        .toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        })
        .toUpperCase()

  return (
    <Box border={`1px solid ${borderColor}`} borderRadius="8px" p={3} bg="white" color="black">
      <Heading size="xs" mb={2} textTransform="uppercase">
        {formattedDate}
      </Heading>

      {payload.map((entry: any) => (
        <Text key={entry.dataKey} fontSize="xs" fontWeight="normal">
          {`${entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: ${
            yFormatter ? yFormatter(entry.value) : entry.value
          }`}
        </Text>
      ))}
    </Box>
  )
}
