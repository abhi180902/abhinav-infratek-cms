import { GalleryHorizontal } from 'lucide-react'
import AdminPagePlaceholder from '../../components/admin/AdminPagePlaceholder'

export default function Gallery() {
  return (
    <AdminPagePlaceholder
      title="Gallery"
      breadcrumb="Manage Content / Gallery"
      description="Manage curated project imagery and display order for the public gallery."
      addLabel="Add Image"
      searchPlaceholder="Search gallery..."
      emptyIcon={GalleryHorizontal}
      emptyTitle="No gallery images yet"
      emptyDescription="Image upload and listing controls will appear here later."
    />
  )
}
