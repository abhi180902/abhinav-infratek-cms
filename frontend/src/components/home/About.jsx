import { Building2, Handshake, HardHat, TimerReset } from 'lucide-react'
import aboutImage from '../../assets/images/about-abhinav-infratek.png'

const aboutFeatures = [
  {
    id: 'expert-engineering',
    title: 'Expert Engineering',
    description: 'Innovative structural and architectural solutions designed for safety, durability and performance.',
    Icon: Building2,
  },
  {
    id: 'quality-construction',
    title: 'Quality Construction',
    description: 'High-quality workmanship using premium materials and industry best practices.',
    Icon: HardHat,
  },
  {
    id: 'on-time-delivery',
    title: 'On-Time Delivery',
    description: 'Efficient project management ensuring timely completion without compromising quality.',
    Icon: TimerReset,
  },
  {
    id: 'client-centric-approach',
    title: 'Client-Centric Approach',
    description: "Transparent communication and personalized solutions tailored to every client's vision.",
    Icon: Handshake,
  },
]

const scrollToSection = (sectionId) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

export default function About({ isLoading, settings }) {
  const companyName = settings?.companyName || 'Abhinav Infratek'

  return (
    <section className="about-section section-block" id="about">
      <div className="container about-grid">
        <div className="about-media">
          <img
            src={aboutImage}
            alt="Abhinav Infratek construction planning visual with modern buildings and infrastructure"
          />
          <div className="experience-card" aria-label="Company experience">
            <strong>4+</strong>
            <span>Years of trusted project delivery</span>
          </div>
        </div>

        <div className="about-content">
          <p className="section-kicker">About {companyName}</p>
          <h2>Engineering excellence with architectural planning and trusted execution.</h2>
          <div className="about-copy">
            <p>
              Abhinav Infratek Engineers & Architects is committed to delivering innovative, durable, and
              cost-effective construction solutions. We specialize in residential, commercial and industrial
              projects, combining technical expertise, quality craftsmanship and transparent project management to
              transform ideas into lasting structures.
            </p>
            {/* <p>
              From architectural planning and structural design to construction and project execution, our experienced
              team works closely with every client to ensure projects are completed on time, within budget, and to the
              highest quality standards.
            </p> */}
          </div>

          {isLoading ? <p className="about-loading">Refreshing company details...</p> : null}

          <div className="about-feature-grid" aria-label="Abhinav Infratek strengths">
            {aboutFeatures.map(({ id, title, description, Icon }, index) => (
              <article className="about-feature-card" key={id} style={{ '--feature-index': index }}>
                <span className="about-feature-icon" aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="about-actions">
            <button className="site-button site-button--primary" type="button" onClick={() => scrollToSection('projects')}>
              Explore Projects
            </button>
            <button className="site-button site-button--light about-secondary-button" type="button" onClick={() => scrollToSection('contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
