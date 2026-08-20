import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import logo from '../assets/images/company-logo.png'
import { getPublicProject, getPublicSiteSettings } from '../services/publicWebsiteService'

function getProjectYear(project) {
  return project?.completionDate ? new Date(project.completionDate).getFullYear() : ''
}

export default function ProjectDetails() {
  const { slug } = useParams()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [settings, setSettings] = useState(null)
  const touchStartX = useRef(null)

  const galleryImages = useMemo(() => {
    if (!project) {
      return []
    }

    const coverImage = project.imageUrl
      ? [{ id: 'cover', imageUrl: project.imageUrl, displayOrder: -1 }]
      : []

    return [...coverImage, ...(project.images ?? [])]
  }, [project])

  const selectedImage = selectedImageIndex === null ? null : galleryImages[selectedImageIndex]
  const canShowPrevious = selectedImageIndex !== null && selectedImageIndex > 0
  const canShowNext = selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null)
  }, [])

  const showPreviousImage = useCallback(() => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null || currentIndex <= 0) {
        return currentIndex
      }

      return currentIndex - 1
    })
  }, [])

  const showNextImage = useCallback(() => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null || currentIndex >= galleryImages.length - 1) {
        return currentIndex
      }

      return currentIndex + 1
    })
  }, [galleryImages.length])

  const loadProjectDetails = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      const [projectData, settingsData] = await Promise.all([getPublicProject(slug), getPublicSiteSettings()])
      setProject(projectData)
      setSettings(settingsData)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load project details.')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void Promise.resolve().then(loadProjectDetails)
  }, [loadProjectDetails])

  useEffect(() => {
    if (selectedImageIndex === null) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }

      if (event.key === 'ArrowLeft') {
        showPreviousImage()
      }

      if (event.key === 'ArrowRight') {
        showNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeLightbox, selectedImageIndex, showNextImage, showPreviousImage])

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const distance = touchStartX.current - touchEndX
    touchStartX.current = null

    if (Math.abs(distance) < 42) {
      return
    }

    if (distance > 0) {
      showNextImage()
    } else {
      showPreviousImage()
    }
  }

  return (
    <div className="site-shell">
      <header className="project-details-header">
        <div className="container project-details-header-inner">
          <Link className="project-back-link" to="/projects">
            <ArrowLeft aria-hidden="true" />
            Back to Projects
          </Link>
          <Link className="project-details-brand" to="/" aria-label="Go to Abhinav Infratek home">
            <img src={settings?.logoUrl || logo} alt={`${settings?.companyName || 'Abhinav Infratek'} logo`} />
            <span>
              <strong>{settings?.companyName || 'Abhinav Infratek'}</strong>
              <small>{settings?.tagline || 'Engineers & Architects'}</small>
            </span>
          </Link>
        </div>
      </header>

      <main className="project-details-page">
        <section className="project-details-hero">
          <div className="container">
            {isLoading ? (
              <div className="public-section-state" role="status">
                Loading project details...
              </div>
            ) : error ? (
              <div className="public-alert" role="alert">
                <span>{error}</span>
                <button className="site-button site-button--primary" type="button" onClick={loadProjectDetails}>
                  Retry
                </button>
              </div>
            ) : project ? (
              <>
                <div className="project-details-grid">
                  <div className="project-details-copy">
                    <p className="section-kicker">{project.category}</p>
                    <h1>{project.title}</h1>
                    <div className="project-details-meta">
                      {project.location ? (
                        <span>
                          <MapPin aria-hidden="true" />
                          {project.location}
                        </span>
                      ) : null}
                      {getProjectYear(project) ? (
                        <span>
                          <CalendarDays aria-hidden="true" />
                          {getProjectYear(project)}
                        </span>
                      ) : null}
                    </div>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-details-cover">
                    {project.imageUrl ? <img src={project.imageUrl} alt={`${project.title} cover`} /> : null}
                  </div>
                </div>

                <div className="project-gallery-section">
                  <div className="section-heading">
                    <h2>
                      Project <span>Gallery</span>
                    </h2>
                  </div>

                  {galleryImages.length ? (
                    <div className="project-gallery-grid">
                      {galleryImages.map((image, index) => (
                        <button
                          className="project-gallery-item"
                          key={image.id}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          aria-label={`Open ${project.title} gallery image`}
                        >
                          <img src={image.imageUrl} alt={`${project.title} gallery`} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="public-section-state">Project gallery images are being updated.</div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </section>
      </main>
      <Footer settings={settings} />

      {selectedImage ? (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Project image preview"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="project-lightbox-close" type="button" onClick={closeLightbox} aria-label="Close image preview">
            <X aria-hidden="true" />
          </button>
          <button
            className="project-lightbox-nav project-lightbox-nav--previous"
            type="button"
            onClick={showPreviousImage}
            disabled={!canShowPrevious}
            aria-label="View previous project image"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <img src={selectedImage.imageUrl} alt={`${project?.title ?? 'Project'} large preview`} />
          <button
            className="project-lightbox-nav project-lightbox-nav--next"
            type="button"
            onClick={showNextImage}
            disabled={!canShowNext}
            aria-label="View next project image"
          >
            <ChevronRight aria-hidden="true" />
          </button>
          <span className="project-lightbox-counter">
            {selectedImageIndex + 1} / {galleryImages.length}
          </span>
        </div>
      ) : null}
    </div>
  )
}
