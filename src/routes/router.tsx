import { createBrowserRouter } from 'react-router-dom'
import { LoadingBoundary } from '@ui'
import MainLayout from '@layouts/MainLayout'
import { HomeRoute, PoolRoute, RootRoute } from '@routes/routes'
import NotFoundOrRedirect from './NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <NotFoundOrRedirect />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <LoadingBoundary>
                <HomeRoute />
              </LoadingBoundary>
            ),
          },
          {
            path: 'pool/:poolId',
            element: (
              <LoadingBoundary>
                <PoolRoute />
              </LoadingBoundary>
            ),
          },
        ],
      },
    ],
  },
])
