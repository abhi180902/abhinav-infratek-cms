import { Plus } from 'lucide-react'
import SearchBar from './SearchBar'

export default function TableToolbar({ addLabel = 'Add New', searchPlaceholder = 'Search records...' }) {
  return (
    <div className="table-toolbar">
      <SearchBar placeholder={searchPlaceholder} />
      <button className="admin-primary-button" type="button">
        <Plus aria-hidden="true" size={18} />
        {addLabel}
      </button>
    </div>
  )
}
