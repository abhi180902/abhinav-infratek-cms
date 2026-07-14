import { Mail } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Enquiries() {
  return (
    <AdminPagePlaceholder
      title="Enquiries"
      breadcrumb="Communication / Enquiries"
      description="Review customer contact form submissions and future consultation requests."
      addLabel="Add Enquiry"
      searchPlaceholder="Search enquiries..."
      emptyIcon={Mail}
      emptyTitle="No enquiries yet"
      emptyDescription="Contact form submissions will appear here after backend integration."
    />
  )
}
