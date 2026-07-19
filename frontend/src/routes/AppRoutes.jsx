import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ProtectedRoute from '../components/auth/ProtectedRoute'
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
import Account from '../pages/admin/Account'
import Login from '../pages/auth/Login'
import AdminProjects from '../pages/admin/Projects'
import AdminServices from '../pages/admin/Services'
import AdminLeadershipTeam from '../pages/admin/LeadershipTeam'
import Settings from '../pages/admin/Settings'
import AdminClientReviews from '../pages/admin/ClientReviews'
import { getPublicWebsiteData } from '../services/publicWebsiteService'
import { useAuth } from '../hooks/useAuth'

const emptyPublicData = {
  clientReviews: [],
  leadershipMembers: [],
  projects: [],
  services: [],
  settings: null,
}

function extractErrorMessage(error) {
  return error?.response?.data?.message || 'Some website content could not be loaded.'
}

function PublicWebsite() {
  const location = useLocation()
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [publicData, setPublicData] = useState(emptyPublicData)

  const loadPublicWebsite = useCallback(async () => {
    setIsLoading(true)
    setErrors({})

    try {
      const result = await getPublicWebsiteData()
      setPublicData({ ...emptyPublicData, ...result.data })
      setErrors(result.errors)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadInitialPublicWebsite() {
      try {
        const result = await getPublicWebsiteData()

        if (isMounted) {
          setPublicData({ ...emptyPublicData, ...result.data })
          setErrors(result.errors)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialPublicWebsite()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const sectionId = location.pathname.slice(1)

    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [location.pathname])

  const errorMessage = useMemo(() => {
    const firstError = Object.values(errors)[0]
    return firstError ? extractErrorMessage(firstError) : ''
  }, [errors])

  return (
    <div className="site-shell">
      <Navbar settings={publicData.settings} />
      <main>
        {errorMessage ? (
          <div className="public-alert container" role="alert">
            <span>{errorMessage}</span>
            <button className="site-button site-button--primary" type="button" onClick={loadPublicWebsite}>
              Retry
            </button>
          </div>
        ) : null}
        <Hero isLoading={isLoading} settings={publicData.settings} />
        <About isLoading={isLoading} settings={publicData.settings} />
        <Services isLoading={isLoading} services={publicData.services} />
        <Projects isLoading={isLoading} projects={publicData.projects} />
        <LeadershipTeam isLoading={isLoading} members={publicData.leadershipMembers} />
        <ClientReviews isLoading={isLoading} reviews={publicData.clientReviews} />
        <Contact isLoading={isLoading} settings={publicData.settings} />
      </main>
      <Footer services={publicData.services} settings={publicData.settings} />
    </div>
  )
}

function AdminLoginRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Login />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/about" element={<PublicWebsite />} />
      <Route path="/services" element={<PublicWebsite />} />
      <Route path="/projects" element={<PublicWebsite />} />
      <Route path="/contact" element={<PublicWebsite />} />
      <Route path="/admin/login" element={<AdminLoginRoute />} />
      <Route path="/admin/forgot-password" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/reset-password" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/login" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="account" element={<Account />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="leadership" element={<Navigate to="/admin/leadership-team" replace />} />
        <Route path="leadership-team" element={<AdminLeadershipTeam />} />
        <Route path="reviews" element={<Navigate to="/admin/client-reviews" replace />} />
        <Route path="client-reviews" element={<AdminClientReviews />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
