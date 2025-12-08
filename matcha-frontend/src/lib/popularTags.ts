export const POPULAR_TAGS = [
  'travel',
  'fitness',
  'music',
  'cooking',
  'photography',
  'hiking',
  'yoga',
  'reading',
  'gaming',
  'art',
  'movies',
  'coffee',
  'wine',
  'dancing',
  'sports',
  'fashion',
  'technology',
  'foodie',
  'adventure',
  'beach',
  'mountains',
  'cycling',
  'running',
  'swimming',
  'meditation',
  'vegan',
  'vegetarian',
  'pets',
  'dogs',
  'cats',
  'nature',
  'camping',
  'surfing',
  'skiing',
  'climbing',
  'netflix',
  'anime',
  'books',
  'writing',
  'poetry',
  'guitar',
  'piano',
  'singing',
  'concerts',
  'festivals',
  'theater',
  'comedy',
  'diy',
  'crafts',
  'baking',
  'grilling',
  'gardening',
  'sustainability',
  'volunteering',
  'languages',
  'history',
  'science',
] as const;

export type PopularTag = typeof POPULAR_TAGS[number];

export function getTagSuggestions(input: string, currentTags: string[] = []): string[] {
  const lowerInput = input.toLowerCase().trim();

  if (!lowerInput) return [];

  return POPULAR_TAGS
    .filter(tag =>
      tag.includes(lowerInput) &&
      !currentTags.includes(tag)
    )
    .slice(0, 10);
}

export function getRandomPopularTags(count: number = 15, currentTags: string[] = []): string[] {
  const availableTags = POPULAR_TAGS.filter(tag => !currentTags.includes(tag));
  const shuffled = [...availableTags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const TAG_CATEGORIES = {
  lifestyle: ['vegan', 'vegetarian', 'fitness', 'yoga', 'meditation', 'hiking', 'camping', 'travel', 'adventure'],
  hobbies: ['photography', 'cooking', 'baking', 'reading', 'writing', 'art', 'music', 'dancing', 'singing', 'poetry', 'diy', 'crafts', 'grilling', 'gardening'],
  tech: ['gaming', 'technology', 'anime'],
  sports: ['running', 'cycling', 'swimming', 'sports', 'skiing', 'surfing', 'climbing'],
  style: ['fashion'],
  entertainment: ['movies', 'netflix', 'concerts', 'festivals', 'comedy', 'theater'],
  food: ['foodie', 'coffee', 'wine'],
  pets: ['dogs', 'cats', 'pets', 'nature'],
  social: ['sustainability', 'volunteering'],
  musicInstruments: ['guitar', 'piano', 'singing'],
  outdoor: ['beach', 'mountains', 'nature', 'camping', 'hiking'],
  learning: ['languages', 'history', 'science', 'books'],
} as const;

export type TagCategory = keyof typeof TAG_CATEGORIES;

export function getTagsByCategory(category: TagCategory): string[] {
  return [...TAG_CATEGORIES[category]];
}
