import AdminModal from './AdminModal'

export default function ConfirmDialog({
  confirmLabel = 'Confirm',
  isOpen,
  isSubmitting = false,
  message,
  onCancel,
  onConfirm,
  title = 'Confirm action',
}) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={isSubmitting ? undefined : onCancel}
      title={title}
      footer={
        <>
          <button className="admin-secondary-button" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="admin-danger-button" type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="admin-dialog-message">{message}</p>
    </AdminModal>
  )
}
