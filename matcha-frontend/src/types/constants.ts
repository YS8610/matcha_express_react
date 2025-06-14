// src/types/constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
export const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export const APP_NAME = 'Web Matcha';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Find your perfect match';

export const TOKEN_KEY = 'authToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; 

export const MIN_AGE = 18;
export const MAX_AGE = 100;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_BIO_LENGTH = 500;
export const MAX_PHOTOS = 5;
export const MAX_TAGS = 10;

export const DEFAULT_SEARCH_RADIUS = 25; 
export const MAX_SEARCH_RADIUS = 100;
export const MIN_SEARCH_RADIUS = 1;
export const DEFAULT_AGE_RANGE = { min: 18, max: 35 };
export const MIN_FAME_RATING = 0;
export const MAX_FAME_RATING = 5;

export const MAX_MESSAGE_LENGTH = 500;
export const TYPING_TIMEOUT = 3000; 
export const MESSAGE_FETCH_LIMIT = 50;
export const REAL_TIME_DELAY_MAX = 10000; 

export const DEFAULT_LOCATION = {
  latitude: 1.3521, 
  longitude: 103.8198,
  city: 'Singapore',
  country: 'Singapore'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; 
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const DESKTOP_BREAKPOINT = 1280;

export const COLORS = {
  primary: 'pink-500',
  primaryHover: 'pink-600',
  secondary: 'gray-500',
  success: 'green-500',
  warning: 'yellow-500',
  error: 'red-500',
  info: 'blue-500'
};

export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  MATCH: 'match',
  MESSAGE: 'message',
  PROFILE_VIEW: 'profile_view',
  UNLIKE: 'unlike'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  SEARCH_HISTORY: 'searchHistory',
  DRAFT_MESSAGES: 'draftMessages',
  NOTIFICATION_SETTINGS: 'notificationSettings'
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USER: {
    PROFILE: '/user/me',
    UPDATE: '/user/me',
    PHOTOS: '/user/photos',
    STATS: '/user/stats',
    VISITORS: '/user/visitors',
    LIKES: '/user/likes',
    LOCATION: '/user/location'
  },
  PROFILES: {
    BROWSE: '/profiles',
    SEARCH: '/profiles/search',
    LIKE: '/profiles/:id/like',
    BLOCK: '/profiles/:id/block',
    REPORT: '/profiles/:id/report'
  },
  CHAT: {
    ROOMS: '/chat/rooms',
    MESSAGES: '/chat/rooms/:id/messages',
    READ: '/chat/rooms/:id/read'
  },
  NOTIFICATIONS: '/notifications'
};

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  TAG: /^#[a-zA-Z0-9_]+$/
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Please upload a valid image file (JPEG, PNG, WebP)',
  LOCATION_DENIED: 'Location access denied. Please enable location services.',
  CAMERA_DENIED: 'Camera access denied.',
  WEAK_PASSWORD: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PHOTO_UPLOADED: 'Photo uploaded successfully!',
  MESSAGE_SENT: 'Message sent!',
  LIKE_SENT: 'Like sent!',
  MATCH_CREATED: 'It\'s a match! 🎉',
  REPORT_SENT: 'Report submitted successfully.'
};

export const FEATURES = {
  VIDEO_CHAT: process.env.NEXT_PUBLIC_ENABLE_VIDEO_CHAT === 'true',
  VOICE_MESSAGES: process.env.NEXT_PUBLIC_ENABLE_VOICE_MESSAGES === 'true',
  LOCATION_SHARING: process.env.NEXT_PUBLIC_ENABLE_LOCATION_SHARING === 'true',
  PUSH_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
};

export const TIMEOUTS = {
  API_REQUEST: 10000, 
  DEBOUNCE_SEARCH: 500, 
  TOAST_DURATION: 5000, 
  RETRY_DELAY: 1000, 
  WEBSOCKET_RECONNECT: 3000 
};

export const DEFAULT_PREFERENCES = {
  notifications: {
    email: true,
    push: true,
    likes: true,
    messages: true,
    matches: true,
    profileViews: false
  },
  privacy: {
    showOnlineStatus: true,
    showDistance: true,
    allowMessagesFromMatches: true,
    showAge: true
  },
  discovery: {
    maxDistance: DEFAULT_SEARCH_RADIUS,
    ageRange: DEFAULT_AGE_RANGE,
    showMeToUsers: true
  }
};
