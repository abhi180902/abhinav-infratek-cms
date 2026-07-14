export default function DashboardCard({ count, description, icon: Icon, title }) {
  return (
    <article className="dashboard-card">
      <span className="dashboard-card-icon" aria-hidden="true">
        <Icon />
      </span>
      <div>
        <h2>{title}</h2>
        <strong>{count}</strong>
        <p>{description}</p>
      </div>
    </article>
  )
}
