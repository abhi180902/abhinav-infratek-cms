export default function PageHeader({ action, breadcrumb = 'Admin CMS', description, title }) {
  return (
    <div className="admin-page-header">
      <div>
        <p className="admin-breadcrumb">{breadcrumb}</p>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
