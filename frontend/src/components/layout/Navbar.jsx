import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/company-logo.png'

const navLinks = [
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'services' },
  { label: 'Projects', target: 'projects' },
  { label: 'Leadership Team', target: 'leadership' },
  { label: 'Contact', target: 'contact' },
]

export default function Navbar({ forceScrolled = false, settings }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const companyName = settings?.companyName || 'Abhinav Infratek'
  const tagline = settings?.tagline || 'Engineers & Architects'
  const logoUrl = settings?.logoUrl || logo

  useEffect(() => {
    const handleScroll = () => setIsScrolled(forceScrolled || window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [forceScrolled, location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)

    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  const scrollToSection = (target) => {
    setIsOpen(false)

    if (target === 'top') {
      if (location.pathname !== '/') {
        navigate('/')
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const targetPath = `/${target}`

    if (location.pathname !== targetPath) {
      navigate(targetPath)
      return
    }

    window.requestAnimationFrame(() => {
      const section = document.getElementById(target)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  const headerClassName = [
    'site-header',
    isScrolled || forceScrolled ? 'is-scrolled' : '',
    isOpen ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleStartProject = () => {
    scrollToSection('contact')
  }

  const handleBrandClick = () => {
    scrollToSection('top')
  }

  const handleNavClick = (target) => {
    scrollToSection(target)
  }

  const handleMenuToggle = () => {
    setIsOpen((current) => !current)
  }

  const renderNavLink = (link) => {
    const isActive = location.pathname === `/${link.target}`

    return (
      <button
        className={`nav-link ${isActive ? 'is-active' : ''}`}
        type="button"
        key={link.target}
        onClick={() => handleNavClick(link.target)}
      >
        {link.label}
      </button>
    )
  }

  return (
    <header className={headerClassName}>
      <nav className="site-nav container" aria-label="Primary navigation">
        <button className="brand-link" type="button" onClick={handleBrandClick} aria-label="Go to top">
          <img className="brand-logo" src={logoUrl} alt={`${companyName} logo`} />
          <span className="brand-copy">
            <span className="brand-name">{companyName}</span>
            <span className="brand-tagline">{tagline}</span>
          </span>
        </button>

        <div className={`nav-menu ${isOpen ? 'is-open' : ''}`} id="primary-menu">
          <div className="nav-links">{navLinks.map(renderNavLink)}</div>
          <button className="site-button site-button--primary" type="button" onClick={handleStartProject}>
            Start a Project
          </button>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-controls="primary-menu"
          aria-expanded={isOpen}
          onClick={handleMenuToggle}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="menu-toggle-lines" aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}
