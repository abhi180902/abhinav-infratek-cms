import heroImage from '../assets/images/hero.png'

export const clientReviews = [
  {
    id: 'ramesh-patil-luxury-villa',
    clientName: 'Ramesh Patil',
    projectName: 'Luxury Villa',
    location: 'Ranebennur, Karnataka',
    review: 'The team completed our dream home on time. Excellent planning, communication, and quality from concept to handover.',
    rating: 5,
    projectImage: heroImage,
    clientImage: '',
    completedYear: '2025',
    active: true,
    displayOrder: 1,
  },
  {
    id: 'shweta-kulkarni-family-residence',
    clientName: 'Shweta Kulkarni',
    projectName: 'Family Residence',
    location: 'Haveri, Karnataka',
    review: 'Abhinav Infratek made every construction stage clear and manageable. Their site supervision and design guidance gave us complete confidence.',
    rating: 5,
    projectImage: heroImage,
    clientImage: '',
    completedYear: '2024',
    active: true,
    displayOrder: 2,
  },
  {
    id: 'arun-traders-commercial-frontage',
    clientName: 'Arun Traders',
    projectName: 'Commercial Frontage Upgrade',
    location: 'Ranebennur, Karnataka',
    review: 'Our commercial space was delivered with practical planning, reliable estimates, and disciplined execution. The final finish improved our customer experience.',
    rating: 5,
    projectImage: heroImage,
    clientImage: '',
    completedYear: '2024',
    active: true,
    displayOrder: 3,
  },
  {
    id: 'manjunath-industrial-shed',
    clientName: 'Manjunath H.',
    projectName: 'Industrial Shed',
    location: 'Byadagi, Karnataka',
    review: 'Their structural recommendations were clear and practical. The project moved smoothly because the team coordinated drawings, materials, and site execution well.',
    rating: 5,
    projectImage: heroImage,
    clientImage: '',
    completedYear: '2023',
    active: true,
    displayOrder: 4,
  },
  {
    id: 'savitha-interior-execution',
    clientName: 'Savitha N.',
    projectName: 'Interior Design & Execution',
    location: 'Haveri, Karnataka',
    review: 'The interiors were handled with attention to both beauty and daily use. Their suggestions helped us get a premium finish within our planned budget.',
    rating: 5,
    projectImage: heroImage,
    clientImage: '',
    completedYear: '2023',
    active: true,
    displayOrder: 5,
  },
]

export const getVisibleClientReviews = (reviews = clientReviews) =>
  reviews
    .filter((review) => review.active)
    .sort((current, next) => current.displayOrder - next.displayOrder)
