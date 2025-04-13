// src/constants/profiles.ts
// To remove this script once backend is ready to test
import { type Profile } from '@/types/profile';

export const FEATURED_PROFILES: Profile[] = [
  {
    id: 1,
    name: 'Alexandra',
    age: 28,
    location: 'Orchard',
    distance: 5,
    bio: 'Coffee enthusiast, book lover, and hiking addict. Looking for someone to share adventures with!',
    tags: ['#travel', '#books', '#coffee', '#hiking', '#photography'],
    imageUrl: '/images/profiles/alexandra.png',
    fameRating: 4.8,
    online: true,
    lastActive: null
  },
  {
    id: 2,
    name: 'Michael',
    age: 32,
    location: 'Marina Bay',
    distance: 8,
    bio: 'Software engineer by day, musician by night. Passionate about tech, music and good food.',
    tags: ['#music', '#tech', '#foodie', '#guitar', '#coding'],
    imageUrl: '/images/profiles/michael.png',
    fameRating: 4.5,
    online: false,
    lastActive: 'Yesterday at 9:30 PM'
  },
  {
    id: 3,
    name: 'Sophia',
    age: 26,
    location: 'Tampines',
    distance: 12,
    bio: 'Art curator with a passion for contemporary paintings. Love exploring galleries and trying new cuisines.',
    tags: ['#art', '#museum', '#painting', '#foodie', '#travel'],
    imageUrl: '/images/profiles/sophia.png',
    fameRating: 4.7,
    online: true,
    lastActive: null
  },
  {
    id: 4,
    name: 'James',
    age: 30,
    location: 'Jurong',
    distance: 4,
    bio: 'Finance professional who loves sports, fitness and weekend getaways. Looking for someone who enjoys an active lifestyle.',
    tags: ['#fitness', '#sports', '#travel', '#cooking', '#running'],
    imageUrl: '/images/profiles/james.png',
    fameRating: 4.2,
    online: false,
    lastActive: 'Today at 10:15 AM'
  }
];
