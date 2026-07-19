import { UsersRound } from 'lucide-react'

export default function LeadershipTeam({ isLoading, members = [] }) {
  const visibleMembers = members
    .filter((member) => member.active !== false)
    .sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0))

  return (
    <section className="leadership-section section-block" id="leadership">
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Leadership Team</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="public-section-state" role="status">Loading leadership team...</div>
        ) : visibleMembers.length ? (
          <div className="leadership-grid">
          {visibleMembers.map((member) => (
            <article className="leader-card" key={member.id}>
              <div className="leader-image">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} />
                ) : (
                  <span className="leader-image-placeholder" aria-hidden="true">
                    <UsersRound />
                  </span>
                )}
              </div>
              <div className="leader-content">
                <p className="leader-role">{member.designation}</p>
                <h3>{member.name}</h3>
                <p className="leader-description">{member.bio}</p>
              </div>
            </article>
          ))}
          </div>
        ) : (
          <div className="public-section-state">Leadership profiles are being updated.</div>
        )}
      </div>
    </section>
  )
}
