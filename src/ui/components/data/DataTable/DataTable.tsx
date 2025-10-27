import React from 'react'
import { Table, Icon, Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react'
import { FiChevronUp, FiChevronDown, FiCode } from 'react-icons/fi'
import { type PaginationMode, IconInfo, Pagination, Tooltip } from '@ui'

export type ColumnDefinition<RowType> = {
  header: string
  accessor?: keyof RowType
  headerTooltip?: string
  sortKey?: string
  textAlign?: 'start' | 'center' | 'end'
  width?: string
  render?: (row: RowType) => React.ReactNode
}

export type OrderBy = 'asc' | 'desc'

interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor?: string
  startCursor?: string
}

interface DataTableProps<RowType extends { id?: string | number }> {
  columns: ColumnDefinition<RowType>[]
  data: RowType[]
  bodyProps?: Table.BodyProps
  currentPage?: number
  isLoading?: boolean
  pageInfo?: PageInfo
  pageSize?: number
  paginationMode?: PaginationMode
  size?: 'sm' | 'md' | 'lg'
  skeletonRowNumber?: number
  totalCount?: number
  onPageChange?: (page: number, cursor?: string) => void
}

export const DataTable = <RowType extends { id?: string | number }>({
  columns,
  data,
  size = 'sm',
  bodyProps,
  currentPage: externalCurrentPage,
  isLoading = false,
  pageInfo,
  pageSize = 10,
  paginationMode = 'client',
  skeletonRowNumber,
  totalCount: externalTotalCount,
  onPageChange: externalOnPageChange,
}: DataTableProps<RowType>) => {
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: OrderBy } | null>(null)
  const [internalCurrentPage, setInternalCurrentPage] = React.useState(1)

  // Use external page state if provided, otherwise use internal
  const currentPage = externalCurrentPage ?? internalCurrentPage
  const setCurrentPage = externalOnPageChange ?? setInternalCurrentPage

  const handleSort = (sortKey?: string) => {
    if (!sortKey) return
    let direction: OrderBy = 'asc'
    if (sortConfig?.key === sortKey && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key: sortKey, direction })
  }

  const sortedAndPaginatedData = React.useMemo(() => {
    // For server-side pagination, don't sort or paginate here
    if (paginationMode === 'server') {
      return data
    }

    // For client-side pagination, sort and paginate
    const sortedData = sorter([...data], sortConfig?.direction, sortConfig?.key)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [data, sortConfig, currentPage, pageSize, paginationMode])

  // Reset to first page if current page exceeds total pages
  React.useEffect(() => {
    if (paginationMode === 'client') {
      const totalPages = Math.ceil(data.length / pageSize)
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1)
      }
    }
  }, [data.length, pageSize, currentPage, paginationMode, setCurrentPage])

  // Determine number of skeleton rows to show
  const skeletonRows = Array.from(Array(skeletonRowNumber ?? pageSize).keys())
  const skeletonColumns = Array.from(Array(columns.length).keys())

  return (
    <Stack gap={0}>
      {/* Chakra UI Table has a bug where the border is not applied to the table root
          This is a workaround to apply the border to the table root */}
      <Box borderRadius="lg" border="1px solid" borderColor="border.solid" overflow="hidden">
        <Table.Root size={size} overflow="hidden" border="none">
          <Table.Header>
            <Table.Row bg="bg.muted">
              {columns.map((col, index) => (
                <Table.ColumnHeader
                  key={`${col.header}-${index}`}
                  textAlign={col.textAlign}
                  width={col.width}
                  onClick={() => handleSort(col.sortKey)}
                  cursor={col.sortKey ? 'pointer' : 'default'}
                  userSelect="none"
                  fontSize="xs"
                  color="fg.solid"
                  role="group"
                >
                  {col.headerTooltip ? tooltipHeader(col.header, col.headerTooltip) : col.header}
                  {col.sortKey && (
                    <>
                      {sortConfig?.key === col.sortKey ? (
                        <Icon
                          as={sortConfig.direction === 'asc' ? FiChevronUp : FiChevronDown}
                          aria-label={sortConfig.direction}
                          ml={2}
                          boxSize={4}
                          color="fg.solid"
                        />
                      ) : (
                        <Icon
                          as={FiCode}
                          aria-label="Sortable"
                          ml={2}
                          boxSize={3}
                          color="fg.subtle"
                          transform="rotate(90deg)"
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                        />
                      )}
                    </>
                  )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body {...bodyProps}>
            {isLoading && skeletonRows.length > 0
              ? skeletonRows.map((_, rowIndex) => (
                  <Table.Row key={`skeleton-${rowIndex}`} p="2px">
                    {skeletonColumns.map((_, colIndex) => (
                      <Table.Cell key={`skeleton-cell-${colIndex}`} textAlign="start">
                        <Skeleton height="28px" />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              : sortedAndPaginatedData.map((row, rowIndex) => (
                  <Table.Row key={row.id ?? rowIndex}>
                    {columns.map((col, index) => (
                      <Table.Cell key={`${col.header}-${index}`} textAlign={col.textAlign} width={col.width}>
                        {col.render ? col.render(row) : col.accessor ? String(row[col.accessor] ?? '') : null}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Pagination
        mode={paginationMode}
        totalCount={externalTotalCount ?? data.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageInfo={pageInfo}
        isLoading={isLoading}
      />
    </Stack>
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

export function tooltipHeader(headerText: string, tooltipText: string) {
  return (
    <Tooltip content={tooltipText}>
      <Flex alignItems="flex-start" gap={1}>
        <Box mt={0.5} color="fg.muted">
          <IconInfo size={16} cursor="pointer" color="fg.muted" />
        </Box>
        <Text>{headerText}</Text>
      </Flex>
    </Tooltip>
  )
}
