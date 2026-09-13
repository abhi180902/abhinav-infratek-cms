import heroBg from '../../assets/images/hero-bg.jpg'

export default function Hero({ settings }) {
  const scrollToSection = (target) => {
    const section = document.getElementById(target)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const companyName = settings?.companyName || 'Abhinav Infratek'
  const heroTitle = settings?.heroTitle || companyName
  const heroSubtitle = settings?.heroSubtitle || settings?.aboutCompany || ''

  return (
    <section className="hero-section" id="top" aria-label="Abhinav Infratek introduction">
      <div
        className="hero-background"
        role="img"
        aria-label="Luxury modern villa exterior by Abhinav Infratek"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="container">
          <div className="hero-copy">
            <p className="hero-kicker">{settings?.tagline || 'Engineers & Architects'}</p>
            <h1 className="hero-title">{heroTitle}</h1>
            {heroSubtitle ? <p className="hero-subtitle">{heroSubtitle}</p> : null}
            <div className="hero-actions" aria-label="Hero actions">
              <button className="site-button site-button--light" type="button" onClick={() => scrollToSection('projects')}>
                View Our Work
              </button>
              <button className="site-button site-button--primary" type="button" onClick={() => scrollToSection('contact')}>
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
