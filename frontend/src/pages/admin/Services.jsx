import { Wrench } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Services() {
  return (
    <AdminPagePlaceholder
      title="Services"
      breadcrumb="Manage Content / Services"
      description="Manage service cards, icons, order, and public descriptions in a future CMS workflow."
      addLabel="Add Service"
      searchPlaceholder="Search services..."
      emptyIcon={Wrench}
      emptyTitle="No service records yet"
      emptyDescription="Service CRUD will be connected here when the backend API is ready."
    />
  )
}
