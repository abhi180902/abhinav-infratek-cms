import heroImage from '../../assets/images/hero.png'

export default function Hero() {
  const scrollToSection = (target) => {
    const section = document.getElementById(target)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="hero-section" id="top" aria-label="Abhinav Infratek introduction">
      <picture className="hero-background">
        <img src={heroImage} alt="Modern infrastructure project by Abhinav Infratek" />
      </picture>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="container">
          <div className="hero-copy">
            <p className="hero-kicker">Engineers & Architects - Karnataka</p>
            <h1 className="hero-title">
              Building precise spaces for <span>lasting progress.</span>
            </h1>
            <p className="hero-subtitle">
              Abhinav Infratek delivers dependable architecture, engineering, and infrastructure execution with clarity,
              craft, and accountability from concept to completion.
            </p>
            <div className="hero-actions" aria-label="Hero actions">
              <button className="site-button site-button--light" type="button" onClick={() => scrollToSection('projects')}>
                View Our Work
              </button>
              <button className="site-button site-button--outline" type="button" onClick={() => scrollToSection('contact')}>
                Start a Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="scroll-indicator" type="button" onClick={() => scrollToSection('projects')}>
        <span className="scroll-indicator-mark" aria-hidden="true" />
        <span>Scroll</span>
      </button>
    </section>
  )
}
