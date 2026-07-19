import heroImage from '../../assets/images/hero.png'

export default function Hero({ isLoading, settings }) {
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
      <picture className="hero-background">
        <img src={heroImage} alt="Modern infrastructure project by Abhinav Infratek" />
      </picture>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content">
        <div className="container">
          <div className="hero-copy">
            <p className="hero-kicker">{isLoading ? 'Loading company information...' : ''}</p>
            <h1 className="hero-title">{isLoading ? 'Loading website content...' : heroTitle}</h1>
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
