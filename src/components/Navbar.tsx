import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  onOpenModal: () => void
  variant?: 'landing' | 'openclaw'
}

export default function Navbar({ onOpenModal, variant = 'landing' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isOpenClaw = variant === 'openclaw' || location.pathname === '/openclaw'

  // Prefix hash links with / when not on the landing page
  const sectionLink = (hash: string) => (isOpenClaw ? `/${hash}` : hash)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="logo">
        <div className="logo-mark">W</div>
        WDZ Solutions
      </Link>
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li>
          <a href={sectionLink('#features')} onClick={() => setMenuOpen(false)}>Solutions</a>
        </li>
        <li>
          <a href={sectionLink('#process')} onClick={() => setMenuOpen(false)}>Process</a>
        </li>
        <li>
          <a href={sectionLink('#about')} onClick={() => setMenuOpen(false)}>Team</a>
        </li>
        <li>
          <Link to="/openclaw" className={isOpenClaw ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>
            OpenClaw
          </Link>
        </li>
        <li>
          {isOpenClaw ? (
            <a
              href="#quote"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Get a Quote <span className="btn-arrow">&rarr;</span>
            </a>
          ) : (
            <a
              href="#"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                onOpenModal()
              }}
            >
              Join Waitlist <span className="btn-arrow">&rarr;</span>
            </a>
          )}
        </li>
      </ul>
    </nav>
  )
}
