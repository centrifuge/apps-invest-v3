import { ButtonGroup, IconButton, Pagination as ChakraPagination, Flex } from '@chakra-ui/react'
import { IconTailArrowLeft, IconTailArrowRight } from '@ui'
import { useCallback, useEffect, useRef, useState } from 'react'

interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  endCursor?: string
  startCursor?: string
}

export type PaginationMode = 'client' | 'server'

interface PaginationProps {
  currentPage: number
  isLoading?: boolean
  mode?: PaginationMode
  pageInfo?: PageInfo
  pageSize?: number
  totalCount: number
  onPageChange: (page: number, cursor?: string) => void
}

export function Pagination({
  currentPage,
  isLoading = false,
  mode = 'client',
  pageInfo,
  pageSize = 10,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const [cursorMap, setCursorMap] = useState<Map<number, string>>(new Map())

  // // Cache totalCount to avoid render flickering when isLoading changes
  const cachedTotalCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isLoading && totalCount && (!cachedTotalCount || cachedTotalCount.current !== totalCount)) {
      cachedTotalCount.current = totalCount
    }
  }, [totalCount, cachedTotalCount.current, isLoading])

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (mode === 'server' && pageInfo) {
        // Server-side pagination with cursors
        const isNext = newPage > currentPage
        const isPrevious = newPage < currentPage

        if (isNext && pageInfo.endCursor) {
          const newCursorMap = new Map(cursorMap)
          newCursorMap.set(newPage, pageInfo.endCursor)
          setCursorMap(newCursorMap)
          onPageChange(newPage, pageInfo.endCursor)
        } else if (isPrevious) {
          const cursor = cursorMap.get(newPage)
          onPageChange(newPage, cursor)
        }
      } else {
        // Client-side pagination or server without cursors
        onPageChange(newPage)
      }
    },
    [mode, currentPage, pageInfo?.hasNextPage, cursorMap, onPageChange]
  )

  // Don't render pagination if there's only one page or no data
  if (!isLoading && totalCount <= pageSize) {
    return null
  }

  return (
    <Flex justify="flex-end" py={4}>
      <ChakraPagination.Root
        count={cachedTotalCount.current}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(e) => handlePageChange(e.page)}
      >
        <ButtonGroup variant="outline" size="sm" gap={0}>
          <ChakraPagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page" px={2} disabled={currentPage === 1}>
              <IconTailArrowLeft /> Previous
            </IconButton>
          </ChakraPagination.PrevTrigger>
          <ChakraPagination.Items
            render={(page) => (
              <IconButton variant={{ base: 'outline', _selected: 'solid' }} aria-label={`Page ${page.value}`}>
                {page.value}
              </IconButton>
            )}
          />
          <ChakraPagination.NextTrigger asChild>
            <IconButton aria-label="Next page" px={2} disabled={currentPage === totalCount}>
              Next <IconTailArrowRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </Flex>
  )
}
