import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const sectionRoutes = new Set(['/about', '/services', '/projects', '/leadership', '/contact'])

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (sectionRoutes.has(pathname)) {
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
