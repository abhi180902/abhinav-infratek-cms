import { UsersRound } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function LeadershipTeam() {
  return (
    <AdminPagePlaceholder
      title="Leadership Team"
      breadcrumb="Manage Content / Leadership Team"
      description="Maintain leadership team profile details for the public website."
      addLabel="Add Profile"
      searchPlaceholder="Search leadership team..."
      emptyIcon={UsersRound}
      emptyTitle="No leadership team records yet"
      emptyDescription="Leadership team profile management will be wired to the API in a later phase."
    />
  )
}
