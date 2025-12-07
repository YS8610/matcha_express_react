export const POPULAR_TAGS = [
  'vegan',
  'vegetarian',
  'fitness',
  'yoga',
  'meditation',
  'outdoors',
  'hiking',
  'camping',
  'travel',
  'adventure',

  'photography',
  'cooking',
  'baking',
  'reading',
  'writing',
  'art',
  'painting',
  'music',
  'dancing',
  'singing',

  'geek',
  'gamer',
  'coding',
  'tech',
  'anime',
  'cosplay',
  'sci-fi',
  'fantasy',

  'running',
  'cycling',
  'swimming',
  'gym',
  'sports',
  'soccer',
  'basketball',
  'tennis',
  'skiing',
  'surfing',

  'tattoos',
  'piercing',
  'fashion',
  'streetwear',
  'vintage',
  'minimalist',

  'movies',
  'netflix',
  'concerts',
  'festivals',
  'comedy',
  'theater',
  'karaoke',

  'foodie',
  'coffee',
  'wine',
  'beer',
  'cocktails',
  'tea',

  'dogs',
  'cats',
  'pets',
  'animals',
  'nature',

  'activist',
  'volunteer',
  'sustainability',
  'eco-friendly',
  'political',

  'creative',
  'spontaneous',
  'chill',
  'party',
  'homebody',
  'romantic',
  'sarcastic',
  'ambitious',
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
  lifestyle: ['vegan', 'vegetarian', 'fitness', 'yoga', 'meditation', 'outdoors', 'hiking', 'camping', 'travel', 'adventure'],
  hobbies: ['photography', 'cooking', 'baking', 'reading', 'writing', 'art', 'painting', 'music', 'dancing', 'singing'],
  tech: ['geek', 'gamer', 'coding', 'tech', 'anime', 'cosplay', 'sci-fi', 'fantasy'],
  sports: ['running', 'cycling', 'swimming', 'gym', 'sports', 'soccer', 'basketball', 'tennis', 'skiing', 'surfing'],
  style: ['tattoos', 'piercing', 'fashion', 'streetwear', 'vintage', 'minimalist'],
  entertainment: ['movies', 'netflix', 'concerts', 'festivals', 'comedy', 'theater', 'karaoke'],
  food: ['foodie', 'coffee', 'wine', 'beer', 'cocktails', 'tea'],
  pets: ['dogs', 'cats', 'pets', 'animals', 'nature'],
  social: ['activist', 'volunteer', 'sustainability', 'eco-friendly', 'political'],
  personality: ['creative', 'spontaneous', 'chill', 'party', 'homebody', 'romantic', 'sarcastic', 'ambitious'],
} as const;

export type TagCategory = keyof typeof TAG_CATEGORIES;

export function getTagsByCategory(category: TagCategory): string[] {
  return [...TAG_CATEGORIES[category]];
}
