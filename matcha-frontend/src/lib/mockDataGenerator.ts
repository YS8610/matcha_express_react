const firstNames = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Frank', 'Gregory', 'Raymond', 'Alexander', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Henry', 'Nathan', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Noah', 'Eric', 'Jeremy', 'Walter', 'Ethan', 'Albert', 'Wayne', 'Christian', 'Austin', 'Roger', 'Terry', 'Carl', 'Harold', 'Jordan', 'Jesse', 'Bryan', 'Lawrence', 'Arthur', 'Gabriel', 'Willie', 'Albert', 'Logan', 'Juan', 'Eugene', 'Ralph', 'Randy', 'Vincent', 'Russell', 'Mason', 'Roy', 'Keith', 'Louis', 'Phillip', 'Antonio', 'Johnny', 'Liam', 'Oliver', 'Elijah', 'Lucas', 'Mason', 'Logan', 'Alexander'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Jessica', 'Shirley', 'Cynthia', 'Angela', 'Melissa', 'Brenda', 'Amy', 'Anna', 'Rebecca', 'Virginia', 'Kathleen', 'Pamela', 'Martha', 'Debra', 'Amanda', 'Stephanie', 'Carolyn', 'Christine', 'Marie', 'Janet', 'Catherine', 'Frances', 'Christina', 'Samantha', 'Nicole', 'Julie', 'Alice', 'Margaret', 'Dorothy', 'Lisa', 'Ashley', 'Judith', 'Cheryl', 'Megan', 'Katherine', 'Joan', 'Victoria', 'Kelly', 'Lauren', 'Madison', 'Olivia', 'Emma', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Ella', 'Grace', 'Chloe', 'Camila', 'Luna', 'Penelope', 'Riley', 'Zoe', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoey', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella'],
  nonBinary: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Cameron', 'Drew', 'Blake', 'Hayden', 'Parker', 'Sage', 'Emerson', 'Finley', 'River', 'Rowan', 'Phoenix', 'Sky', 'Charlie', 'Dakota', 'Justice', 'Robin', 'Sam', 'Peyton', 'Sydney', 'Reese', 'Bailey']
};

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];

const biographies = [
  'Adventure seeker and outdoor enthusiast',
  'Coffee addict and bookworm',
  'Fitness junkie and health food lover',
  'Music lover and concert goer',
  'Foodie exploring the city one restaurant at a time',
  'Netflix binger and couch potato proud',
  'Travel enthusiast with wanderlust',
  'Dog lover and proud pet parent',
  'Cat person looking for someone who understands',
  'Yoga practitioner and meditation enthusiast',
  'Craft beer connoisseur',
  'Wine lover and weekend sommelier',
  'Hiking enthusiast and nature photographer',
  'Beach bum and sun worshipper',
  'Gamer looking for player 2',
  'Artist seeking my muse',
  'Musician and part-time DJ',
  'Startup founder and entrepreneur',
  'Tech geek and proud of it',
  'Sports fanatic and weekend warrior',
  'Cooking enthusiast and amateur chef',
  'Dancing queen/king of the dance floor',
  'Film buff and movie critic',
  'Bookish and proud',
  'Photographer capturing life moments',
  'Runner training for marathons',
  'Cyclist exploring the city on two wheels',
  'Rock climber reaching new heights',
  'Surfer chasing the perfect wave',
  'Skier/Snowboarder living for powder days',
  'World traveler with stories to share',
  'Language learner and culture enthusiast',
  'Volunteer making a difference',
  'Environmental activist and eco-warrior',
  'Fashion enthusiast and trendsetter',
  'Vintage collector and thrift shop explorer',
  'Board game strategist',
  'Trivia night champion',
  'Karaoke superstar',
  'Stand-up comedy fan',
  'Podcast addict',
  'True crime documentary obsessed',
  'Plant parent with a growing collection',
  'DIY enthusiast and weekend project warrior',
  'Motorcycle rider and road trip lover',
  'Sailor navigating through life',
  'Pilot with my head in the clouds',
  'Scuba diver exploring the deep',
  'Martial artist and discipline seeker',
  'CrossFit enthusiast pushing limits'
];

