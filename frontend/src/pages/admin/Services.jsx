import { Pencil, Plus, RefreshCw, Trash2, Wrench } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import { createService, deleteService, getServices, updateService } from '../../services/servicesService'

const defaultFormValues = {
  active: true,
  description: '',
  displayOrder: 0,
  iconKey: '',
  slug: '',
  title: '',
}

function normalizeService(service) {
  return {
    active: service.active ?? true,
    description: service.description ?? '',
    displayOrder: service.displayOrder ?? 0,
    iconKey: service.iconKey ?? '',
    slug: service.slug ?? '',
    title: service.title ?? '',
  }
}

function createPayload(values) {
  return {
    active: values.active,
    description: values.description.trim(),
    displayOrder: Number(values.displayOrder),
    iconKey: values.iconKey.trim(),
    slug: values.slug.trim(),
    title: values.title.trim(),
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

export default function Services() {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [services, setServices] = useState([])
  const [successMessage, setSuccessMessage] = useState('')

  const fetchServices = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    setError('')

    try {
      const data = await getServices()
      setServices(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load services.'))
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadServices() {
      try {
        const data = await getServices()

        if (isMounted) {
          setServices(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load services.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadServices()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedServices = useMemo(
    () =>
      [...services].sort((first, second) => {
        const orderDifference = (first.displayOrder ?? 0) - (second.displayOrder ?? 0)
        return orderDifference || first.title.localeCompare(second.title)
      }),
    [services],
  )

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return sortedServices
    }

    return sortedServices.filter((service) =>
      [service.title, service.slug, service.iconKey, service.description].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query),
      ),
    )
  }, [searchTerm, sortedServices])

  const closeForm = (forceClose = false) => {
    if (isSaving && !forceClose) {
      return
    }

    setEditingService(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(false)
  }

  const openCreateForm = () => {
    setEditingService(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(true)
  }

  const openEditForm = (service) => {
    setEditingService(service)
    setFormError('')
    setFormErrors({})
    setFormValues(normalizeService(service))
    setIsFormOpen(true)
  }

  const updateField = (event) => {
    const { checked, name, type, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setFormError('')
    setFormErrors({})
    setSuccessMessage('')

    try {
      const payload = createPayload(formValues)

      if (editingService) {
        await updateService(editingService.id, payload)
        setSuccessMessage('Service updated successfully.')
      } else {
        await createService(payload)
        setSuccessMessage('Service created successfully.')
      }

      closeForm(true)
      await fetchServices()
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setFormError(extractErrorMessage(requestError, 'Unable to save service.'))
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
      await deleteService(deleteTarget.id)
      setSuccessMessage('Service deleted successfully.')
      setDeleteTarget(null)
      await fetchServices()
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to delete service.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="admin-field-error">{formErrors[field]}</small> : null)

  return (
    <section>
      <PageHeader
        breadcrumb="Manage Content / Services"
        title="Services"
        description="Manage service cards, icons, order, and public descriptions."
        action={
          <button className="admin-primary-button" type="button" onClick={openCreateForm}>
            <Plus aria-hidden="true" size={18} />
            Add Service
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
          <button className="admin-secondary-button" type="button" onClick={() => fetchServices({ showLoader: true })}>
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="admin-table-card">
        <div className="table-toolbar">
          <SearchBar
            placeholder="Search services..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="admin-secondary-button" type="button" onClick={() => fetchServices({ showLoader: true })} disabled={isLoading}>
            <RefreshCw aria-hidden="true" size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="admin-table-loading" role="status">
            Loading services...
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Slug</th>
                  <th>Icon</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.title}</strong>
                      <span>{service.description}</span>
                    </td>
                    <td>{service.slug}</td>
                    <td>{service.iconKey}</td>
                    <td>{service.displayOrder}</td>
                    <td>
                      <StatusBadge tone={service.active ? 'success' : 'warning'}>{service.active ? 'Active' : 'Inactive'}</StatusBadge>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-button" onClick={() => openEditForm(service)} aria-label={`Edit ${service.title}`}>
                          <Pencil aria-hidden="true" size={17} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button admin-icon-button--danger"
                          onClick={() => setDeleteTarget(service)}
                          aria-label={`Delete ${service.title}`}
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
              icon={Wrench}
              title="No services found"
              description={searchTerm ? 'No services match your search.' : 'Create the first service card for the public website.'}
            />
            {!searchTerm ? (
              <button className="admin-primary-button" type="button" onClick={openCreateForm}>
                <Plus aria-hidden="true" size={18} />
                Add Service
              </button>
            ) : null}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingService ? 'Edit Service' : 'Add Service'}
        footer={
          <>
            <button className="admin-secondary-button" type="button" onClick={closeForm} disabled={isSaving}>
              Cancel
            </button>
            <button className="admin-primary-button" type="submit" form="service-form" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Service'}
            </button>
          </>
        }
      >
        <form className="admin-form" id="service-form" onSubmit={handleSubmit}>
          {formError ? (
            <p className="admin-error" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="service-title">Title</label>
              <input id="service-title" name="title" value={formValues.title} onChange={updateField} required />
              {renderFieldError('title')}
            </div>

            <div className="admin-field">
              <label htmlFor="service-slug">Slug</label>
              <input id="service-slug" name="slug" value={formValues.slug} onChange={updateField} required />
              {renderFieldError('slug')}
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="service-icon">Icon Key</label>
              <input id="service-icon" name="iconKey" value={formValues.iconKey} onChange={updateField} required />
              {renderFieldError('iconKey')}
            </div>

            <div className="admin-field">
              <label htmlFor="service-order">Display Order</label>
              <input
                id="service-order"
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
            <label htmlFor="service-description">Description</label>
            <textarea
              id="service-description"
              name="description"
              value={formValues.description}
              onChange={updateField}
              required
            />
            {renderFieldError('description')}
          </div>

          <label className="admin-checkbox admin-toggle-field">
            <input name="active" type="checkbox" checked={formValues.active} onChange={updateField} />
            Active on public website
          </label>
          {renderFieldError('active')}
        </form>
      </AdminModal>

      <ConfirmDialog
        confirmLabel="Delete Service"
        isOpen={Boolean(deleteTarget)}
        isSubmitting={isDeleting}
        message={deleteTarget ? `Delete "${deleteTarget.title}"? This action cannot be undone.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete service"
      />
    </section>
  )
}
