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
          <h2>Engineering excellence with architectural planning and trusted execution.</h2>
          <p className="about-intro">
            Abhinav Infratek is a Ranebennur-based engineering and architecture firm focused on residential projects,
            commercial spaces, interior solutions, and turnkey construction. The team combines modern planning,
            structural thinking, estimation clarity, and hands-on supervision to deliver work built on quality and trust.
          </p>

          <div className="about-principles">
            <article>
              <span>Vision</span>
              <p>To create modern, durable, and practical spaces that improve how people live, work, and build.</p>
            </article>
            <article>
              <span>Mission</span>
              <p>To deliver planning, consultancy, interiors, approvals, and civil work with transparency and care.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
