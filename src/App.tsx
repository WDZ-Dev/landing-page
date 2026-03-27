import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import OpenClawPage from './pages/OpenClawPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/openclaw" element={<OpenClawPage />} />
    </Routes>
  )
}
