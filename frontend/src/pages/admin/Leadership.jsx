import { UsersRound } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Leadership() {
  return (
    <AdminPagePlaceholder
      title="Leadership"
      breadcrumb="Manage Content / Leadership"
      description="Maintain founder, partner, and leadership profile details for the public website."
      addLabel="Add Profile"
      searchPlaceholder="Search leadership..."
      emptyIcon={UsersRound}
      emptyTitle="No leadership records yet"
      emptyDescription="Leadership profile management will be wired to the API in a later phase."
    />
  )
}
