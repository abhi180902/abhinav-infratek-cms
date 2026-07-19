import { Search } from 'lucide-react'

export default function SearchBar({ onChange, placeholder = 'Search content...', value }) {
  return (
    <label className="admin-search">
      <span className="sr-only">{placeholder}</span>
      <Search aria-hidden="true" />
      <input type="search" placeholder={placeholder} value={value} onChange={onChange} />
    </label>
  )
}
