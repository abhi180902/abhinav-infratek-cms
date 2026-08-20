import { FolderKanban, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import { createProject, deleteProject, getProjects, updateProject } from '../../services/projectsService'

const defaultFormValues = {
  active: true,
  category: '',
  completionDate: '',
  description: '',
  displayOrder: 0,
  featured: false,
  coverImage: null,
  galleryImages: [],
  location: '',
  removeImageIds: [],
  slug: '',
  title: '',
}

function normalizeProject(project) {
  return {
    active: project.active ?? true,
    category: project.category ?? '',
    completionDate: project.completionDate ?? '',
    description: project.description ?? '',
    displayOrder: project.displayOrder ?? 0,
    featured: project.featured ?? false,
    coverImage: null,
    galleryImages: [],
    location: project.location ?? '',
    removeImageIds: [],
    slug: project.slug ?? '',
    title: project.title ?? '',
  }
}

function createPayload(values) {
  return {
    active: values.active,
    category: values.category.trim(),
    completionDate: values.completionDate || null,
    description: values.description.trim(),
    displayOrder: Number(values.displayOrder),
    featured: values.featured,
    coverImage: values.coverImage?.file ?? null,
    galleryImages: values.galleryImages.map((image) => image.file),
    location: values.location.trim(),
    removeImageIds: values.removeImageIds,
    slug: values.slug.trim(),
    title: values.title.trim(),
  }
}

function createPreviewImage(file) {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  }
}

function extractValidationErrors(error) {
  const validationErrors = error.response?.data?.validationErrors

  if (!validationErrors) {
    return {}
  }

  if (Array.isArray(validationErrors)) {
    return validationErrors.reduce((errors, item) => {
      if (item.field && item.message) {
        errors[item.field] = item.message
      }

      return errors
    }, {})
  }

  return validationErrors
}

function extractErrorMessage(error, fallback) {
  const data = error.response?.data

  if (data?.message) {
    return data.message
  }

  if (data?.validationErrors) {
    return 'Please review the highlighted fields.'
  }

  return fallback
}

