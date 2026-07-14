export default function ConfirmDialog({ message = 'This action is not available yet.', title = 'Confirm Action' }) {
  return (
    <div className="confirm-dialog" role="dialog" aria-label={title}>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}
