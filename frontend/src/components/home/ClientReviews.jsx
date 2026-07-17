import SectionCarousel from '../common/SectionCarousel'
import { getVisibleClientReviews } from '../../data/clientReviews'

const clientReviewVisibleCounts = { desktop: 3, tablet: 2, mobile: 1 }
const maximumRating = 5

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ClientReviewCard({ review }) {
  const rating = Math.min(Math.max(Number(review.rating) || 0, 0), maximumRating)

  return (
    <article className="client-review-card">
      <div className="client-review-media">
        <img src={review.projectImage} alt={`${review.projectName} project`} />
      </div>

      <div className="client-review-body">
        {review.clientImage ? (
          <img className="client-review-avatar" src={review.clientImage} alt={review.clientName} />
        ) : (
          <span className="client-review-avatar client-review-avatar--placeholder" aria-hidden="true">
            {getInitials(review.clientName)}
          </span>
        )}

        <div className="client-review-client">
          <h3>{review.clientName}</h3>
          <p>
            {review.projectName} <span aria-hidden="true">•</span> {review.location}
          </p>
        </div>

        <div className="client-review-rating" aria-label={`${rating} out of ${maximumRating} stars`}>
          {Array.from({ length: maximumRating }, (_, index) => (
            <span key={index} aria-hidden="true">
              {index < rating ? '★' : '☆'}
            </span>
          ))}
        </div>

        <p className="client-review-text">&ldquo;{review.review}&rdquo;</p>

        {review.completedYear ? <p className="client-review-year">Completed: {review.completedYear}</p> : null}
      </div>
    </article>
  )
}

export default function ClientReviews() {
  const visibleReviews = getVisibleClientReviews()

  if (!visibleReviews.length) {
    return null
  }

  return (
    <section className="client-reviews-section section-block" id="client-reviews">
      <div className="container carousel-container">
        <div className="section-heading section-heading--center client-reviews-heading">
          <h2>
            Client <span>Reviews</span>
          </h2>
          <p>
            Hear directly from our clients about their experience working with Abhinav Infratek and the successful completion of their
            construction projects.
          </p>
        </div>

        <SectionCarousel
          className="client-reviews-carousel"
          controlsClassName="client-review-carousel-controls"
          controlsLabel="Client reviews carousel controls"
          visibleCounts={clientReviewVisibleCounts}
          items={visibleReviews}
          getItemKey={(review) => review.id}
          renderItem={(review) => <ClientReviewCard review={review} />}
        />
      </div>
    </section>
  )
}
