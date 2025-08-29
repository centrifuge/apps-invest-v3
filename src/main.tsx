import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ChakraCentrifugeProvider } from '@ui'
import { router } from '@routes/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraCentrifugeProvider themeKey="light">
      <RouterProvider router={router} />
    </ChakraCentrifugeProvider>
  </StrictMode>
)
