import { FolderKanban, Mail, MessageSquareQuote, Plus, UsersRound, Wrench } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardCard from '../../components/admin/DashboardCard'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import { getDashboardSummary } from '../../services/dashboardService'

const emptyDashboard = {
  services: 0,
  projects: 0,
  leadershipMembers: 0,
  clientReviews: 0,
  totalEnquiries: 0,
  newEnquiries: 0,
  contactedEnquiries: 0,
  closedEnquiries: 0,
}

const activities = [
  { title: 'Homepage carousel polished', time: 'Today', tone: 'success' },
  { title: 'Admin dashboard connected to backend', time: 'Today', tone: 'success' },
  { title: 'Content CRUD integration pending', time: 'Next phase', tone: 'warning' },
]

const enquiries = [
  { name: 'Residential planning request', source: 'Contact Form' },
  { name: 'Road construction consultation', source: 'Phone enquiry' },
  { name: 'Interior design discussion', source: 'Email' },
]

const latestProjects = ['Urban Residence', 'Business Center Fitout', 'Civic Roadworks']

const quickActions = [
  { label: 'Add Project', to: '/admin/projects' },
  { label: 'Add Service', to: '/admin/services' },
  { label: 'View Enquiries', to: '/admin/enquiries' },
]

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(emptyDashboard)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const applyDashboardFetch = useCallback(async () => {
    const data = await getDashboardSummary()
    setDashboard({ ...emptyDashboard, ...data })
  }, [])

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      await applyDashboardFetch()
    } catch {
      setError('Unable to load dashboard summary. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [applyDashboardFetch])

  useEffect(() => {
    let isMounted = true

    async function fetchDashboard() {
      try {
        const data = await getDashboardSummary()

        if (isMounted) {
          setDashboard({ ...emptyDashboard, ...data })
        }
      } catch {
        if (isMounted) {
          setError('Unable to load dashboard summary. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(
    () => [
      { title: 'Projects', count: dashboard.projects, description: 'Portfolio items managed in the CMS.', icon: FolderKanban },
      { title: 'Services', count: dashboard.services, description: 'Service cards available for public display.', icon: Wrench },
      { title: 'Leadership Members', count: dashboard.leadershipMembers, description: 'Leadership team profiles configured.', icon: UsersRound },
      { title: 'Client Reviews', count: dashboard.clientReviews, description: 'Client review entries for homepage display.', icon: MessageSquareQuote },
      { title: 'Total Enquiries', count: dashboard.totalEnquiries, description: 'Customer enquiries received through the website.', icon: Mail },
      { title: 'New Enquiries', count: dashboard.newEnquiries, description: 'New enquiries awaiting first response.', icon: Mail },
      { title: 'Contacted Enquiries', count: dashboard.contactedEnquiries, description: 'Enquiries already contacted by the team.', icon: Mail },
      { title: 'Closed Enquiries', count: dashboard.closedEnquiries, description: 'Completed or closed enquiry records.', icon: Mail },
    ],
    [dashboard],
  )

  return (
    <section>
      <PageHeader
        breadcrumb="Overview"
        title="Dashboard"
        description="Monitor public website content, enquiries, and upcoming CMS integration points."
        action={
          <button className="admin-primary-button" type="button" onClick={loadDashboard} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      />

      {error ? (
        <div className="admin-error" role="alert">
          {error}
          <button className="admin-primary-button" type="button" onClick={loadDashboard}>
            Retry
          </button>
        </div>
      ) : null}

      <div className="dashboard-grid">
        {stats.map((item) => (
          <DashboardCard key={item.title} {...item} count={isLoading ? '--' : item.count} />
        ))}
      </div>

      <div className="admin-dashboard-layout">
        <article className="admin-panel">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {activities.map((item) => (
              <li className="activity-item" key={item.title}>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.time}</small>
                </span>
                <StatusBadge tone={item.tone}>{item.tone === 'success' ? 'Done' : 'Pending'}</StatusBadge>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-panel">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            {quickActions.map((action) => (
              <Link className="quick-action" to={action.to} key={action.label}>
                {action.label}
                <Plus aria-hidden="true" size={18} />
              </Link>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <h2>Latest Enquiries</h2>
          <ul className="activity-list">
            {enquiries.map((item) => (
              <li className="activity-item" key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.source}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-panel">
          <h2>Latest Projects</h2>
          <ul className="activity-list">
            {latestProjects.map((project) => (
              <li className="activity-item" key={project}>
                <strong>{project}</strong>
                <StatusBadge>Visible</StatusBadge>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
