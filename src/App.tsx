import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initSmoothScroll } from './smooth'
import SpaceBackground from './components/SpaceBackground'
import LandingPage from './pages/LandingPage'
import OpenClawPage from './pages/OpenClawPage'
import DemosPage from './pages/DemosPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

export default function App() {
  useEffect(initSmoothScroll, [])
  return (
    <>
    <SpaceBackground />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demos" element={<DemosPage />} />
      <Route path="/openclaw" element={<OpenClawPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
    </>
  )
}
