import { BriefcaseBusiness, Compass, Grid2X2, HardHat, Home, Layers3 } from 'lucide-react'
import { services } from '../../data/services'

const serviceIcons = {
  architecture: Compass,
  residential: Home,
  commercial: BriefcaseBusiness,
  industrial: HardHat,
  infrastructure: Grid2X2,
  consulting: Layers3,
}

export default function Services() {
  return (
    <section className="services-section section-block" id="services">
      <div className="container">
        <div className="section-heading">
          <p className="section-kicker">Services</p>
          <h2>Integrated capabilities for planning, construction, and delivery.</h2>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon]

            return (
              <article className="service-card" key={service.id}>
                <span className="service-icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