export default function Projects() {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchProjects = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    setError('')

    try {
      const data = await getProjects()
      setProjects(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load projects.'))
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      try {
        const data = await getProjects()

        if (isMounted) {
          setProjects(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load projects.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((first, second) => {
        const orderDifference = (first.displayOrder ?? 0) - (second.displayOrder ?? 0)
        return orderDifference || first.title.localeCompare(second.title)
      }),
    [projects],
  )

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return sortedProjects
    }

    return sortedProjects.filter((project) =>
      [project.title, project.slug, project.category, project.location, project.description].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query),
      ),
    )
  }, [searchTerm, sortedProjects])

  const closeForm = (forceClose = false) => {
    if (isSaving && !forceClose) {
      return
    }

    if (formValues.coverImage?.previewUrl) {
      URL.revokeObjectURL(formValues.coverImage.previewUrl)
    }
    formValues.galleryImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    setEditingProject(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(false)
  }

  const openCreateForm = () => {
    setEditingProject(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(true)
  }

  const openEditForm = (project) => {
    setEditingProject(project)
    setFormError('')
    setFormErrors({})
    setFormValues(normalizeProject(project))
    setIsFormOpen(true)
  }

  const updateField = (event) => {
    const { checked, files, name, type, value } = event.target

    if (name === 'coverImage') {
      setFormValues((currentValues) => ({
        ...currentValues,
        coverImage: (() => {
          if (currentValues.coverImage?.previewUrl) {
            URL.revokeObjectURL(currentValues.coverImage.previewUrl)
          }

          return files[0] ? createPreviewImage(files[0]) : null
        })(),
      }))
      return
    }

    if (name === 'galleryImages') {
      const selectedImages = Array.from(files ?? []).map(createPreviewImage)

      setFormValues((currentValues) => ({
        ...currentValues,
        galleryImages: [...currentValues.galleryImages, ...selectedImages],
      }))

      event.target.value = ''
      return
    }

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] ?? null : value,
    }))
  }

  const removeSelectedGalleryImage = (imageId) => {
    setFormValues((currentValues) => {
      const imageToRemove = currentValues.galleryImages.find((image) => image.id === imageId)

      if (imageToRemove?.previewUrl) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return {
        ...currentValues,
        galleryImages: currentValues.galleryImages.filter((image) => image.id !== imageId),
      }
    })
  }

  const toggleExistingGalleryImageRemoval = (imageId) => {
    setFormValues((currentValues) => {
      const isMarked = currentValues.removeImageIds.includes(imageId)

      return {
        ...currentValues,
        removeImageIds: isMarked
          ? currentValues.removeImageIds.filter((currentImageId) => currentImageId !== imageId)
          : [...currentValues.removeImageIds, imageId],
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setFormError('')
    setFormErrors({})
    setSuccessMessage('')

    try {
      const payload = createPayload(formValues)

      if (editingProject) {
        await updateProject(editingProject.id, payload)
        setSuccessMessage('Project updated successfully.')
      } else {
        await createProject(payload)
        setSuccessMessage('Project created successfully.')
      }

      closeForm(true)
      await fetchProjects()
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setFormError(extractErrorMessage(requestError, 'Unable to save project.'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setIsDeleting(true)
    setSuccessMessage('')

    try {
      await deleteProject(deleteTarget.id)
      setSuccessMessage('Project deleted successfully.')
      setDeleteTarget(null)
      await fetchProjects()
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to delete project.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="admin-field-error">{formErrors[field]}</small> : null)

  return (
    <section>
      <PageHeader
        breadcrumb="Manage Content / Projects"
        title="Projects"
        description="Create, edit, archive, and search public portfolio projects."
        action={
          <button className="admin-primary-button" type="button" onClick={openCreateForm}>
            <Plus aria-hidden="true" size={18} />
            Add Project
          </button>
        }
      />

      {successMessage ? (
        <p className="admin-success" role="status">
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <div className="admin-error admin-inline-alert" role="alert">
          <span>{error}</span>
          <button className="admin-secondary-button" type="button" onClick={() => fetchProjects({ showLoader: true })}>
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="admin-table-card">
        <div className="table-toolbar">
          <SearchBar
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="admin-secondary-button" type="button" onClick={() => fetchProjects({ showLoader: true })} disabled={isLoading}>
            <RefreshCw aria-hidden="true" size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="admin-table-loading" role="status">
            Loading projects...
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Completion</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="admin-project-cell">
                        {project.imageUrl ? <img src={project.imageUrl} alt={`${project.title} project`} /> : null}
                        <span>
                          <strong>{project.title}</strong>
                          <small>{project.slug}</small>
                          <span>{project.description}</span>
                        </span>
                      </div>
                    </td>
                    <td>{project.category}</td>
                    <td>{project.location || 'Not set'}</td>
                    <td>{project.completionDate || 'Not set'}</td>
                    <td>{project.displayOrder}</td>
                    <td>
                      <div className="admin-status-stack">
                        <StatusBadge tone={project.active ? 'success' : 'warning'}>{project.active ? 'Active' : 'Inactive'}</StatusBadge>
                        {project.featured ? <StatusBadge tone="warning">Featured</StatusBadge> : null}
                      </div>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-button" onClick={() => openEditForm(project)} aria-label={`Edit ${project.title}`}>
                          <Pencil aria-hidden="true" size={17} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button admin-icon-button--danger"
                          onClick={() => setDeleteTarget(project)}
                          aria-label={`Delete ${project.title}`}
                        >
                          <Trash2 aria-hidden="true" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-with-action">
            <EmptyState
              icon={FolderKanban}
              title="No projects found"
              description={searchTerm ? 'No projects match your search.' : 'Create the first portfolio project for the public website.'}
            />
            {!searchTerm ? (
              <button className="admin-primary-button" type="button" onClick={openCreateForm}>
                <Plus aria-hidden="true" size={18} />
                Add Project
              </button>
            ) : null}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingProject ? 'Edit Project' : 'Add Project'}
        footer={
          <>
            <button className="admin-secondary-button" type="button" onClick={closeForm} disabled={isSaving}>
              Cancel
            </button>
            <button className="admin-primary-button" type="submit" form="project-form" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Project'}
            </button>
          </>
        }
      >
        <form className="admin-form" id="project-form" onSubmit={handleSubmit}>
          {formError ? (
            <p className="admin-error" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="project-title">Title</label>
              <input id="project-title" name="title" value={formValues.title} onChange={updateField} required />
              {renderFieldError('title')}
            </div>

            <div className="admin-field">
              <label htmlFor="project-slug">Slug</label>
              <input id="project-slug" name="slug" value={formValues.slug} onChange={updateField} required />
              {renderFieldError('slug')}
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="project-category">Category</label>
              <input id="project-category" name="category" value={formValues.category} onChange={updateField} required />
              {renderFieldError('category')}
            </div>

            <div className="admin-field">
              <label htmlFor="project-location">Location</label>
              <input id="project-location" name="location" value={formValues.location} onChange={updateField} />
              {renderFieldError('location')}
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="project-completion-date">Completion Date</label>
              <input
                id="project-completion-date"
                name="completionDate"
                type="date"
                value={formValues.completionDate}
                onChange={updateField}
              />
              {renderFieldError('completionDate')}
            </div>

            <div className="admin-field">
              <label htmlFor="project-order">Display Order</label>
              <input
                id="project-order"
                min="0"
                name="displayOrder"
                type="number"
                value={formValues.displayOrder}
                onChange={updateField}
                required
              />
              {renderFieldError('displayOrder')}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              name="description"
              value={formValues.description}
              onChange={updateField}
              required
            />
            {renderFieldError('description')}
          </div>

          <div className="admin-field">
            <label htmlFor="project-cover-image">Cover Image</label>
            <input
              id="project-cover-image"
              name="coverImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={updateField}
              required={!editingProject}
            />
            {editingProject?.imageUrl ? <small className="admin-help-text">Leave empty to keep the existing cover image.</small> : null}
            {formValues.coverImage ? (
              <div className="admin-media-preview-grid">
                <div className="admin-media-preview-card">
                  <img src={formValues.coverImage.previewUrl} alt="Selected cover preview" />
                  <span>{formValues.coverImage.file.name}</span>
                </div>
              </div>
            ) : null}
            {renderFieldError('coverImage')}
            {renderFieldError('image')}
          </div>

          <div className="admin-field">
            <label htmlFor="project-gallery-images">Project Gallery</label>
            <input
              id="project-gallery-images"
              name="galleryImages"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={updateField}
            />
            <small className="admin-help-text">Choose multiple additional images for this project's gallery.</small>
            {renderFieldError('galleryImages')}

            {editingProject?.images?.length ? (
              <div className="admin-media-preview-grid" aria-label="Existing gallery images">
                {editingProject.images.map((image) => {
                  const isMarked = formValues.removeImageIds.includes(image.id)

                  return (
                    <div className={`admin-media-preview-card ${isMarked ? 'is-marked-for-removal' : ''}`} key={image.id}>
                      <img src={image.imageUrl} alt={`${editingProject.title} gallery`} />
                      <button type="button" onClick={() => toggleExistingGalleryImageRemoval(image.id)}>
                        {isMarked ? 'Undo' : 'Remove'}
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : null}

            {formValues.galleryImages.length ? (
              <div className="admin-media-preview-grid" aria-label="Selected gallery images">
                {formValues.galleryImages.map((image) => (
                  <div className="admin-media-preview-card" key={image.id}>
                    <img src={image.previewUrl} alt={`${image.file.name} preview`} />
                    <span>{image.file.name}</span>
                    <button type="button" onClick={() => removeSelectedGalleryImage(image.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="admin-form-grid">
            <label className="admin-checkbox admin-toggle-field">
              <input name="active" type="checkbox" checked={formValues.active} onChange={updateField} />
              Active on public website
            </label>
            <label className="admin-checkbox admin-toggle-field">
              <input name="featured" type="checkbox" checked={formValues.featured} onChange={updateField} />
              Featured project
            </label>
          </div>
          {renderFieldError('active')}
          {renderFieldError('featured')}
        </form>
      </AdminModal>

      <ConfirmDialog
        confirmLabel="Delete Project"
        isOpen={Boolean(deleteTarget)}
        isSubmitting={isDeleting}
        message={deleteTarget ? `Delete "${deleteTarget.title}"? This action cannot be undone.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete project"
      />
    </section>
  )
}
