import { Link } from 'react-router-dom'

const LINKEDIN_URL = 'https://www.linkedin.com/company/wdzsolutions'

export default function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <div>&copy; 2026 WDZ Solutions. All rights reserved.</div>
        <div className="footer-meta">
          Made in Los Angeles
          <span className="footer-meta-dot">·</span>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WDZ Solutions on LinkedIn"
            className="footer-social"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
        </div>
      </div>
      <ul className="footer-links">
        <li><Link to="/privacy">Privacy</Link></li>
        <li><Link to="/terms">Terms</Link></li>
        <li><a href="mailto:contact@wdzsolutions.com">Contact</a></li>
      </ul>
    </footer>
  )
}
