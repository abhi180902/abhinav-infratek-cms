import { useMemo, useState } from 'react'
import SectionCarousel from '../common/SectionCarousel'
import { projectCategories, projects } from '../../data/projects'

const projectVisibleCounts = { desktop: 3, tablet: 2, mobile: 1 }

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
      <div className="container carousel-container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Projects</span>
          </h2>
        </div>

        <div className="projects-heading">
          <div className="filter-buttons" aria-label="Filter projects by category">
            {projectCategories.map((filter) => (
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

        <SectionCarousel
          key={activeFilter}
          className="projects-carousel"
          controlsClassName="project-carousel-controls"
          controlsLabel="Project carousel controls"
          visibleCounts={projectVisibleCounts}
          items={filteredProjects}
          resetKey={activeFilter}
          getItemKey={(project) => project.id}
          renderItem={(project) => (
            <article className="project-card">
              <div className="project-image">
                <img src={project.coverImage} alt={project.title} />
              </div>
              <div className="project-card-body">
                <span className="project-category">{project.category}</span>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <p className="project-meta">{project.location}</p>
                <p className="project-year">{project.year}</p>
              </div>
            </article>
          )}
        />
      </div>
    </section>
  )
}
