import { PageRoutes } from './app/routes'
import { BrowserRouter } from 'react-router'
import './index.css'

export const App = () => {
  return (
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  )
}
