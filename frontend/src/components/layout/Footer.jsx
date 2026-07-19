import logo from '../../assets/images/company-logo.png'

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Leadership Team', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer({ services = [], settings }) {
  const companyName = settings?.companyName || 'Abhinav Infratek'
  const tagline = settings?.tagline || 'Engineers & Architects'
  const logoUrl = settings?.logoUrl || logo
  const phones = [settings?.phone, settings?.alternatePhone].filter(Boolean)
  const visibleServices = services
    .filter((service) => service.active !== false)
    .sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0))
    .slice(0, 5)

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="footer-logo" href="#top" aria-label="Back to top">
            <img src={logoUrl} alt={`${companyName} logo`} />
            <span>
              <strong>{companyName}</strong>
              <small>{tagline}</small>
            </span>
          </a>
          <p>{settings?.aboutCompany}</p>
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
            {visibleServices.map((service) => (
              <a href="#services" key={service.id}>
                {service.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-column footer-contact">
          <h2>Contact Information</h2>
          <address>
            {settings?.address ? <span>{settings.address}</span> : null}
            {settings?.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {phones.map((phone) => (
              <a href={`tel:${phone.replaceAll(' ', '')}`} key={phone}>
                {phone}
              </a>
            ))}
          </address>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          Copyright {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
