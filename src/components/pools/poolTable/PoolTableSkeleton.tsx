import { Box, Skeleton, Table, Text } from '@chakra-ui/react'
import { PoolTableColumns } from '@components/pools/poolTable/columnsConfig'

export function PoolTableSkeleton({ columns }: { columns: PoolTableColumns[] }) {
  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row bg="border.muted" borderRadius="10px">
            {columns.map((col, i) => (
              <Table.ColumnHeader
                key={col.label}
                width={col.width}
                py={4}
                px={4}
                borderTopLeftRadius={i === 0 ? '10px' : undefined}
                borderBottomLeftRadius={i === 0 ? '10px' : undefined}
                borderTopRightRadius={i === columns.length - 1 ? '10px' : undefined}
                borderBottomRightRadius={i === columns.length - 1 ? '10px' : undefined}
              >
                <Text fontSize="xs" fontWeight={400} color="fg.solid">
                  {col.label}
                </Text>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, i) => (
            <Table.Row key={i}>
              {columns.map((col) => (
                <Table.Cell key={col.label} py={3} px={4}>
                  <Skeleton height="20px" width="80%" />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
