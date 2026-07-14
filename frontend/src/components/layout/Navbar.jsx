import { useEffect, useState } from 'react'
import logo from '../../assets/images/abhinav-infratek-logo.png'

const navLinks = [
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'services' },
  { label: 'Projects', target: 'projects' },
  { label: 'Leadership', target: 'leadership' },
  { label: 'Contact', target: 'contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)

    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  const scrollToSection = (target) => {
    setIsOpen(false)

    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const section = document.getElementById(target)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${isOpen ? 'is-open' : ''}`}>
      <nav className="site-nav container" aria-label="Primary navigation">
        <button className="brand-link" type="button" onClick={() => scrollToSection('top')} aria-label="Go to top">
          <img className="brand-logo" src={logo} alt="Abhinav Infratek logo" />
          <span className="brand-copy">
            <span className="brand-name">ABHINAV INFRATEK</span>
            <span className="brand-tagline">Engineers & Architects</span>
          </span>
        </button>

        <div className={`nav-menu ${isOpen ? 'is-open' : ''}`} id="primary-menu">
          <div className="nav-links">
            {navLinks.map((link) => (
              <button className="nav-link" type="button" key={link.target} onClick={() => scrollToSection(link.target)}>
                {link.label}
              </button>
            ))}
          </div>
          <button className="site-button site-button--primary" type="button" onClick={() => scrollToSection('contact')}>
            Start a Project
          </button>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-controls="primary-menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="menu-toggle-lines" aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}
