import { ButtonGroup, IconButton, Pagination, Flex } from '@chakra-ui/react'
import { IconTailArrowLeft, IconTailArrowRight } from '@ui'

interface TablePaginationProps {
  totalCount: number
  pageSize?: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function TablePagination({ totalCount, pageSize = 10, currentPage, onPageChange }: TablePaginationProps) {
  if (totalCount <= pageSize) {
    return null
  }

  return (
    <Flex justify="flex-end" py={4}>
      <Pagination.Root
        count={totalCount}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(e) => onPageChange(e.page)}
      >
        <ButtonGroup variant="outline" size="sm" gap={0}>
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page" px={2}>
              <IconTailArrowLeft /> Previous
            </IconButton>
          </Pagination.PrevTrigger>
          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: 'outline', _selected: 'solid' }} aria-label={`Page ${page.value}`}>
                {page.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Next page" px={2}>
              Next <IconTailArrowRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Flex>
  )
}
