import { Inbox } from 'lucide-react'

export default function EmptyState({ description = 'This area is ready for future API-powered data.', icon: Icon = Inbox, title = 'No records yet' }) {
  return (
    <div className="empty-state">
      <div>
        <span className="empty-state-icon" aria-hidden="true">
          <Icon />
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}
