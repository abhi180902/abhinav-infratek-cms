import { Settings as SettingsIcon } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Settings() {
  return (
    <AdminPagePlaceholder
      title="Settings"
      breadcrumb="Site Settings / General"
      description="Manage homepage sections, contact details, SEO metadata, and public visibility options."
      addLabel="Add Setting"
      searchPlaceholder="Search settings..."
      emptyIcon={SettingsIcon}
      emptyTitle="No settings records yet"
      emptyDescription="General settings and homepage section controls will be connected here later."
    />
  )
}
