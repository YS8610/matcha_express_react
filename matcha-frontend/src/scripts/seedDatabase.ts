// scripts/seedDatabase.ts
import { createHash } from 'crypto';

interface SeedUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  sexualPreference: 'men' | 'women' | 'both';
  age: number;
  bio: string;
  tags: string[];
  photos: string[];
  latitude: number;
  longitude: number;
  location: string;
  fameRating: number;
  isOnline: boolean;
  lastSeen: string;
  emailVerified: boolean;
  createdAt: string;
}

class DatabaseSeeder {
  private readonly TOTAL_PROFILES = 600; 
  private readonly SINGAPORE_BOUNDS = {
    north: 1.4784,
    south: 1.1496,
    east: 104.0944,
    west: 103.5974
  };

  private readonly FIRST_NAMES = {
    male: [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
      'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark',
      'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
      'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob',
      'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott',
      'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank',
      'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Henry',
      'Adam', 'Douglas', 'Nathan', 'Peter', 'Zachary', 'Kyle', 'Noah', 'Alan',
      'Ethan', 'Jeremy', 'Lionel', 'Mason', 'Logan', 'Oliver', 'Lucas', 'Jacob'
    ],
    female: [
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
      'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra',
      'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly',
      'Deborah', 'Dorothy', 'Amy', 'Angela', 'Ashley', 'Brenda', 'Emma', 'Olivia',
      'Cynthia', 'Marie', 'Janet', 'Catherine', 'Frances', 'Christine', 'Samantha',
      'Debra', 'Rachel', 'Carolyn', 'Janet', 'Virginia', 'Maria', 'Heather',
      'Diane', 'Julie', 'Joyce', 'Victoria', 'Kelly', 'Christina', 'Joan', 'Evelyn',
      'Lauren', 'Judith', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Jacqueline',
      'Martha', 'Gloria', 'Teresa', 'Sara', 'Janice', 'Marie', 'Julia', 'Kathryn'
    ],
    nonbinary: [
      'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
      'Sage', 'River', 'Phoenix', 'Rowan', 'Blake', 'Cameron', 'Drew', 'Finley',
      'Hayden', 'Kai', 'Lane', 'Nico', 'Parker', 'Reese', 'Skylar', 'Sydney'
    ]
  };

