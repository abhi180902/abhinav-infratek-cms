import { MessageSquareQuote } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function ClientReviews() {
  return (
    <AdminPagePlaceholder
      title="Client Reviews"
      breadcrumb="Manage Content / Client Reviews"
      description="Review, arrange, and publish client reviews when content APIs are available."
      addLabel="Add Review"
      searchPlaceholder="Search client reviews..."
      emptyIcon={MessageSquareQuote}
      emptyTitle="No client reviews yet"
      emptyDescription="Published client reviews will be managed from this table."
    />
  )
}
