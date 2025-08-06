import { Route, Routes } from 'react-router'
import { Home } from './home'

export function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
