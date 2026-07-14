import {
  BadgeCheck,
  Calculator,
  ClipboardCheck,
  Compass,
  Cuboid,
  FileCheck2,
  Hammer,
  HardHat,
  Home,
  LampDesk,
  Route,
} from 'lucide-react'
import SectionCarousel from '../common/SectionCarousel'
import { services } from '../../data/services'

const serviceIcons = {
  planning: Home,
  elevation: Cuboid,
  estimation: Calculator,
  structure: HardHat,
  architecture: Compass,
  interior: LampDesk,
  turnkey: BadgeCheck,
  approval: FileCheck2,
  road: Route,
  supervision: ClipboardCheck,
}

const serviceVisibleCounts = { desktop: 3, tablet: 2, mobile: 1 }

export default function Services() {
  return (
    <section className="services-section section-block" id="services">
      <div className="container carousel-container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Services</span>
          </h2>
        </div>

        <SectionCarousel
          className="services-carousel"
          controlsLabel="Service carousel controls"
          visibleCounts={serviceVisibleCounts}
          items={services}
          getItemKey={(service) => service.id}
          renderItem={(service) => {
            const Icon = serviceIcons[service.icon] ?? Hammer

            return (
              <article className="service-card">
                <span className="service-icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            )
          }}
        />
      </div>
    </section>
  )
}
