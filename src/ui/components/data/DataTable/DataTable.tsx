import React from 'react'
import { Table, Icon, Box, Flex } from '@chakra-ui/react'
import { FiChevronUp, FiChevronDown, FiCode } from 'react-icons/fi'

export type ColumnDefinition<RowType> = {
  header: string
  accessor?: keyof RowType
  textAlign?: 'start' | 'center' | 'end'
  width?: string
  sortKey?: string
  render?: (row: RowType) => React.ReactNode
}

export type OrderBy = 'asc' | 'desc'

interface DataTableProps<RowType extends { id?: string | number }> {
  columns: ColumnDefinition<RowType>[]
  data: RowType[]
  size?: 'sm' | 'md' | 'lg'
  pageSize?: number
  page?: number
  hideActions?: boolean
}

const TABLE_HEADER_COLOR = '#EAECF0'

export const DataTable = <RowType extends { id?: string | number; actions?: (row: RowType) => React.ReactNode }>({
  columns,
  data,
  size = 'sm',
  pageSize = Infinity,
  page = 1,
  hideActions = false,
}: DataTableProps<RowType>) => {
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: OrderBy } | null>(null)

  const handleSort = (sortKey?: string) => {
    if (!sortKey) return

    let direction: OrderBy = 'asc'
    if (sortConfig?.key === sortKey && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key: sortKey, direction })
  }

  const sortedAndPaginatedData = React.useMemo(() => {
    const sortedData = sorter([...data], sortConfig?.direction, sortConfig?.key)
    return sortedData.slice((page - 1) * pageSize, page * pageSize)
  }, [data, sortConfig, page, pageSize])

  return (
    // Chakra UI Table has a bug where the border is not applied to the table root
    // This is a workaround to apply the border to the table root
    <Box borderRadius="lg" border="1px solid" borderColor="border-primary" overflow="hidden">
      <Table.Root size={size} overflow="hidden" border="none">
        <Table.Header>
          <Table.Row bg={TABLE_HEADER_COLOR}>
            {columns.map((col, index) => (
              <Table.ColumnHeader
                key={`${col.header}-${index}`}
                textAlign={col.textAlign}
                width={col.width}
                onClick={() => handleSort(col.sortKey)}
                cursor={col.sortKey ? 'pointer' : 'default'}
                userSelect="none"
                fontSize="xs"
                color="gray.800"
                role="group"
              >
                <Flex alignItems="center" justifyContent="center">
                  {col.header}
                  {col.sortKey && (
                    <>
                      {sortConfig?.key === col.sortKey ? (
                        <Icon
                          as={sortConfig.direction === 'asc' ? FiChevronUp : FiChevronDown}
                          aria-label={sortConfig.direction}
                          ml={2}
                          boxSize={4}
                          color="gray.800"
                        />
                      ) : (
                        <Icon
                          as={FiCode}
                          aria-label="Sortable"
                          ml={2}
                          boxSize={3}
                          color="gray.400"
                          transform="rotate(90deg)"
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                        />
                      )}
                    </>
                  )}
                </Flex>
              </Table.ColumnHeader>
            ))}
            {hideActions ? null : <Table.ColumnHeader key="actions" textAlign="end" width="50px" />}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedAndPaginatedData.map((row, rowIndex) => (
            <Table.Row key={row.id ?? rowIndex}>
              {columns.map((col, index) => (
                <Table.Cell key={`${col.header}-${index}`} textAlign={col.textAlign} width={col.width} fontSize="xs">
                  {col.render ? col.render(row) : col.accessor ? String(row[col.accessor] ?? '') : null}
                </Table.Cell>
              ))}
              {hideActions ? null : (
                <Table.Cell key="actions-cell" textAlign="end">
                  {row.actions ? row.actions(row) : null}
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}

const sorter = <T extends Record<string, unknown>>(data: Array<T>, order?: OrderBy, sortKey?: string) => {
  if (!sortKey || !order) return data

  return [...data].sort((a, b) => {
    const A = a[sortKey]
    const B = b[sortKey]
    if (A == null) return 1
    if (B == null) return -1
    if (typeof A === 'number' && typeof B === 'number') {
      return order === 'asc' ? A - B : B - A
    }
    const aStr = String(A).toLowerCase()
    const bStr = String(B).toLowerCase()
    if (aStr < bStr) return order === 'asc' ? -1 : 1
    if (aStr > bStr) return order === 'asc' ? 1 : -1
    return 0
  })
}
