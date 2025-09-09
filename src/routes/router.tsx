import { createBrowserRouter, redirect } from 'react-router-dom'
import { LoadingBoundary } from '@ui'
import MainLayout from '@layouts/MainLayout'
import { HomeRoute, PoolRoute, RootRoute } from '@routes/routes'
import NotFoundOrRedirect from './NotFound'
import HashUrlHandler from './HashUrlHandler'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <HashUrlHandler />
        <RootRoute />
      </>
    ),
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
          {
            path: 'pools/*',
            loader: () => redirect('/'),
          },
          {
            path: 'portfolio',
            loader: () => redirect('/'),
          },
          // Add catch-all routes for migrate paths
          {
            path: 'portfolio/migrate/*',
            element: <div>Redirecting to migration app...</div>,
            loader: () => {
              window.location.replace('https://migrate.centrifuge.io')
              return null
            },
          },
          {
            path: 'migrate/*',
            element: <div>Redirecting to migration app...</div>,
            loader: () => {
              window.location.replace('https://migrate.centrifuge.io')
              return null
            },
          },
        ],
      },
    ],
  },
])
