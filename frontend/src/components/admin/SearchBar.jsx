import { Search } from 'lucide-react'

export default function SearchBar({ placeholder = 'Search content...' }) {
  return (
    <label className="admin-search">
      <span className="sr-only">{placeholder}</span>
      <Search aria-hidden="true" />
      <input type="search" placeholder={placeholder} />
    </label>
  )
}
