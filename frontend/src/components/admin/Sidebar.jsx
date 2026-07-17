import {
  Bell,
  FolderKanban,
  Grid2X2,
  Home,
  LogOut,
  Mail,
  MessageSquareQuote,
  Settings,
  SlidersHorizontal,
  UsersRound,
  Wrench,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/company-logo.png'

const menuSections = [
  {
    title: 'Dashboard',
    items: [{ label: 'Dashboard', to: '/admin/dashboard', icon: Grid2X2 }],
  },
  {
    title: 'Manage Content',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
      { label: 'Services', to: '/admin/services', icon: Wrench },
      { label: 'Leadership Team', to: '/admin/leadership-team', icon: UsersRound },
      { label: 'Client Reviews', to: '/admin/client-reviews', icon: MessageSquareQuote },
    ],
  },
  {
    title: 'Communication',
    items: [{ label: 'Enquiries', helper: 'Contact form submissions', to: '/admin/enquiries', icon: Mail }],
  },
  {
    title: 'Site Settings',
    items: [
      { label: 'Homepage Sections', helper: 'Manage visible sections', to: '/admin/settings', icon: Home },
      { label: 'General Settings', helper: 'Contact and company info', to: '/admin/settings', icon: Settings },
      { label: 'Announcements', helper: 'Future notices', to: '/admin/settings', icon: Bell },
      { label: 'Display Controls', helper: 'Future visibility options', to: '/admin/settings', icon: SlidersHorizontal },
    ],
  },
]

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('abhinav_admin_auth')
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="admin-sidebar" aria-label="Admin sidebar">
      <div className="admin-sidebar-brand">
        <img src={logo} alt="Abhinav Infratek logo" />
        <span>
          <strong>Abhinav Infratek</strong>
          <span>Admin CMS</span>
        </span>
      </div>

      <nav className="admin-menu">
        {menuSections.map((section) => (
          <div className="admin-menu-section" key={section.title}>
            <p className="admin-menu-title">{section.title}</p>
            {section.items.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
                  key={`${item.label}-${item.to}`}
                  to={item.to}
                  onClick={onNavigate}
                >
                  <Icon aria-hidden="true" />
                  <span>
                    {item.label}
                    {item.helper ? <small>{item.helper}</small> : null}
                  </span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout" type="button" onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  )
}
