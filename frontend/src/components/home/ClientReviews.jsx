import SectionCarousel from '../common/SectionCarousel'

const clientReviewVisibleCounts = { desktop: 3, tablet: 2, mobile: 1 }
const maximumRating = 5

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ClientReviewCard({ review }) {
  const rating = Math.min(Math.max(Number(review.rating) || 0, 0), maximumRating)
  const reviewLabel = review.companyName || review.designation || 'Client Review'

  return (
    <article className="client-review-card">
      <div className="client-review-media">
        {review.imageUrl ? (
          <img src={review.imageUrl} alt={`${review.clientName} review`} />
        ) : (
          <span className="client-review-media-placeholder" aria-hidden="true">
            {getInitials(review.clientName)}
          </span>
        )}
      </div>

      <div className="client-review-body">
        {review.imageUrl ? (
          <img className="client-review-avatar" src={review.imageUrl} alt={review.clientName} />
        ) : (
          <span className="client-review-avatar client-review-avatar--placeholder" aria-hidden="true">
            {getInitials(review.clientName)}
          </span>
        )}

        <div className="client-review-client">
          <h3>{review.clientName}</h3>
          <p>{reviewLabel}</p>
        </div>

        <div className="client-review-rating" aria-label={`${rating} out of ${maximumRating} stars`}>
          {Array.from({ length: maximumRating }, (_, index) => (
            <span key={index} aria-hidden="true">
              {index < rating ? '*' : '☆'}
            </span>
          ))}
        </div>

        <p className="client-review-text">&ldquo;{review.review}&rdquo;</p>
      </div>
    </article>
  )
}

export default function ClientReviews({ isLoading, reviews = [] }) {
  const visibleReviews = reviews
    .filter((review) => review.active !== false)
    .sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0))

  if (!isLoading && !visibleReviews.length) {
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

        {isLoading ? (
          <div className="public-section-state" role="status">
            Loading client reviews...
          </div>
        ) : (
          <SectionCarousel
            className="client-reviews-carousel"
            controlsClassName="client-review-carousel-controls"
            controlsLabel="Client reviews carousel controls"
            visibleCounts={clientReviewVisibleCounts}
            items={visibleReviews}
            getItemKey={(review) => review.id}
            renderItem={(review) => <ClientReviewCard review={review} />}
          />
        )}
      </div>
    </section>
  )
}
