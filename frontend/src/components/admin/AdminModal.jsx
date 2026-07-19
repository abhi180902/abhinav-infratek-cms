import { X } from 'lucide-react'

export default function AdminModal({ children, footer, isOpen, onClose, title }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <header className="admin-modal-header">
          <h2 id="admin-modal-title">{title}</h2>
          {onClose ? (
            <button className="admin-icon-button" type="button" onClick={onClose} aria-label="Close dialog">
              <X aria-hidden="true" />
            </button>
          ) : null}
        </header>
        <div className="admin-modal-body">{children}</div>
        {footer ? <footer className="admin-modal-footer">{footer}</footer> : null}
      </section>
    </div>
  )
}
