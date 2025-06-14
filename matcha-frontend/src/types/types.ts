// src/types/types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  age: number;
  gender: string;
  sexualPreference: string;
  bio: string;
  location: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  tags: string[];
  fameRating: number;
  isOnline: boolean;
  lastSeen: string;
  emailVerified: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  name: string;
  age: number;
  gender: string;
  bio: string;
  location: string;
  distance: string;
  photos: string[];
  tags: string[];
  fameRating: number;
  isOnline: boolean;
  lastSeen?: string;
  isLiked?: boolean;
  isMatched?: boolean;
}

export interface SearchFilters {
  ageMin: number;
  ageMax: number;
  maxDistance: number;
  minRating: number;
  tags: string[];
  location: string;
  query?: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image';
}

export interface ChatRoom {
  id: number;
  otherUser: {
    id: number;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: string;
  };
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  isMatched: boolean;
  matchedAt: string;
}
