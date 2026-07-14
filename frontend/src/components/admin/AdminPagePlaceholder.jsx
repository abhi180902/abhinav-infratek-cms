import { Plus } from 'lucide-react'
import EmptyState from './EmptyState'
import PageHeader from './PageHeader'
import TableToolbar from './TableToolbar'

export default function AdminPagePlaceholder({
  addLabel,
  breadcrumb = 'Content Management',
  description,
  emptyDescription,
  emptyIcon,
  emptyTitle,
  searchPlaceholder,
  title,
}) {
  return (
    <section>
      <PageHeader
        breadcrumb={breadcrumb}
        title={title}
        description={description}
        action={
          <button className="admin-primary-button" type="button">
            <Plus aria-hidden="true" size={18} />
            {addLabel}
          </button>
        }
      />

      <article className="admin-table-card">
        <TableToolbar addLabel={addLabel} searchPlaceholder={searchPlaceholder} />
        <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
      </article>
    </section>
  )
}
