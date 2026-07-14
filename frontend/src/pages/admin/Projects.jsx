import { FolderKanban } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Projects() {
  return (
    <AdminPagePlaceholder
      title="Projects"
      breadcrumb="Manage Content / Projects"
      description="Create, edit, archive, and search public portfolio projects once the API is connected."
      addLabel="Add Project"
      searchPlaceholder="Search projects..."
      emptyIcon={FolderKanban}
      emptyTitle="No project records yet"
      emptyDescription="Project management tables will appear here after Spring Boot API integration."
    />
  )
}
