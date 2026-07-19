import { MessageSquareQuote, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import {
  createClientReview,
  deleteClientReview,
  getClientReviews,
  updateClientReview,
} from '../../services/clientReviewsService'

const defaultFormValues = {
  active: true,
  clientName: '',
  companyName: '',
  designation: '',
  displayOrder: 0,
  image: null,
  rating: 5,
  review: '',
}

function normalizeClientReview(review) {
  return {
    active: review.active ?? true,
    clientName: review.clientName ?? '',
    companyName: review.companyName ?? '',
    designation: review.designation ?? '',
    displayOrder: review.displayOrder ?? 0,
    image: null,
    rating: review.rating ?? 5,
    review: review.review ?? '',
  }
}

function createPayload(values) {
  return {
    active: values.active,
    clientName: values.clientName.trim(),
    companyName: values.companyName.trim(),
    designation: values.designation.trim(),
    displayOrder: Number(values.displayOrder),
    image: values.image,
    rating: Number(values.rating),
    review: values.review.trim(),
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

function renderRating(rating) {
  return '★'.repeat(rating ?? 0).padEnd(5, '☆')
}

export default function ClientReviews() {
  const [clientReviews, setClientReviews] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchClientReviews = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    setError('')

    try {
      const data = await getClientReviews()
      setClientReviews(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load client reviews.'))
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadClientReviews() {
      try {
        const data = await getClientReviews()

        if (isMounted) {
          setClientReviews(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load client reviews.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadClientReviews()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedClientReviews = useMemo(
    () =>
      [...clientReviews].sort((first, second) => {
        const orderDifference = (first.displayOrder ?? 0) - (second.displayOrder ?? 0)
        return orderDifference || first.clientName.localeCompare(second.clientName)
      }),
    [clientReviews],
  )

  const filteredClientReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return sortedClientReviews
    }

    return sortedClientReviews.filter((review) =>
      [review.clientName, review.companyName, review.designation, review.review].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query),
      ),
    )
  }, [searchTerm, sortedClientReviews])

  const closeForm = (forceClose = false) => {
    if (isSaving && !forceClose) {
      return
    }

    setEditingReview(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(false)
  }

  const openCreateForm = () => {
    setEditingReview(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(true)
  }

  const openEditForm = (review) => {
    setEditingReview(review)
    setFormError('')
    setFormErrors({})
    setFormValues(normalizeClientReview(review))
    setIsFormOpen(true)
  }

  const updateField = (event) => {
    const { checked, files, name, type, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] ?? null : value,
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

      if (editingReview) {
        await updateClientReview(editingReview.id, payload)
        setSuccessMessage('Client review updated successfully.')
      } else {
        await createClientReview(payload)
        setSuccessMessage('Client review created successfully.')
      }

      closeForm(true)
      await fetchClientReviews()
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setFormError(extractErrorMessage(requestError, 'Unable to save client review.'))
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
      await deleteClientReview(deleteTarget.id)
      setSuccessMessage('Client review deleted successfully.')
      setDeleteTarget(null)
      await fetchClientReviews()
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to delete client review.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="admin-field-error">{formErrors[field]}</small> : null)

  return (
    <section>
      <PageHeader
        breadcrumb="Manage Content / Client Reviews"
        title="Client Reviews"
        description="Review, arrange, and publish client reviews."
        action={
          <button className="admin-primary-button" type="button" onClick={openCreateForm}>
            <Plus aria-hidden="true" size={18} />
            Add Review
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
          <button className="admin-secondary-button" type="button" onClick={() => fetchClientReviews({ showLoader: true })}>
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="admin-table-card">
        <div className="table-toolbar">
          <SearchBar
            placeholder="Search client reviews..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="admin-secondary-button" type="button" onClick={() => fetchClientReviews({ showLoader: true })} disabled={isLoading}>
            <RefreshCw aria-hidden="true" size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="admin-table-loading" role="status">
            Loading client reviews...
          </div>
        ) : filteredClientReviews.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Review</th>
                  <th>Client</th>
                  <th>Rating</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientReviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div className="admin-profile-cell">
                        {review.imageUrl ? <img src={review.imageUrl} alt={`${review.clientName} profile`} /> : null}
                        <span>
                          <strong>{review.review}</strong>
                          <span>{review.designation || review.companyName || 'Client review'}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong>{review.clientName}</strong>
                      <span>{review.companyName || 'Not set'}</span>
                    </td>
                    <td>
                      <span className="admin-rating" aria-label={`${review.rating} out of 5 stars`}>
                        {renderRating(review.rating)}
                      </span>
                    </td>
                    <td>{review.displayOrder}</td>
                    <td>
                      <StatusBadge tone={review.active ? 'success' : 'warning'}>{review.active ? 'Active' : 'Inactive'}</StatusBadge>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-button" onClick={() => openEditForm(review)} aria-label={`Edit ${review.clientName}`}>
                          <Pencil aria-hidden="true" size={17} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button admin-icon-button--danger"
                          onClick={() => setDeleteTarget(review)}
                          aria-label={`Delete ${review.clientName}`}
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
              icon={MessageSquareQuote}
              title="No client reviews found"
              description={searchTerm ? 'No client reviews match your search.' : 'Create the first client review for the public website.'}
            />
            {!searchTerm ? (
              <button className="admin-primary-button" type="button" onClick={openCreateForm}>
                <Plus aria-hidden="true" size={18} />
                Add Review
              </button>
            ) : null}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingReview ? 'Edit Client Review' : 'Add Client Review'}
        footer={
          <>
            <button className="admin-secondary-button" type="button" onClick={closeForm} disabled={isSaving}>
              Cancel
            </button>
            <button className="admin-primary-button" type="submit" form="client-review-form" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Review'}
            </button>
          </>
        }
      >
        <form className="admin-form" id="client-review-form" onSubmit={handleSubmit}>
          {formError ? (
            <p className="admin-error" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="client-review-name">Client Name</label>
              <input id="client-review-name" name="clientName" value={formValues.clientName} onChange={updateField} required />
              {renderFieldError('clientName')}
            </div>

            <div className="admin-field">
              <label htmlFor="client-review-company">Company Name</label>
              <input id="client-review-company" name="companyName" value={formValues.companyName} onChange={updateField} />
              {renderFieldError('companyName')}
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="client-review-designation">Designation</label>
              <input id="client-review-designation" name="designation" value={formValues.designation} onChange={updateField} />
              {renderFieldError('designation')}
            </div>

            <div className="admin-field">
              <label htmlFor="client-review-rating">Rating</label>
              <input
                id="client-review-rating"
                max="5"
                min="1"
                name="rating"
                type="number"
                value={formValues.rating}
                onChange={updateField}
                required
              />
              {renderFieldError('rating')}
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="client-review-order">Display Order</label>
              <input
                id="client-review-order"
                min="0"
                name="displayOrder"
                type="number"
                value={formValues.displayOrder}
                onChange={updateField}
                required
              />
              {renderFieldError('displayOrder')}
            </div>

            <div className="admin-field">
              <label htmlFor="client-review-image">Client Image</label>
              <input id="client-review-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateField} />
              {editingReview?.imageUrl ? <small className="admin-help-text">Leave empty to keep the existing image.</small> : null}
              {renderFieldError('image')}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="client-review-text">Review</label>
            <textarea id="client-review-text" name="review" value={formValues.review} onChange={updateField} required />
            {renderFieldError('review')}
          </div>

          <label className="admin-checkbox admin-toggle-field">
            <input name="active" type="checkbox" checked={formValues.active} onChange={updateField} />
            Active on public website
          </label>
          {renderFieldError('active')}
        </form>
      </AdminModal>

      <ConfirmDialog
        confirmLabel="Delete Review"
        isOpen={Boolean(deleteTarget)}
        isSubmitting={isDeleting}
        message={deleteTarget ? `Delete the review from "${deleteTarget.clientName}"? This action cannot be undone.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete client review"
      />
    </section>
  )
}
