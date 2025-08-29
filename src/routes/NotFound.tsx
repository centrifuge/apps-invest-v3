import { useEffect } from 'react'
import { isRouteErrorResponse, useLocation, useRouteError } from 'react-router-dom'
import { Box, Button, Text } from '@chakra-ui/react'

export default function NotFoundOrRedirect() {
  const err = useRouteError()
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    const segments = pathname.toLowerCase().split('/').filter(Boolean)
    if (segments.includes('migrate')) {
      window.location.replace(`https://migrate.centrifuge.io`)
    }
  }, [pathname, search, hash])

  const hasMigrate = pathname.toLowerCase().split('/').includes('migrate')
  if (hasMigrate) return null

  const is404 = isRouteErrorResponse(err) && err.status === 404
  return (
    <Box p={10}>
      <Text fontSize="xl" fontWeight="bold">
        {is404 ? 'Page not found' : 'Something went wrong'}
      </Text>
      <Text mt={2}>Something went wrong.</Text>
      <Button onClick={() => window.location.replace('/')} mt={4}>
        Go to homepage
      </Button>
    </Box>
  )
}
