// src/types/types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; 
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  sexualPreference: 'men' | 'women' | 'both';
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
  commonTags?: string[];
  isLiked?: boolean;
  isMatched?: boolean;
  viewedAt?: string;
}

export interface SearchFilters {
  ageMin: number;
  ageMax: number;
  maxDistance: number;
  minRating: number;
  tags: string[];
  location: string;
  gender?: string;
  query?: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'emoji';
}

export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  isTyping?: boolean;
}

export interface ChatRoom {
  id: number;
  otherUser: ChatUser;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  isMatched: boolean;
  matchedAt: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: 'like' | 'match' | 'message' | 'profile_view' | 'unlike';
  fromUserId: number;
  fromUser: {
    id: number;
    name: string;
    avatar: string;
  };
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any; 
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  address?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    perPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileSetupForm {
  gender: string;
  sexualPreference: string;
  age: number;
  bio: string;
  tags: string[];
  location: string;
  photos: File[];
}

export interface ProfileStats {
  totalMatches: number;
  profileViews: number;
  likesReceived: number;
  likesGiven: number;
  messagesCount: number;
  profileCompletionPercentage: number;
  lastActive: string;
}

export interface ActivityLog {
  id: number;
  type: 'login' | 'profile_update' | 'like' | 'message' | 'match';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    likes: boolean;
    messages: boolean;
    matches: boolean;
    profileViews: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showDistance: boolean;
    allowMessagesFromMatches: boolean;
    showAge: boolean;
  };
  discovery: {
    maxDistance: number;
    ageRange: {
      min: number;
      max: number;
    };
    showMeToUsers: boolean;
  };
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type AppPage = 'browse' | 'search' | 'chat' | 'profile' | 'settings';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface FileUpload {
  file: File;
  preview: string;
  uploaded: boolean;
  url?: string;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
