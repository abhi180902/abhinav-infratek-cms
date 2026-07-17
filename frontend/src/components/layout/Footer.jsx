import logo from '../../assets/images/company-logo.png'
import { services } from '../../data/services'
import { settings } from '../../data/settings'

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Leadership Team', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="footer-logo" href="#top" aria-label="Back to top">
            <img src={logo} alt="Abhinav Infratek logo" />
            <span>
              <strong>{settings.companyName}</strong>
              <small>{settings.companyTagline}</small>
            </span>
          </a>
          <p>{settings.footerSummary}</p>
        </div>

        <div className="footer-column">
          <h2>Quick Links</h2>
          <nav aria-label="Footer quick links">
            {quickLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-column">
          <h2>Services</h2>
          <nav aria-label="Footer services">
            {services.slice(0, 5).map((service) => (
              <a href="#services" key={service.id}>
                {service.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-column footer-contact">
          <h2>Contact Information</h2>
          <address>
            <span>{settings.address}</span>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            {settings.phones.map((phone) => (
              <a href={`tel:${phone.replaceAll(' ', '')}`} key={phone}>
                {phone}
              </a>
            ))}
          </address>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          Copyright {new Date().getFullYear()} {settings.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
