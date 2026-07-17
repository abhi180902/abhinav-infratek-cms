import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import About from '../components/home/About'
import ClientReviews from '../components/home/ClientReviews'
import Contact from '../components/home/Contact'
import Footer from '../components/layout/Footer'
import Hero from '../components/home/Hero'
import LeadershipTeam from '../components/home/LeadershipTeam'
import Navbar from '../components/layout/Navbar'
import Projects from '../components/home/Projects'
import Services from '../components/home/Services'
import Dashboard from '../pages/admin/Dashboard'
import Enquiries from '../pages/admin/Enquiries'
import Login from '../pages/auth/Login'
import AdminProjects from '../pages/admin/Projects'
import AdminServices from '../pages/admin/Services'
import AdminLeadershipTeam from '../pages/admin/LeadershipTeam'
import Settings from '../pages/admin/Settings'
import AdminClientReviews from '../pages/admin/ClientReviews'

function PublicWebsite() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <LeadershipTeam />
        <ClientReviews />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function RequireAdmin({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('abhinav_admin_auth'))

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="leadership" element={<Navigate to="/admin/leadership-team" replace />} />
        <Route path="leadership-team" element={<AdminLeadershipTeam />} />
        <Route path="client-reviews" element={<AdminClientReviews />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
