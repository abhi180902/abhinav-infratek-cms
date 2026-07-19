import { Bell, ChevronDown, LogOut, Menu, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import SearchBar from './SearchBar'

export default function Topbar({ onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <header className="admin-topbar">
      <button className="admin-mobile-toggle" type="button" onClick={onMenuClick} aria-label="Open sidebar">
        <Menu aria-hidden="true" />
      </button>

      <SearchBar placeholder="Search dashboard..." />

      <div className="admin-topbar-actions">
        <button className="admin-icon-button" type="button" aria-label="Notifications">
          <Bell aria-hidden="true" />
        </button>

        <div className="admin-profile">
          <button className="admin-profile-button" type="button" onClick={() => setIsProfileOpen((value) => !value)}>
            <span className="admin-avatar">AI</span>
            <span className="admin-profile-name">Admin</span>
            <ChevronDown aria-hidden="true" size={16} />
          </button>

          {isProfileOpen ? (
            <div className="admin-profile-menu">
              <button type="button" onClick={() => navigate('/admin/account')}>
                <UserRound aria-hidden="true" size={18} />
                Admin Profile
              </button>
              <button type="button" onClick={handleLogout}>
                <LogOut aria-hidden="true" size={18} />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
