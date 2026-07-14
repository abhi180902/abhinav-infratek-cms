import { Mail, MapPin, Phone } from 'lucide-react'
import { settings } from '../../data/settings'

const contactItems = [
  {
    id: 'address',
    icon: MapPin,
    label: 'Address',
    value: settings.address,
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: settings.email,
    href: `mailto:${settings.email}`,
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'Phone Numbers',
    value: settings.phones.join(' / '),
    href: `tel:${settings.phones[0].replaceAll(' ', '')}`,
  },
]

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="contact-section section-block" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <p className="section-kicker">Contact</p>
          <h2>Start a project conversation with {settings.companyName}.</h2>
          <p>{settings.companyIntro}</p>

          <div className="contact-list">
            {contactItems.map((item) => {
              const Icon = item.icon
              const content = (
                <>
                  <span className="contact-item-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </span>
                </>
              )

              return item.href ? (
                <a className="contact-item" href={item.href} key={item.id}>
                  {content}
                </a>
              ) : (
                <div className="contact-item" key={item.id}>
                  {content}
                </div>
              )
            })}
          </div>
          <div className="map-placeholder" aria-label="Google Maps location placeholder">
            <span>Google Maps</span>
            <strong>{settings.location}</strong>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" placeholder="Your name" required />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="form-field">
            <label htmlFor="contact-phone">Phone</label>
            <input id="contact-phone" name="phone" type="tel" placeholder="+91 72593 4720" />
          </div>
          <div className="form-field">
            <label htmlFor="contact-project">Project Type</label>
            <select id="contact-project" name="projectType" defaultValue="">
              <option value="" disabled>
                Select project type
              </option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Infrastructure</option>
            </select>
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" placeholder="Tell us about your project" rows="5" required />
          </div>
          <button className="site-button site-button--primary form-submit" type="submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}
