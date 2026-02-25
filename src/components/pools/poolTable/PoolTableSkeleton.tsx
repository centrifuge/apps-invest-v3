import { Box, Skeleton, Table, Text } from '@chakra-ui/react'
import { PoolTableColumns } from '@components/pools/poolTable/PoolTable'

export function PoolTableSkeleton({ columns }: { columns: PoolTableColumns[] }) {
  return (
    <Box overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row bg="bg.muted">
            {columns.map((col) => (
              <Table.ColumnHeader key={col.label} width={col.width} py={3} px={4}>
                <Text fontSize="xs" fontWeight={600} color="fg.muted" textTransform="uppercase" letterSpacing="wider">
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
