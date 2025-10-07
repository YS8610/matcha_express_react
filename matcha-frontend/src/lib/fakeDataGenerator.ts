const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Alexander', 'Rachel', 'Patrick', 'Catherine', 'Frank', 'Carolyn', 'Jack', 'Janet',
  'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane',
  'Jose', 'Virginia', 'Adam', 'Julie', 'Henry', 'Joyce', 'Nathan', 'Victoria',
  'Douglas', 'Olivia', 'Zachary', 'Kelly', 'Peter', 'Christina', 'Kyle', 'Lauren',
  'Walter', 'Joan', 'Ethan', 'Evelyn', 'Jeremy', 'Judith', 'Harold', 'Megan',
  'Keith', 'Cheryl', 'Christian', 'Andrea', 'Roger', 'Hannah', 'Noah', 'Jacqueline',
  'Gerald', 'Martha', 'Carl', 'Gloria', 'Terry', 'Teresa', 'Sean', 'Ann',
  'Austin', 'Sara', 'Arthur', 'Madison', 'Lawrence', 'Frances', 'Jesse', 'Kathryn',
  'Dylan', 'Janice', 'Bryan', 'Jean', 'Joe', 'Abigail', 'Jordan', 'Alice'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell'
];

const tags = [
  'hiking', 'reading', 'cooking', 'music', 'travel', 'photography', 'fitness', 'yoga',
  'gaming', 'movies', 'art', 'dancing', 'running', 'cycling', 'swimming', 'camping',
  'meditation', 'coffee', 'wine', 'foodie', 'nature', 'beaches', 'mountains', 'sports',
  'basketball', 'football', 'soccer', 'tennis', 'golf', 'skiing', 'surfing', 'climbing',
  'books', 'writing', 'poetry', 'theater', 'concerts', 'festivals', 'tech', 'coding',
  'anime', 'pets', 'dogs', 'cats', 'volunteering', 'environment', 'sustainability', 'vegan',
  'vegetarian', 'fashion', 'makeup', 'skincare', 'entrepreneurship', 'business', 'investing'
];

const biographies = [
  "Living life one adventure at a time. Love exploring new places and meeting interesting people.",
  "Passionate about health, wellness, and making every moment count.",
  "Coffee enthusiast and weekend explorer. Always up for trying new restaurants.",
  "Fitness junkie who loves a good Netflix binge on lazy Sundays.",
  "Creative soul with a passion for art and design. Let's create something beautiful together.",
  "Music lover who believes in the power of a good playlist and great conversations.",
  "Foodie at heart, always on the hunt for the best local spots.",
  "Outdoor enthusiast who finds peace in nature and adventure in the unknown.",
  "Tech geek by day, amateur chef by night. Always learning something new.",
  "Life is too short for boring conversations. Let's talk about anything and everything!",
  "Yoga practitioner seeking balance in all aspects of life.",
  "Avid reader with a love for storytelling in all its forms.",
  "Sports fan who never misses a game. Looking for someone to share the excitement with.",
  "Travel addict with a bucket list that never ends. Where should we go next?",
  "Dog lover and hiking enthusiast. My pup and I are looking for adventure buddies!",
  "Believer in kindness, laughter, and living authentically.",
  "Amateur photographer capturing life's beautiful moments one shot at a time.",
  "Entrepreneur with big dreams and an even bigger heart.",
  "Gaming nerd who also loves the outdoors. Best of both worlds!",
  "Aspiring chef experimenting with flavors from around the world."
];

export interface FakeProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  birthDate: string;
  gender: number;
  sexualPreference: number;
  biography: string;
  tags: string[];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateBirthDate(): string {
  const year = randomInt(1970, 2003);
  const month = randomInt(1, 12).toString().padStart(2, '0');
  const day = randomInt(1, 28).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateFakeProfile(index: number): FakeProfile {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const timestamp = Date.now();
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${timestamp}${index}`;
  const email = `${username}@matchatest.com`;
  const password = 'Test123!@#';

  return {
    username,
    email,
    firstName,
    lastName,
    password,
    birthDate: generateBirthDate(),
    gender: randomInt(0, 2),
    sexualPreference: randomInt(0, 2),
    biography: randomElement(biographies),
    tags: randomElements(tags, randomInt(3, 8))
  };
}

export function generateFakeProfiles(count: number): FakeProfile[] {
  const profiles: FakeProfile[] = [];
  for (let i = 0; i < count; i++) {
    profiles.push(generateFakeProfile(i));
  }
  return profiles;
}
