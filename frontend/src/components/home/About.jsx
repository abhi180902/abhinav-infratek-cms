import heroImage from '../../assets/images/hero.png'

export default function About() {
  return (
    <section className="about-section section-block" id="about">
      <div className="container about-grid">
        <div className="about-media">
          <img src={heroImage} alt="Abhinav Infratek construction and infrastructure work" />
          <div className="experience-card" aria-label="Company experience">
            <strong>12+</strong>
            <span>Years of trusted project delivery</span>
          </div>
        </div>

        <div className="about-content">
          <p className="section-kicker">About Abhinav Infratek</p>
          <h2>Practical engineering, thoughtful architecture, reliable execution.</h2>
          <p className="about-intro">
            Abhinav Infratek partners with clients across residential, commercial, industrial, and infrastructure
            projects, bringing together planning discipline, site coordination, and a clear commitment to durable
            construction outcomes.
          </p>

          <div className="about-principles">
            <article>
              <span>Vision</span>
              <p>To be a trusted regional partner for purposeful spaces and infrastructure that stand the test of time.</p>
            </article>
            <article>
              <span>Mission</span>
              <p>To deliver every project with technical clarity, transparent communication, and accountable execution.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
