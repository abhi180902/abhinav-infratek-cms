import { Mail, Phone } from 'lucide-react'
import { getVisibleLeadershipMembers } from '../../data/leadership'

export default function LeadershipTeam() {
  const visibleMembers = getVisibleLeadershipMembers()

  return (
    <section className="leadership-section section-block" id="leadership">
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Leadership Team</span>
          </h2>
        </div>

        <div className="leadership-grid">
          {visibleMembers.map((member) => (
            <article className="leader-card" key={member.id}>
              <div className="leader-image">
                <img src={member.photo} alt={member.fullName} />
              </div>
              <div className="leader-content">
                <p className="leader-role">{member.designation}</p>
                <h3>{member.fullName}</h3>
                <p className="leader-description">{member.bio}</p>
                <div className="leader-actions">
                  <a className="leader-icon-link" href={`tel:${member.phone.replaceAll(' ', '')}`} aria-label={`Call ${member.fullName}`}>
                    <Phone aria-hidden="true" />
                  </a>
                  {member.email ? (
                    <a className="leader-icon-link" href={`mailto:${member.email}`} aria-label={`Email ${member.fullName}`}>
                      <Mail aria-hidden="true" />
                    </a>
                  ) : null}
                  {member.linkedin ? (
                    <a className="leader-icon-link" href={member.linkedin} aria-label={`${member.fullName} on LinkedIn`} target="_blank" rel="noreferrer">
                      <span aria-hidden="true">in</span>
                    </a>
                  ) : null}
                  <a className="leader-phone" href={`tel:${member.phone.replaceAll(' ', '')}`}>
                    {member.phone}
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
