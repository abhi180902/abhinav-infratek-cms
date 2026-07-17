import { FolderKanban, Mail, MessageSquareQuote, Plus, UsersRound, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardCard from '../../components/admin/DashboardCard'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import { getVisibleClientReviews } from '../../data/clientReviews'
import { getVisibleLeadershipMembers } from '../../data/leadership'

const activeClientReviewCount = getVisibleClientReviews().length.toString().padStart(2, '0')
const activeLeadershipCount = getVisibleLeadershipMembers().length.toString().padStart(2, '0')

const stats = [
  { title: 'Projects', count: '08', description: 'Portfolio items prepared for CMS management.', icon: FolderKanban },
  { title: 'Services', count: '10', description: 'Service cards ready for future API editing.', icon: Wrench },
  { title: 'Leadership Team', count: activeLeadershipCount, description: 'Active leadership team profiles configured.', icon: UsersRound },
  { title: 'Client Reviews', count: activeClientReviewCount, description: 'Client review entries for homepage display.', icon: MessageSquareQuote },
  { title: 'Enquiries', count: '03', description: 'Recent customer enquiries awaiting follow-up.', icon: Mail },
]

const activities = [
  { title: 'Homepage carousel polished', time: 'Today', tone: 'success' },
  { title: 'Admin dashboard foundation created', time: 'Today', tone: 'success' },
  { title: 'Spring Boot API integration pending', time: 'Next phase', tone: 'warning' },
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
  return (
    <section>
      <PageHeader breadcrumb="Overview" title="Dashboard" description="Monitor public website content, enquiries, and upcoming CMS integration points." />

      <div className="dashboard-grid">
        {stats.map((item) => (
          <DashboardCard key={item.title} {...item} />
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
