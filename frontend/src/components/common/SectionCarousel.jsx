import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

function getVisibleCount(counts) {
  if (typeof window === 'undefined') {
    return counts.desktop
  }

  if (window.matchMedia('(max-width: 640px)').matches) {
    return counts.mobile
  }

  if (window.matchMedia('(max-width: 980px)').matches) {
    return counts.tablet
  }

  return counts.desktop
}

export default function SectionCarousel({
  className = '',
  controlsClassName = '',
  controlsLabel,
  getItemKey,
  items,
  renderItem,
  resetKey,
  visibleCounts,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(() => getVisibleCount(visibleCounts))
  const trackRef = useRef(null)

  const maxIndex = useMemo(() => Math.max(items.length - visibleCards, 0), [items.length, visibleCards])
  const currentIndex = Math.min(activeIndex, maxIndex)

  useEffect(() => {
    const updateVisibleCards = () => {
      const nextVisibleCards = getVisibleCount(visibleCounts)

      setVisibleCards(nextVisibleCards)
      setActiveIndex((index) => Math.min(index, Math.max(items.length - nextVisibleCards, 0)))
    }

    window.addEventListener('resize', updateVisibleCards)

    return () => window.removeEventListener('resize', updateVisibleCards)
  }, [items.length, visibleCounts])

  useEffect(() => {
    const track = trackRef.current
    const target = track?.children[currentIndex]

    if (target) {
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
    }
  }, [currentIndex, items.length, resetKey])

  const scrollTo = (direction) => {
    let index = currentIndex + direction * visibleCards

    if (index > maxIndex) {
      index = 0
    }

    if (index < 0) {
      index = maxIndex
    }

    const track = trackRef.current
    const target = track?.children[index]

    setActiveIndex(index)

    if (target) {
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
    }
  }

  return (
    <div className={`carousel-shell ${className}`} style={{ '--cards-visible': visibleCards }}>
      <div className={`carousel-controls ${controlsClassName}`} aria-label={controlsLabel}>
        <button className="carousel-arrow" type="button" onClick={() => scrollTo(-1)} aria-label="Previous">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button className="carousel-arrow" type="button" onClick={() => scrollTo(1)} aria-label="Next">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="carousel-track" ref={trackRef}>
        {items.map((item) => (
          <div className="carousel-card" key={getItemKey(item)}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}
