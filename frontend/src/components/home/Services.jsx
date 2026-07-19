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

function normalizeIconKey(iconKey = '') {
  return iconKey.replaceAll('-', '').toLowerCase()
}

export default function Services({ isLoading, services = [] }) {
  const visibleServices = services
    .filter((service) => service.active !== false)
    .sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0))

  return (
    <section className="services-section section-block" id="services">
      <div className="container carousel-container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Services</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="public-section-state" role="status">Loading services...</div>
        ) : visibleServices.length ? (
          <SectionCarousel
            className="services-carousel"
            controlsLabel="Service carousel controls"
            visibleCounts={serviceVisibleCounts}
            items={visibleServices}
            getItemKey={(service) => service.id}
            renderItem={(service) => {
              const Icon = serviceIcons[normalizeIconKey(service.iconKey)] ?? Hammer

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
        ) : (
          <div className="public-section-state">Services are being updated.</div>
        )}
      </div>
    </section>
  )
}
