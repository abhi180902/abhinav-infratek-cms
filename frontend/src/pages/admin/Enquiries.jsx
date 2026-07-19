import { Eye, Mail, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import SearchBar from '../../components/admin/SearchBar'
import StatusBadge from '../../components/admin/StatusBadge'
import { deleteEnquiry, getEnquiries, getEnquiry, updateEnquiryStatus } from '../../services/enquiriesService'

const enquiryStatuses = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']

function extractErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback
}

function formatStatus(status) {
  return String(status ?? '').replaceAll('_', ' ')
}

function formatDate(value) {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getStatusTone(status) {
  return status === 'NEW' || status === 'IN_PROGRESS' ? 'warning' : 'success'
}

export default function Enquiries() {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [enquiries, setEnquiries] = useState([])
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const fetchEnquiries = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    setError('')

    try {
      const data = await getEnquiries()
      setEnquiries(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load enquiries.'))
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadEnquiries() {
      try {
        const data = await getEnquiries()

        if (isMounted) {
          setEnquiries(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load enquiries.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadEnquiries()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredEnquiries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    const sortedEnquiries = [...enquiries].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))

    if (!query) {
      return sortedEnquiries
    }

    return sortedEnquiries.filter((enquiry) =>
      [enquiry.name, enquiry.email, enquiry.phone, enquiry.projectType, enquiry.message, enquiry.status].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query),
      ),
    )
  }, [enquiries, searchTerm])

  const handleView = async (enquiry) => {
    setIsViewing(true)
    setError('')

    try {
      setSelectedEnquiry(await getEnquiry(enquiry.id))
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load enquiry details.'))
    } finally {
      setIsViewing(false)
    }
  }

  const handleStatusChange = async (enquiry, status) => {
    if (enquiry.status === status) {
      return
    }

    setIsUpdatingStatus(true)
    setSuccessMessage('')
    setError('')

    try {
      const updatedEnquiry = await updateEnquiryStatus(enquiry.id, status)
      setEnquiries((currentEnquiries) => currentEnquiries.map((item) => (item.id === updatedEnquiry.id ? updatedEnquiry : item)))
      setSelectedEnquiry((currentEnquiry) => (currentEnquiry?.id === updatedEnquiry.id ? updatedEnquiry : currentEnquiry))
      setSuccessMessage('Enquiry status updated successfully.')
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to update enquiry status.'))
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setIsDeleting(true)
    setSuccessMessage('')

    try {
      await deleteEnquiry(deleteTarget.id)
      setSuccessMessage('Enquiry deleted successfully.')
      setDeleteTarget(null)
      setSelectedEnquiry((currentEnquiry) => (currentEnquiry?.id === deleteTarget.id ? null : currentEnquiry))
      await fetchEnquiries()
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to delete enquiry.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section>
      <PageHeader
        breadcrumb="Communication / Enquiries"
        title="Enquiries"
        description="Review customer contact form submissions and consultation requests."
      />

      {successMessage ? (
        <p className="admin-success" role="status">
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <div className="admin-error admin-inline-alert" role="alert">
          <span>{error}</span>
          <button className="admin-secondary-button" type="button" onClick={() => fetchEnquiries({ showLoader: true })}>
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="admin-table-card">
        <div className="table-toolbar">
          <SearchBar
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button className="admin-secondary-button" type="button" onClick={() => fetchEnquiries({ showLoader: true })} disabled={isLoading}>
            <RefreshCw aria-hidden="true" size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="admin-table-loading" role="status">
            Loading enquiries...
          </div>
        ) : filteredEnquiries.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Project Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td>
                      <strong>{enquiry.name}</strong>
                      <span>{enquiry.message}</span>
                    </td>
                    <td>
                      <strong>{enquiry.email}</strong>
                      <span>{enquiry.phone || 'No phone'}</span>
                    </td>
                    <td>{enquiry.projectType || 'Not set'}</td>
                    <td>
                      <div className="admin-status-editor">
                        <StatusBadge tone={getStatusTone(enquiry.status)}>{formatStatus(enquiry.status)}</StatusBadge>
                        <select
                          aria-label={`Update status for ${enquiry.name}`}
                          value={enquiry.status}
                          onChange={(event) => handleStatusChange(enquiry, event.target.value)}
                          disabled={isUpdatingStatus}
                        >
                          {enquiryStatuses.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>{formatDate(enquiry.createdAt)}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="admin-icon-button" onClick={() => handleView(enquiry)} aria-label={`View ${enquiry.name}`}>
                          <Eye aria-hidden="true" size={17} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button admin-icon-button--danger"
                          onClick={() => setDeleteTarget(enquiry)}
                          aria-label={`Delete ${enquiry.name}`}
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
          <EmptyState
            icon={Mail}
            title="No enquiries found"
            description={searchTerm ? 'No enquiries match your search.' : 'Contact form submissions will appear here.'}
          />
        )}
      </div>

      <AdminModal isOpen={Boolean(selectedEnquiry) || isViewing} onClose={() => setSelectedEnquiry(null)} title="Enquiry Details">
        {isViewing ? (
          <div className="admin-table-loading" role="status">
            Loading enquiry details...
          </div>
        ) : selectedEnquiry ? (
          <div className="admin-details-grid">
            <div>
              <span>Name</span>
              <strong>{selectedEnquiry.name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{selectedEnquiry.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{selectedEnquiry.phone || 'Not set'}</strong>
            </div>
            <div>
              <span>Project Type</span>
              <strong>{selectedEnquiry.projectType || 'Not set'}</strong>
            </div>
            <div>
              <span>Status</span>
              <StatusBadge tone={getStatusTone(selectedEnquiry.status)}>{formatStatus(selectedEnquiry.status)}</StatusBadge>
            </div>
            <div>
              <span>Created Date</span>
              <strong>{formatDate(selectedEnquiry.createdAt)}</strong>
            </div>
            <div className="admin-details-full">
              <span>Message</span>
              <p>{selectedEnquiry.message}</p>
            </div>
          </div>
        ) : null}
      </AdminModal>

      <ConfirmDialog
        confirmLabel="Delete Enquiry"
        isOpen={Boolean(deleteTarget)}
        isSubmitting={isDeleting}
        message={deleteTarget ? `Delete the enquiry from "${deleteTarget.name}"? This action cannot be undone.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete enquiry"
      />
    </section>
  )
}
