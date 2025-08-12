import { PageRoutes } from './app/routes'
import { BrowserRouter } from 'react-router'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const App = () => {
  const queryClient = new QueryClient()

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <PageRoutes />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
