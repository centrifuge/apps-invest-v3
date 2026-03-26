import type { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import { maxScreenSize } from '@layouts/MainLayout'

export function PoolPageLayout({ children }: { children: ReactNode }) {
  return (
    <Box bg="linear-gradient(to top, #07090A, #20262D)" minH="100vh">
      <Box pt={{ base: 32, md: 28 }} pb={8}>
        <Box maxW={maxScreenSize} mx="auto" px={{ base: 4, md: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
