import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { scrollToEl } from '../smooth'

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

      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const el = document.getElementById(sectionId)
          scrollToEl(el)
        }, 150)
      } else {
        const el = document.getElementById(sectionId)
        scrollToEl(el)
      }
    },
    [location.pathname, navigate]
  )

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 40)
    }
    const handleScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
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
          <Link to="/demos" className={location.pathname === '/demos' ? 'nav-active' : ''} onClick={() => setMenuOpen(false)}>Demos</Link>
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
              Book a free call
            </a>
          )}
        </li>
      </ul>
    </nav>
  )
}
