import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface NavbarProps {
  onOpenModal: () => void
  variant?: 'landing' | 'openclaw'
}

export default function Navbar({ onOpenModal, variant = 'landing' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isOpenClaw = variant === 'openclaw' || location.pathname === '/openclaw'

  const handleSectionClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault()
      setMenuOpen(false)

      if (isOpenClaw) {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(sectionId)
          el?.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      } else {
        const el = document.getElementById(sectionId)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [isOpenClaw, navigate]
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="logo">
        <img src="/logo.png" alt="WDZ" className="logo-mark-img" />
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
          {isOpenClaw ? (
            <Link to="/" onClick={() => setMenuOpen(false)}>Solutions</Link>
          ) : (
            <a href="#features" onClick={(e) => handleSectionClick(e, 'features')}>Solutions</a>
          )}
        </li>
        <li>
          <a href="#process" onClick={(e) => handleSectionClick(e, 'process')}>Process</a>
        </li>
        <li>
          <a href="#about" onClick={(e) => handleSectionClick(e, 'about')}>Team</a>
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
              Contact Us <span className="btn-arrow">&rarr;</span>
            </a>
          )}
        </li>
      </ul>
    </nav>
  )
}
