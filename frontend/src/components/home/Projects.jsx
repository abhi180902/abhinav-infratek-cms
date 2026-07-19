import { useMemo, useState } from 'react'
import SectionCarousel from '../common/SectionCarousel'

const projectVisibleCounts = { desktop: 3, tablet: 2, mobile: 1 }

function getProjectYear(project) {
  return project.completionDate ? new Date(project.completionDate).getFullYear() : ''
}

export default function Projects({ isLoading, projects = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const visibleProjects = useMemo(
    () =>
      projects
        .filter((project) => project.active !== false)
        .sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0)),
    [projects],
  )

  const projectCategories = useMemo(
    () => ['All', ...Array.from(new Set(visibleProjects.map((project) => project.category).filter(Boolean)))],
    [visibleProjects],
  )

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') {
      return visibleProjects
    }

    return visibleProjects.filter((project) => project.category === activeFilter)
  }, [activeFilter, visibleProjects])

  return (
    <section className="projects-section section-block" id="projects">
      <div className="container carousel-container">
        <div className="section-heading section-heading--center">
          <h2>
            Our <span>Projects</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="public-section-state" role="status">Loading projects...</div>
        ) : visibleProjects.length ? (
          <>
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
                {project.imageUrl ? <img src={project.imageUrl} alt={project.title} /> : null}
              </div>
              <div className="project-card-body">
                <span className="project-category">{project.category}</span>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <p className="project-meta">{project.location}</p>
                {getProjectYear(project) ? <p className="project-year">{getProjectYear(project)}</p> : null}
              </div>
            </article>
          )}
        />
          </>
        ) : (
          <div className="public-section-state">Projects are being updated.</div>
        )}
      </div>
    </section>
  )
}