  private readonly LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
    'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
    'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner',
    'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
    'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan',
    'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim',
    'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James',
    'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo'
  ];

  private readonly INTERESTS = [
    '#travel', '#photography', '#music', '#fitness', '#cooking', '#reading',
    '#hiking', '#yoga', '#gaming', '#art', '#movies', '#dancing', '#wine',
    '#coffee', '#foodie', '#adventure', '#books', '#nature', '#beach', '#gym',
    '#running', '#cycling', '#swimming', '#tennis', '#golf', '#skiing', '#surfing',
    '#climbing', '#camping', '#backpacking', '#meditation', '#mindfulness',
    '#writing', '#blogging', '#fashion', '#design', '#technology', '#coding',
    '#startup', '#entrepreneur', '#business', '#finance', '#investing',
    '#politics', '#history', '#science', '#psychology', '#philosophy',
    '#spirituality', '#volunteering', '#charity', '#environment', '#sustainability',
    '#vegan', '#vegetarian', '#organic', '#healthy', '#wellness', '#spa',
    '#massage', '#aromatherapy', '#astrology', '#tarot', '#crystals',
    '#concerts', '#festivals', '#theater', '#opera', '#ballet', '#museums',
    '#galleries', '#exhibitions', '#crafts', '#diy', '#gardening', '#pets',
    '#dogs', '#cats', '#animals', '#wildlife', '#birdwatching', '#fishing',
    '#hunting', '#sports', '#football', '#basketball', '#baseball', '#soccer',
    '#hockey', '#volleyball', '#softball', '#karate', '#boxing', '#mma',
    '#sailing', '#boating', '#kayaking', '#paddleboarding', '#scuba', '#snorkeling'
  ];

  private readonly SINGAPORE_NEIGHBORHOODS = [
    'Orchard', 'Marina Bay', 'Chinatown', 'Little India', 'Kampong Glam',
    'Clarke Quay', 'Boat Quay', 'Raffles Place', 'Bugis', 'Somerset',
    'Dhoby Ghaut', 'City Hall', 'Tanjong Pagar', 'Outram Park', 'Tiong Bahru',
    'Novena', 'Newton', 'Bishan', 'Ang Mo Kio', 'Yishun', 'Woodlands',
    'Sembawang', 'Admiralty', 'Kranji', 'Marsiling', 'Choa Chu Kang',
    'Bukit Batok', 'Bukit Gombak', 'Hillview', 'Beauty World', 'King Albert Park',
    'Sixth Avenue', 'Tan Kah Kee', 'Botanic Gardens', 'Farrer Road', 'Holland Village',
    'Buona Vista', 'Dover', 'Clementi', 'Jurong East', 'Chinese Garden',
    'Lakeside', 'Boon Lay', 'Pioneer', 'Joo Koon', 'Gul Circle', 'Tuas Crescent',
    'Tuas West Road', 'Tuas Link', 'Expo', 'Changi Airport', 'Tampines',
    'Simei', 'Tanah Merah', 'Bedok', 'Kembangan', 'Eunos', 'Paya Lebar',
    'Aljunied', 'Kallang', 'Lavender', 'Boon Keng', 'Potong Pasir', 'Woodleigh',
    'Serangoon', 'Kovan', 'Hougang', 'Buangkok', 'Sengkang', 'Punggol'
  ];

  private readonly BIO_TEMPLATES = [
    "Love exploring new places and trying different cuisines. Looking for someone to share adventures with!",
    "Fitness enthusiast who enjoys both gym workouts and outdoor activities. Let's stay active together!",
    "Creative soul passionate about art and music. Seeking someone who appreciates the finer things in life.",
    "Tech professional by day, foodie by night. Always up for discovering new restaurants and experiences.",
    "Yoga instructor and mindfulness advocate. Looking for someone who values wellness and personal growth.",
    "Travel blogger who's been to 30+ countries. Ready to explore the world with the right person.",
    "Weekend hiker and nature lover. Hoping to find someone who enjoys the great outdoors as much as I do.",
    "Coffee connoisseur and bookworm. Perfect date would be browsing bookstores followed by a great café.",
    "Dancing is my passion - from salsa to swing. Would love to find a partner who's ready to dance through life!",
    "Photography enthusiast always chasing the perfect shot. Let's capture beautiful memories together.",
    "Startup founder with big dreams and an even bigger heart. Looking for someone to build something amazing with.",
    "Marine biologist fascinated by ocean life. Seeking someone who shares my love for marine conservation.",
    "Chef who loves experimenting with fusion cuisine. Let me cook for you - it might just win your heart!",
    "Marathon runner training for my 10th race. Need someone who can keep up with my active lifestyle.",
    "Wine enthusiast and amateur sommelier. Let's explore vineyards and discover new favorites together.",
    "Rock climbing instructor who lives for the next challenge. Looking for an adventure buddy and life partner.",
    "Classical musician playing violin since age 5. Music is my language - let's create a beautiful symphony together.",
    "Environmental lawyer fighting for a sustainable future. Seeking someone who cares about making a difference.",
    "Meditation teacher finding peace in chaos. Ready to share mindful moments with someone special.",
    "Stand-up comedian who believes laughter is the best medicine. Let me make you smile every day!"
  ];

  private hashPassword(password: string): string {
    return createHash('sha256').update(password + 'salt').digest('hex');
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private generateRandomCoordinates(): { latitude: number; longitude: number } {
    const lat = this.SINGAPORE_BOUNDS.south + 
      Math.random() * (this.SINGAPORE_BOUNDS.north - this.SINGAPORE_BOUNDS.south);
    const lng = this.SINGAPORE_BOUNDS.west + 
      Math.random() * (this.SINGAPORE_BOUNDS.east - this.SINGAPORE_BOUNDS.west);
    
    return {
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    };
  }

  private generateFameRating(): number {
    const rand = Math.random();
    if (rand < 0.05) return parseFloat((4.5 + Math.random() * 0.5).toFixed(1)); 
    if (rand < 0.20) return parseFloat((3.5 + Math.random() * 1.0).toFixed(1)); 
    if (rand < 0.60) return parseFloat((2.5 + Math.random() * 1.0).toFixed(1)); 
    if (rand < 0.90) return parseFloat((1.5 + Math.random() * 1.0).toFixed(1)); 
    return parseFloat((0.5 + Math.random() * 1.0).toFixed(1)); 
  }

  private generatePhotos(gender: string): string[] {
    const photoCount = Math.floor(Math.random() * 4) + 2; 
    const photos: string[] = [];
    
    for (let i = 0; i < photoCount; i++) {
      const seed = Math.random().toString(36).substring(2, 15);
      photos.push(`https://picsum.photos/seed/${seed}/400/600`);
    }
    
    return photos;
  }

  private generateUser(index: number): SeedUser {
    const genders = ['male', 'female', 'non-binary', 'other'] as const;
    const genderWeights = [0.45, 0.45, 0.08, 0.02]; 
    
    let gender: typeof genders[number];
    const genderRand = Math.random();
    if (genderRand < genderWeights[0]) gender = 'male';
    else if (genderRand < genderWeights[0] + genderWeights[1]) gender = 'female';
    else if (genderRand < genderWeights[0] + genderWeights[1] + genderWeights[2]) gender = 'non-binary';
    else gender = 'other';

    const firstName = gender === 'non-binary' || gender === 'other' 
      ? this.getRandomElement(this.FIRST_NAMES.nonbinary)
      : this.getRandomElement(this.FIRST_NAMES[gender as 'male' | 'female']);
    
    const lastName = this.getRandomElement(this.LAST_NAMES);
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 999) + 1}`;
    const email = `${username}@example.com`;

    const preferences = ['men', 'women', 'both'] as const;
    const prefWeights = [0.40, 0.40, 0.20]; 
    let sexualPreference: typeof preferences[number];
    const prefRand = Math.random();
    if (prefRand < prefWeights[0]) sexualPreference = 'men';
    else if (prefRand < prefWeights[0] + prefWeights[1]) sexualPreference = 'women';
    else sexualPreference = 'both';

    const age = Math.floor(Math.random() * 47) + 18; 
    const coordinates = this.generateRandomCoordinates();
    const neighborhood = this.getRandomElement(this.SINGAPORE_NEIGHBORHOODS);
    
    const tagCount = Math.floor(Math.random() * 8) + 3; 
    const tags = this.getRandomElements(this.INTERESTS, tagCount);
    
    const bio = this.getRandomElement(this.BIO_TEMPLATES);
    const photos = this.generatePhotos(gender);
    
    const isOnline = Math.random() < 0.15; 
    const lastSeen = isOnline ? new Date().toISOString() : 
      new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(); 
    
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(); 

    return {
      username,
      email,
      firstName,
      lastName,
      password: this.hashPassword('defaultPassword123!'), 
      gender,
      sexualPreference,
      age,
      bio,
      tags,
      photos,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      location: `${neighborhood}, Singapore`,
      fameRating: this.generateFameRating(),
      isOnline,
      lastSeen,
      emailVerified: Math.random() < 0.85, 
      createdAt
    };
  }

  public generateSeedData(): SeedUser[] {
    console.log(`Generating ${this.TOTAL_PROFILES} diverse user profiles...`);
    
    const users: SeedUser[] = [];
    
    for (let i = 0; i < this.TOTAL_PROFILES; i++) {
      users.push(this.generateUser(i));
      
      if ((i + 1) % 100 === 0) {
        console.log(`Generated ${i + 1}/${this.TOTAL_PROFILES} profiles...`);
      }
    }
    
    console.log(`✅ Successfully generated ${users.length} profiles`);
    console.log(`Gender distribution: 
      Male: ${users.filter(u => u.gender === 'male').length}
      Female: ${users.filter(u => u.gender === 'female').length}
      Non-binary: ${users.filter(u => u.gender === 'non-binary').length}
      Other: ${users.filter(u => u.gender === 'other').length}`);
    
    console.log(`Sexual preference distribution:
      Men: ${users.filter(u => u.sexualPreference === 'men').length}
      Women: ${users.filter(u => u.sexualPreference === 'women').length}
      Both: ${users.filter(u => u.sexualPreference === 'both').length}`);
    
    return users;
  }

  public generateSQLInserts(users: SeedUser[]): string {
    const values = users.map(user => {
      const tagsJson = JSON.stringify(user.tags);
      const photosJson = JSON.stringify(user.photos);
      
      return `(
        '${user.username}',
        '${user.email}',
        '${user.firstName}',
        '${user.lastName}',
        '${user.password}',
        '${user.gender}',
        '${user.sexualPreference}',
        ${user.age},
        '${user.bio.replace(/'/g, "''")}',
        '${tagsJson.replace(/'/g, "''")}',
        '${photosJson.replace(/'/g, "''")}',
        ${user.latitude},
        ${user.longitude},
        '${user.location}',
        ${user.fameRating},
        ${user.isOnline},
        '${user.lastSeen}',
        ${user.emailVerified},
        '${user.createdAt}',
        '${user.createdAt}'
      )`;
    }).join(',\n');

    return `
