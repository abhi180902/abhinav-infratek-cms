import logo from '../../assets/images/company-logo.png'
import { buildWhatsAppUrl } from '../../utils/contactLinks'

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Leadership Team', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { key: 'facebookUrl', label: 'Facebook' },
  { key: 'instagramUrl', label: 'Instagram' },
  { key: 'linkedinUrl', label: 'LinkedIn' },
  { key: 'youtubeUrl', label: 'YouTube' },
]

export default function Footer({ settings }) {
  const companyName = settings?.companyName || 'Abhinav Infratek'
  const tagline = settings?.tagline || 'Engineers & Architects'
  const logoUrl = settings?.logoUrl || logo
  const phones = [settings?.phone, settings?.alternatePhone].filter(Boolean)
  const whatsappUrl = buildWhatsAppUrl(settings?.whatsappNumber)
  const visibleSocialLinks = socialLinks.filter((link) => settings?.[link.key])

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
            {settings?.whatsappNumber && whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp: {settings.whatsappNumber}
              </a>
            ) : null}
          </address>
        </div>

        {visibleSocialLinks.length ? (
          <div className="footer-column">
            <h2>Social Links</h2>
            <nav aria-label="Footer social links">
              {visibleSocialLinks.map((link) => (
                <a href={settings[link.key]} key={link.key} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </div>

      <div className="container footer-bottom">
        <p>
          Copyright {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