const interests = [
  'hiking', 'photography', 'cooking', 'travel', 'music', 'movies', 'reading', 'gaming',
  'fitness', 'yoga', 'meditation', 'dancing', 'art', 'painting', 'drawing', 'writing',
  'poetry', 'blogging', 'vlogging', 'podcasts', 'coffee', 'tea', 'wine', 'craft beer',
  'food', 'restaurants', 'baking', 'gardening', 'plants', 'pets', 'dogs', 'cats',
  'fashion', 'shopping', 'thrifting', 'vintage', 'technology', 'coding', 'startups', 'business',
  'investing', 'crypto', 'stocks', 'real estate', 'cars', 'motorcycles', 'cycling', 'running',
  'swimming', 'surfing', 'skiing', 'snowboarding', 'rock climbing', 'camping', 'fishing', 'hunting',
  'sports', 'football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf', 'volleyball',
  'anime', 'manga', 'comics', 'cosplay', 'board games', 'card games', 'puzzles', 'trivia',
  'karaoke', 'concerts', 'festivals', 'theater', 'museums', 'galleries', 'history', 'science',
  'astronomy', 'philosophy', 'psychology', 'politics', 'environment', 'volunteering', 'charity', 'activism',
  'languages', 'culture', 'spirituality', 'astrology', 'tarot', 'crystals', 'wellness', 'self-care',
  'makeup', 'skincare', 'tattoos', 'piercings', 'alternative', 'punk', 'metal', 'jazz',
  'classical music', 'edm', 'hip hop', 'country', 'indie', 'folk', 'blues', 'reggae'
];

