import hammadImage from '../assets/images/hammad-maroof-imdadi.jpeg'
import pavanrajImage from '../assets/images/pavanraj-patil.png'
import prasadImage from '../assets/images/prasad-sangamad.png'

export const leadershipMembers = [
  {
    id: 'prasad-sangamad',
    fullName: 'Er. Prasad S. Sangamad',
    designation: 'Founder & Civil Engineer',
    bio: 'Leads project planning, client coordination, and civil execution with a focus on quality, trust, and practical engineering.',
    photo: prasadImage,
    phone: '+91 72593 4720',
    email: 'prasadsangamad162@gmail.com',
    linkedin: '',
    displayOrder: 1,
    active: true,
  },
  {
    id: 'pavanraj-patil',
    fullName: 'Er. Pavanraj R. Patil',
    designation: 'Co-Founder & Structural Engineer',
    bio: 'Guides structural consultancy and engineering decisions for safe, efficient, and dependable construction outcomes.',
    photo: pavanrajImage,
    phone: '+91 91102 71018',
    email: 'prasadsangamad162@gmail.com',
    linkedin: '',
    displayOrder: 2,
    active: true,
  },
  {
    id: 'hammad-maroof-imdadi',
    fullName: 'HAMMAD MAROOF IMDADI',
    designation: 'Structural Engineer',
    bio: 'M.Tech in Structural Engineering from Siddaganga Institute of Technology, Tumkur with CGPA 8.89/10, and B.E. in Civil Engineering from Sapthagiri College of Engineering, Bangalore with CGPA 7.86/10.',
    photo: hammadImage,
    phone: '+91-6363878390',
    email: '',
    linkedin: '',
    displayOrder: 3,
    active: true,
  },
]

export const getVisibleLeadershipMembers = (members = leadershipMembers) =>
  members
    .filter((member) => member.active)
    .sort((current, next) => current.displayOrder - next.displayOrder)
