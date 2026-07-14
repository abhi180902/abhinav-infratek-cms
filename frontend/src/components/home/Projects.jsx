import { useMemo, useState } from 'react'
import { projects } from '../../data/projects'

const filters = ['All', 'Residential', 'Commercial', 'Industrial', 'Infrastructure']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return projects
    }

    return projects.filter((project) => project.category === activeFilter)
  }, [activeFilter])

  return (
    <section className="projects-section section-block" id="projects">
      <div className="container">
        <div className="projects-heading">
          <div className="section-heading">
            <p className="section-kicker">Projects</p>
            <h2>Selected work across built environments and infrastructure.</h2>
          </div>

          <div className="filter-buttons" aria-label="Filter projects by category">
            {filters.map((filter) => (
              <button
                className={`filter-button ${activeFilter === filter ? 'is-active' : ''}`}
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <span>{project.category}</span>
              </div>
              <div className="project-card-body">
                <h3>{project.title}</h3>
                <dl>
                  <div>
                    <dt>Location</dt>
                    <dd>{project.location}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>{project.year}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
