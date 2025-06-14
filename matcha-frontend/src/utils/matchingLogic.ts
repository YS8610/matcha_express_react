// src/utils/matchingLogic.ts
import { Profile, User } from '../types/types';

export interface MatchingCriteria {
  proximity: number;
  sharedTags: number;
  fameRating: number;
  overallScore: number;
}

export interface MatchingFilters {
  ageMin: number;
  ageMax: number;
  maxDistance: number;
  minFameRating: number;
  tags: string[];
  location?: string;
}

const getNormalizedSexualPreference = (preference?: string): string => {
  if (!preference || preference.trim() === '') {
    return 'both'; 
  }
  return preference.toLowerCase();
};

const getNormalizedGender = (gender?: string): string => {
  if (!gender) return 'unknown';
  return gender.toLowerCase();
};

export const areUsersCompatible = (user1: User, user2: User): boolean => {
  const user1Preference = getNormalizedSexualPreference(user1.sexualPreference);
  const user2Preference = getNormalizedSexualPreference(user2.sexualPreference);
  
  const user1Gender = getNormalizedGender(user1.gender);
  const user2Gender = getNormalizedGender(user2.gender);

  const user1InterestedInUser2 = checkGenderCompatibility(user1Preference, user2Gender);
  const user2InterestedInUser1 = checkGenderCompatibility(user2Preference, user1Gender);
  
  return user1InterestedInUser2 && user2InterestedInUser1;
};

const checkGenderCompatibility = (preference: string, targetGender: string): boolean => {
  switch (preference) {
    case 'men':
    case 'male':
      return targetGender === 'male';
    case 'women':
    case 'female':
      return targetGender === 'female';
    case 'both':
    case 'bisexual':
    case 'bi':
    default: 
      return ['male', 'female', 'non-binary', 'other'].includes(targetGender);
  }
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const calculateSharedTags = (userTags: string[], profileTags: string[]): number => {
  if (!userTags || !profileTags) return 0;
  
  const userTagsLower = userTags.map(tag => tag.toLowerCase().trim());
  const profileTagsLower = profileTags.map(tag => tag.toLowerCase().trim());
  
  return userTagsLower.filter(tag => profileTagsLower.includes(tag)).length;
};

export const calculateMatchingScore = (
  currentUser: User,
  profile: Profile
): MatchingCriteria => {
  const distance = profile.latitude && profile.longitude && currentUser.latitude && currentUser.longitude
    ? calculateDistance(currentUser.latitude, currentUser.longitude, profile.latitude, profile.longitude)
    : 50; 
  
  const proximityScore = Math.max(0, (50 - Math.min(distance, 50)) / 50) * 100;

  const sharedTagsCount = calculateSharedTags(currentUser.tags || [], profile.tags || []);
  const maxPossibleSharedTags = Math.min(
    (currentUser.tags || []).length, 
    (profile.tags || []).length
  );
  const sharedTagsScore = maxPossibleSharedTags > 0 
    ? (sharedTagsCount / maxPossibleSharedTags) * 100 
    : 0;

  const fameRatingScore = (profile.fameRating / 5) * 100;

  const overallScore = (
    proximityScore * 0.40 +      
    sharedTagsScore * 0.35 +     
    fameRatingScore * 0.25       
  );

  return {
    proximity: proximityScore,
    sharedTags: sharedTagsScore,
    fameRating: fameRatingScore,
    overallScore
  };
};

export const filterCompatibleProfiles = (
  currentUser: User,
  profiles: Profile[],
  filters: MatchingFilters
): Profile[] => {
  return profiles.filter(profile => {
    if (profile.id === currentUser.id) return false;

    if (!areUsersCompatible(currentUser, profile as any)) return false;

    if (profile.age < filters.ageMin || profile.age > filters.ageMax) return false;

    if (profile.fameRating < filters.minFameRating) return false;

    if (profile.latitude && profile.longitude && currentUser.latitude && currentUser.longitude) {
      const distance = calculateDistance(
        currentUser.latitude, 
        currentUser.longitude, 
        profile.latitude, 
        profile.longitude
      );
      if (distance > filters.maxDistance) return false;
    }

    if (filters.tags.length > 0) {
      const hasRequiredTags = filters.tags.some(tag => 
        (profile.tags || []).some(profileTag => 
          profileTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasRequiredTags) return false;
    }

    if (filters.location) {
      if (!profile.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
};

export const sortProfiles = (
  currentUser: User,
  profiles: Profile[],
  sortBy: 'distance' | 'age' | 'fameRating' | 'matchScore' | 'commonTags' = 'matchScore'
): Profile[] => {
  return [...profiles].sort((a, b) => {
    switch (sortBy) {
      case 'age':
        return a.age - b.age;
      
      case 'distance':
        const distanceA = a.latitude && a.longitude && currentUser.latitude && currentUser.longitude
          ? calculateDistance(currentUser.latitude, currentUser.longitude, a.latitude, a.longitude)
          : Infinity;
        const distanceB = b.latitude && b.longitude && currentUser.latitude && currentUser.longitude
          ? calculateDistance(currentUser.latitude, currentUser.longitude, b.latitude, b.longitude)
          : Infinity;
        return distanceA - distanceB;
      
      case 'fameRating':
        return b.fameRating - a.fameRating;
      
      case 'commonTags':
        const sharedTagsA = calculateSharedTags(currentUser.tags || [], a.tags || []);
        const sharedTagsB = calculateSharedTags(currentUser.tags || [], b.tags || []);
        return sharedTagsB - sharedTagsA;
      
      case 'matchScore':
      default:
        const scoreA = calculateMatchingScore(currentUser, a).overallScore;
        const scoreB = calculateMatchingScore(currentUser, b).overallScore;
        return scoreB - scoreA;
    }
  });
};

export const getIntelligentMatches = (
  currentUser: User,
  allProfiles: Profile[],
  filters: MatchingFilters,
  limit: number = 20
): Profile[] => {
  const compatibleProfiles = filterCompatibleProfiles(currentUser, allProfiles, filters);
  
  const sortedProfiles = sortProfiles(currentUser, compatibleProfiles, 'matchScore');
  
  const sameAreaProfiles = sortedProfiles.filter(profile => {
    if (!profile.latitude || !profile.longitude || !currentUser.latitude || !currentUser.longitude) {
      return false;
    }
    
    const distance = calculateDistance(
      currentUser.latitude, 
      currentUser.longitude, 
      profile.latitude, 
      profile.longitude
    );
    
    return distance <= 25; 
  });
  
  const otherProfiles = sortedProfiles.filter(profile => {
    if (!profile.latitude || !profile.longitude || !currentUser.latitude || !currentUser.longitude) {
      return true; 
    }
    
    const distance = calculateDistance(
      currentUser.latitude, 
      currentUser.longitude, 
      profile.latitude, 
      profile.longitude
    );
    
    return distance > 25;
  });
  
  const finalProfiles = [...sameAreaProfiles, ...otherProfiles];
  
  return finalProfiles.slice(0, limit);
};
