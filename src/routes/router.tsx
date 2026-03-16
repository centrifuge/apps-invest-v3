import { createBrowserRouter, redirect, ScrollRestoration } from 'react-router-dom'
import { LoadingBoundary } from '@ui'
import MainLayout from '@layouts/MainLayout'
import { HomeRoute, PoolRoute, RootRoute } from '@routes/routes'
import { VaultsProvider } from '@contexts/VaultsContext'
import NotFoundOrRedirect from './NotFound'
import HashUrlHandler from './HashUrlHandler'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration />
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
            path: 'pool/:poolId/:network/:asset',
            element: (
              <LoadingBoundary>
                <VaultsProvider>
                  <PoolRoute />
                </VaultsProvider>
              </LoadingBoundary>
            ),
          },
        ],
      },
      {
        path: 'pool/:poolId',
        loader: () => redirect('/'),
      },
      {
        path: 'pools/*',
        loader: () => redirect('/'),
      },
      {
        path: 'portfolio',
        loader: () => redirect('/'),
      },
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
])
