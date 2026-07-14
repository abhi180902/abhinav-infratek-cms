import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import Topbar from '../components/admin/Topbar'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isSidebarOpen ? <button className="admin-sidebar-overlay" type="button" aria-label="Close sidebar" onClick={() => setIsSidebarOpen(false)} /> : null}
      <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      <section className="admin-main">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="admin-content">
          <Outlet />
        </main>
        <footer className="admin-footer">Abhinav Infratek CMS. Ready for Spring Boot API integration.</footer>
      </section>
    </div>
  )
}
