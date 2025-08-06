import { Route, Routes } from 'react-router'

export function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/about" element={<div>About Page</div>} />
    </Routes>
  )
}
