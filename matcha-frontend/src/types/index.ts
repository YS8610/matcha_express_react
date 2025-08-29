export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  profileComplete: boolean;
  lastSeen: Date;
  isOnline: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  gender: 'male' | 'female' | 'other';
  sexualPreference: 'male' | 'female' | 'both';
  biography: string;
  interests: string[];
  photos: Photo[];
  profilePhoto?: string;
  age: number;
  location: Location;
  fameRating: number;
  isLiked?: boolean;
  hasLikedMe?: boolean;
  isConnected?: boolean;
  isBlocked?: boolean;
}

export interface Photo {
  id: string;
  url: string;
  isProfile: boolean;
  uploadedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  distance?: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'view' | 'message' | 'match' | 'unlike';
  fromUserId: string;
  fromUsername: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface Conversation {
  userId: string;
  username: string;
  profilePhoto?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
}

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  distanceMax?: number;
  fameMin?: number;
  fameMax?: number;
  interests?: string[];
  sortBy?: 'age' | 'distance' | 'fame' | 'commonTags';
  order?: 'asc' | 'desc';
}