const cities = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863 },
  { name: 'Austin', lat: 30.2672, lng: -97.7431 },
  { name: 'Jacksonville', lat: 30.3322, lng: -81.6557 },
  { name: 'Fort Worth', lat: 32.7555, lng: -97.3308 },
  { name: 'Columbus', lat: 39.9612, lng: -82.9988 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Charlotte', lat: 35.2271, lng: -80.8431 },
  { name: 'Indianapolis', lat: 39.7684, lng: -86.1581 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { name: 'Denver', lat: 39.7392, lng: -104.9903 },
  { name: 'Washington DC', lat: 38.9072, lng: -77.0369 },
  { name: 'Boston', lat: 42.3601, lng: -71.0589 },
  { name: 'Nashville', lat: 36.1627, lng: -86.7816 },
  { name: 'Baltimore', lat: 39.2904, lng: -76.6122 },
  { name: 'Memphis', lat: 35.1495, lng: -90.0490 },
  { name: 'Detroit', lat: 42.3314, lng: -83.0458 },
  { name: 'Portland', lat: 45.5152, lng: -122.6784 },
  { name: 'Las Vegas', lat: 36.1699, lng: -115.1398 },
  { name: 'Louisville', lat: 38.2527, lng: -85.7585 },
  { name: 'Milwaukee', lat: 43.0389, lng: -87.9065 },
  { name: 'Albuquerque', lat: 35.0853, lng: -106.6056 },
  { name: 'Tucson', lat: 32.2226, lng: -110.9747 },
  { name: 'Fresno', lat: 36.7378, lng: -119.7871 },
  { name: 'Sacramento', lat: 38.5816, lng: -121.4944 },
  { name: 'Kansas City', lat: 39.0997, lng: -94.5786 },
  { name: 'Mesa', lat: 33.4152, lng: -111.8315 },
  { name: 'Atlanta', lat: 33.7490, lng: -84.3880 },
  { name: 'Miami', lat: 25.7617, lng: -80.1918 },
  { name: 'Cleveland', lat: 41.4993, lng: -81.6944 },
  { name: 'Tampa', lat: 27.9506, lng: -82.4572 },
  { name: 'Orlando', lat: 28.5383, lng: -81.3792 },
  { name: 'Minneapolis', lat: 44.9778, lng: -93.2650 },
  { name: 'St. Louis', lat: 38.6270, lng: -90.1994 },
  { name: 'Pittsburgh', lat: 40.4406, lng: -79.9959 },
  { name: 'Cincinnati', lat: 39.1031, lng: -84.5120 },
  { name: 'Raleigh', lat: 35.7796, lng: -78.6382 },
  { name: 'Salt Lake City', lat: 40.7608, lng: -111.8910 },
  { name: 'San Bernardino', lat: 34.1083, lng: -117.2898 },
  { name: 'Riverside', lat: 33.9533, lng: -117.3962 },
  { name: 'Buffalo', lat: 42.8864, lng: -78.8784 },
  { name: 'Rochester', lat: 43.1566, lng: -77.6088 }
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateUsername(firstName: string, lastName: string, index: number): string {
  const formats = [
    () => `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    () => `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    () => `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    () => `${firstName[0].toLowerCase()}${lastName.toLowerCase()}`,
    () => `${firstName.toLowerCase()}${index}`,
    () => `${lastName.toLowerCase()}${firstName[0].toLowerCase()}`,
    () => `${firstName.toLowerCase()}_${index}`,
    () => `${lastName.toLowerCase()}_${index}`,
  ];
  
  const format = getRandomElement(formats);
  return format();
}

function generateAge(): number {
  const min = 18;
  const max = 65;
  const skew = 1.5;
  const u = Math.random();
  const v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const age = Math.floor(((num / 10.0) + 0.5) * (max - min) + min);
  return Math.max(min, Math.min(max, age));
}

function generateFameRating(): number {
  const rating = Math.random() * Math.random() * 100;
  return Math.round(rating * 10) / 10;
}

function generateGender(): string {
  const rand = Math.random();
  if (rand < 0.45) return 'male';
  if (rand < 0.90) return 'female';
  return 'non-binary';
}

function generateSexualPreference(gender: string): string {
  const rand = Math.random();
  if (gender === 'non-binary') {
    if (rand < 0.3) return 'male';
    if (rand < 0.6) return 'female';
    if (rand < 0.8) return 'both';
    return 'pansexual';
  }
  
  if (rand < 0.7) return gender === 'male' ? 'female' : 'male';
  if (rand < 0.85) return gender === 'male' ? 'male' : 'female';
  if (rand < 0.95) return 'both';
  return 'pansexual';
}

export function generateMockProfiles(count: number = 1000, startId: number = 4) {
  const profiles = [];
  const usedUsernames = new Set<string>();
  
  for (let i = startId; i < startId + count; i++) {
    const gender = generateGender();
    const genderKey = gender === 'non-binary' ? 'nonBinary' : gender;
    const firstName = getRandomElement(firstNames[genderKey as keyof typeof firstNames]);
    const lastName = getRandomElement(lastNames);
    
    let username = generateUsername(firstName, lastName, i);
    let attempts = 0;
    while (usedUsernames.has(username) && attempts < 10) {
      username = generateUsername(firstName, lastName, i + attempts * 1000);
      attempts++;
    }
    usedUsernames.add(username);
    
    const age = generateAge();
    const city = getRandomElement(cities);
    const userInterests = getRandomElements(interests, Math.floor(Math.random() * 7) + 3);
    const biography = getRandomElement(biographies);
    const sexualPreference = generateSexualPreference(gender);
    const isOnline = Math.random() < 0.2;
    const lastSeenHoursAgo = Math.floor(Math.random() * 72);
    
    const photoCount = Math.random() < 0.3 ? 1 : Math.floor(Math.random() * 4) + 2;
    const photos = [];
    for (let j = 0; j < photoCount; j++) {
      photos.push({
        id: `${i}-${j + 1}`,
        url: `https://picsum.photos/seed/${username}-${j}/400/400`,
        isProfile: j === 0,
        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    const profile = {
      id: String(i),
      username,
      email: `${username}@example.com`,
      firstName,
      lastName,
      age,
      gender,
      sexualPreference,
      biography,
      interests: userInterests,
      photos,
      location: {
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lng: city.lng + (Math.random() - 0.5) * 0.1,
        city: city.name
      },
      fameRating: generateFameRating(),
      isOnline,
      lastSeen: isOnline 
        ? new Date().toISOString() 
        : new Date(Date.now() - lastSeenHoursAgo * 60 * 60 * 1000).toISOString(),
      emailVerified: true,
      profileComplete: true
    };
    
    profiles.push(profile);
  }
  
  return profiles;
}

// Generate profiles starting from ID 4 to avoid conflicts with original profiles (IDs 1-3)
export const generatedMockUsers = generateMockProfiles(1000, 4);

export const originalMockUsers = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    gender: 'male',
    sexualPreference: 'bisexual',
    biography: 'Love hiking and outdoor adventures!',
    interests: ['hiking', 'photography', 'cooking'],
    photos: [{ id: '1', url: 'https://picsum.photos/seed/john/400/400', isProfile: true, uploadedAt: new Date().toISOString() }],
    location: { lat: 40.7128, lng: -74.0060, city: 'New York' },
    fameRating: 45,
    isOnline: true,
    lastSeen: new Date().toISOString(),
    emailVerified: true,
    profileComplete: true
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 26,
    gender: 'female',
    sexualPreference: 'heterosexual',
    biography: 'Coffee enthusiast and bookworm',
    interests: ['reading', 'coffee', 'yoga'],
    photos: [{ id: '2', url: 'https://picsum.photos/seed/jane/400/400', isProfile: true, uploadedAt: new Date().toISOString() }],
    location: { lat: 40.7580, lng: -73.9855, city: 'New York' },
    fameRating: 42,
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    emailVerified: true,
    profileComplete: true
  },
  {
    id: '3',
    username: 'alex_wilson',
    email: 'alex@example.com',
    firstName: 'Alex',
    lastName: 'Wilson',
    age: 30,
    gender: 'non-binary',
    sexualPreference: 'pansexual',
    biography: 'Artist and music lover',
    interests: ['art', 'music', 'travel'],
    photos: [{ id: '3', url: 'https://picsum.photos/seed/alex/400/400', isProfile: true, uploadedAt: new Date().toISOString() }],
    location: { lat: 40.7489, lng: -73.9680, city: 'New York' },
    fameRating: 38,
    isOnline: true,
    lastSeen: new Date().toISOString(),
    emailVerified: true,
    profileComplete: true
  }
];

export const allMockUsers = [...originalMockUsers, ...generatedMockUsers];