INSERT INTO users (
  username, email, first_name, last_name, password_hash,
  gender, sexual_preference, age, bio, tags, photos,
  latitude, longitude, location, fame_rating,
  is_online, last_seen, email_verified, created_at, updated_at
) VALUES ${values};`;
  }

  public async seedToDatabase(databaseUrl: string): Promise<void> {
    console.log('Seeding database...');
    
    const users = this.generateSeedData();
    const sqlScript = this.generateSQLInserts(users);
    
    const fs = await import('fs');
    fs.writeFileSync('./seed_data.sql', sqlScript);
    
    console.log('✅ Seed data saved to seed_data.sql');
    console.log('Run this SQL script on your database to insert the profiles.');
  }
}

if (require.main === module) {
  const seeder = new DatabaseSeeder();
  const users = seeder.generateSeedData();
  
  console.log('\nSample users:');
  users.slice(0, 3).forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Gender: ${user.gender}, Preference: ${user.sexualPreference}, Age: ${user.age}`);
    console.log(`   Location: ${user.location}`);
    console.log(`   Fame Rating: ${user.fameRating}`);
    console.log(`   Tags: ${user.tags.slice(0, 5).join(', ')}...`);
    console.log(`   Photos: ${user.photos.length} photos`);
  });
  
  const sqlScript = seeder.generateSQLInserts(users);
  require('fs').writeFileSync('./seed_data.sql', sqlScript);
  console.log('\n✅ SQL script saved to seed_data.sql');
}

export default DatabaseSeeder;
