import { MessageSquareQuote } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Testimonials() {
  return (
    <AdminPagePlaceholder
      title="Testimonials"
      breadcrumb="Manage Content / Testimonials"
      description="Review, arrange, and publish customer testimonials when content APIs are available."
      addLabel="Add Testimonial"
      searchPlaceholder="Search testimonials..."
      emptyIcon={MessageSquareQuote}
      emptyTitle="No testimonials yet"
      emptyDescription="Published testimonials will be managed from this table."
    />
  )
}
