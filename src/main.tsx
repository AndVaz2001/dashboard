import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PageRoutes } from './app/routes'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  </StrictMode>,
)
