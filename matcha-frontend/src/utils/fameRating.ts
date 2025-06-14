// src/utils/fameRating.ts
export const calculateFameRating = (factors: {
  profileCompleteness: number;
  photosCount: number;
  likesReceived: number;
  profileViews: number;
  matchesCount: number;
  responseRate: number;
  lastActivityDays: number;
}): number => {
  let score = 0;
  score += factors.profileCompleteness * 1.0;
  score += Math.min(factors.photosCount / 5, 1) * 0.75;
  score += Math.min(factors.likesReceived / 100, 1) * 0.8;
  score += Math.min(factors.profileViews / 500, 1) * 0.3;
  score += Math.min(factors.matchesCount / 50, 1) * 0.5;
  score += factors.responseRate * 0.4;
  score += factors.lastActivityDays <= 1 ? 0.2 : factors.lastActivityDays <= 7 ? 0.1 : 0.05;
  
  return Math.max(0, Math.min(score, 5));
};

export const getFameRatingTier = (rating: number): string => {
  if (rating >= 4.5) return 'Celebrity';
  if (rating >= 4.0) return 'Superstar';
  if (rating >= 3.5) return 'Popular';
  if (rating >= 3.0) return 'Rising Star';
  if (rating >= 2.5) return 'Active';
  return 'Newcomer';
};

export const getFameRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-purple-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-green-600';
  if (rating >= 3.0) return 'text-yellow-600';
  return 'text-orange-600';
};
