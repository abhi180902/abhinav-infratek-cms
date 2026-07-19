import { Pencil, Plus, RefreshCw, Trash2, UsersRound } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import {
  createLeadershipMember,
  deleteLeadershipMember,
  getLeadershipMembers,
  updateLeadershipMember,
} from '../../services/leadershipService'

const defaultFormValues = {
  active: true,
  bio: '',
  designation: '',
  displayOrder: 0,
  image: null,
  name: '',
}

function normalizeLeadershipMember(member) {
  return {
    active: member.active ?? true,
    bio: member.bio ?? '',
    designation: member.designation ?? '',
    displayOrder: member.displayOrder ?? 0,
    image: null,
    name: member.name ?? '',
  }
}

function createPayload(values) {
  return {
    active: values.active,
    bio: values.bio.trim(),
    designation: values.designation.trim(),
    displayOrder: Number(values.displayOrder),
    image: values.image,
    name: values.name.trim(),
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

export default function LeadershipTeam() {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingMember, setEditingMember] = useState(null)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [leadershipMembers, setLeadershipMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchLeadershipMembers = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    setError('')

    try {
      const data = await getLeadershipMembers()
      setLeadershipMembers(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load leadership members.'))
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadLeadershipMembers() {
      try {
        const data = await getLeadershipMembers()

        if (isMounted) {
          setLeadershipMembers(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load leadership members.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadLeadershipMembers()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedLeadershipMembers = useMemo(
    () =>
      [...leadershipMembers].sort((first, second) => {
        const orderDifference = (first.displayOrder ?? 0) - (second.displayOrder ?? 0)
        return orderDifference || first.name.localeCompare(second.name)
      }),
    [leadershipMembers],
  )

  const filteredLeadershipMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return sortedLeadershipMembers
    }

    return sortedLeadershipMembers.filter((member) =>
      [member.name, member.designation, member.bio].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query),
      ),
    )
  }, [searchTerm, sortedLeadershipMembers])

  const closeForm = (forceClose = false) => {
    if (isSaving && !forceClose) {
      return
    }

    setEditingMember(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(false)
  }

  const openCreateForm = () => {
    setEditingMember(null)
    setFormError('')
    setFormErrors({})
    setFormValues(defaultFormValues)
    setIsFormOpen(true)
  }

  const openEditForm = (member) => {
    setEditingMember(member)
    setFormError('')
    setFormErrors({})
    setFormValues(normalizeLeadershipMember(member))
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

      if (editingMember) {
        await updateLeadershipMember(editingMember.id, payload)
        setSuccessMessage('Leadership member updated successfully.')
      } else {
        await createLeadershipMember(payload)
        setSuccessMessage('Leadership member created successfully.')
      }

      closeForm(true)
      await fetchLeadershipMembers()
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setFormError(extractErrorMessage(requestError, 'Unable to save leadership member.'))
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
      await deleteLeadershipMember(deleteTarget.id)
      setSuccessMessage('Leadership member deleted successfully.')
      setDeleteTarget(null)
      await fetchLeadershipMembers()
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to delete leadership member.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="admin-field-error">{formErrors[field]}</small> : null)

  return (
    <section>
      <PageHeader
        breadcrumb="Manage Content / Leadership Team"
        title="Leadership Team"
        description="Maintain leadership team profile details for the public website."
        action={
          <button className="admin-primary-button" type="button" onClick={openCreateForm}>
            <Plus aria-hidden="true" size={18} />
            Add Profile
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
          <button className="admin-secondary-button" type="button" onClick={() => fetchLeadershipMembers({ showLoader: true })}>
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="admin-table-card">
        <div className="table-toolbar">
          <SearchBar
            placeholder="Search leadership team..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="admin-secondary-button" type="button" onClick={() => fetchLeadershipMembers({ showLoader: true })} disabled={isLoading}>
            <RefreshCw aria-hidden="true" size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="admin-table-loading" role="status">
            Loading leadership members...
          </div>
        ) : filteredLeadershipMembers.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Designation</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeadershipMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="admin-profile-cell">
                        {member.imageUrl ? <img src={member.imageUrl} alt={`${member.name} profile`} /> : null}
                        <span>
                          <strong>{member.name}</strong>
                          <span>{member.bio || 'No bio added yet.'}</span>
                        </span>
                      </div>
                    </td>
                    <td>{member.designation}</td>
                    <td>{member.displayOrder}</td>
                    <td>
                      <StatusBadge tone={member.active ? 'success' : 'warning'}>{member.active ? 'Active' : 'Inactive'}</StatusBadge>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-button" onClick={() => openEditForm(member)} aria-label={`Edit ${member.name}`}>
                          <Pencil aria-hidden="true" size={17} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button admin-icon-button--danger"
                          onClick={() => setDeleteTarget(member)}
                          aria-label={`Delete ${member.name}`}
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
              icon={UsersRound}
              title="No leadership members found"
              description={searchTerm ? 'No leadership members match your search.' : 'Create the first leadership profile for the public website.'}
            />
            {!searchTerm ? (
              <button className="admin-primary-button" type="button" onClick={openCreateForm}>
                <Plus aria-hidden="true" size={18} />
                Add Profile
              </button>
            ) : null}
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingMember ? 'Edit Leadership Member' : 'Add Leadership Member'}
        footer={
          <>
            <button className="admin-secondary-button" type="button" onClick={closeForm} disabled={isSaving}>
              Cancel
            </button>
            <button className="admin-primary-button" type="submit" form="leadership-form" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </>
        }
      >
        <form className="admin-form" id="leadership-form" onSubmit={handleSubmit}>
          {formError ? (
            <p className="admin-error" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="leadership-name">Name</label>
              <input id="leadership-name" name="name" value={formValues.name} onChange={updateField} required />
              {renderFieldError('name')}
            </div>

            <div className="admin-field">
              <label htmlFor="leadership-designation">Designation</label>
              <input
                id="leadership-designation"
                name="designation"
                value={formValues.designation}
                onChange={updateField}
                required
              />
              {renderFieldError('designation')}
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="leadership-order">Display Order</label>
              <input
                id="leadership-order"
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
              <label htmlFor="leadership-image">Profile Image</label>
              <input
                id="leadership-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={updateField}
                required={!editingMember}
              />
              {editingMember?.imageUrl ? <small className="admin-help-text">Leave empty to keep the existing image.</small> : null}
              {renderFieldError('image')}
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="leadership-bio">Bio</label>
            <textarea id="leadership-bio" name="bio" value={formValues.bio} onChange={updateField} />
            {renderFieldError('bio')}
          </div>

          <label className="admin-checkbox admin-toggle-field">
            <input name="active" type="checkbox" checked={formValues.active} onChange={updateField} />
            Active on public website
          </label>
          {renderFieldError('active')}
        </form>
      </AdminModal>

      <ConfirmDialog
        confirmLabel="Delete Profile"
        isOpen={Boolean(deleteTarget)}
        isSubmitting={isDeleting}
        message={deleteTarget ? `Delete "${deleteTarget.name}"? This action cannot be undone.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete leadership member"
      />
    </section>
  )
}
