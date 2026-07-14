import { Mail, Phone } from 'lucide-react'
import { leadership } from '../../data/leadership'

export default function Leadership() {
  return (
    <section className="leadership-section section-block" id="leadership">
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Leadership</span>
          </h2>
        </div>

        <div className="leadership-grid">
          {leadership.map((leader) => (
            <article className="leader-card" key={leader.id}>
              <div className="leader-image">
                <img src={leader.image} alt={leader.name} />
              </div>
              <div className="leader-content">
                <p className="leader-role">{leader.role}</p>
                <h3>{leader.name}</h3>
                <p className="leader-qualification">{leader.qualification}</p>
                <p className="leader-description">{leader.description}</p>
                <div className="leader-actions">
                  <a className="leader-icon-link" href={`tel:${leader.phone.replaceAll(' ', '')}`} aria-label={`Call ${leader.name}`}>
                    <Phone aria-hidden="true" />
                  </a>
                  <a className="leader-icon-link" href="mailto:prasadsangamad162@gmail.com" aria-label={`Email ${leader.name}`}>
                    <Mail aria-hidden="true" />
                  </a>
                  <a className="leader-phone" href={`tel:${leader.phone.replaceAll(' ', '')}`}>
                    {leader.phone}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
