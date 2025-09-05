import { Route, Routes } from 'react-router-dom'
import SidebarLayout from '@/components/ui/LayoutComponents'
import { Severities } from './severities/index_severities'
import { Home } from './home'
export function PageRoutes() {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/severities" element={<Severities />} />
      </Route>
    </Routes>
  )
}
