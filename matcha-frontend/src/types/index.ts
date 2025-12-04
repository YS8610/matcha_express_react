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
  lastOnline?: number;
  latitude?: number;
  longitude?: number;
  birthDate?: string;
}

export interface Profile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: number;
  sexualPreference: number;
  biography: string;
  birthDate: string;
  fameRating: number;
  photo0: string;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  location?: Location;
  lastOnline: number;
  connectionStatus?: ConnectionStatus;
}

export interface ConnectionStatus {
  userid: string;
  matched: boolean;
  liked: boolean;
  likedBack: boolean;
}

export interface ProfileShort {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  photo0: string;
  fameRating: number;
  distance?: number;
  lastOnline: number;
  birthDate?: string;
  userTags?: string[];
  latitude?: number;
  longitude?: number;
  connectionStatus?: ConnectionStatus;
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
  userId: string;
  type: 'like' | 'view' | 'message' | 'match' | 'unlike';
  message: string;
  read: boolean;
  createdAt: number;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface ChatMessage {
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: number;
}

export interface Conversation {
  userId: string;
  username: string;
  profilePhoto?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  lastOnline?: number;
}

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  distanceMax?: number;
  fameMin?: number;
  fameMax?: number;
  interests?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  password: string;
  password2?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  msg: string;
}

export interface ApiResponse<T = Record<string, unknown>> {
  msg?: string;
  message?: string;
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  activateAccount: (token: string) => Promise<void>;
  updateUser: (user: User) => void;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface Socket {
  id: string;
  emit: (event: string, data?: unknown, callback?: (data?: unknown) => void) => Socket;
  on: (event: string, listener: (data?: unknown) => void) => Socket;
  off: (event: string, listener?: (data?: unknown) => void) => Socket;
  connect: () => Socket;
  disconnect: () => Socket;
  connected: boolean;
  disconnected: boolean;
}

export interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  onlineUsers: Record<string, boolean>;
  chatMessages: Record<string, ChatMessage[]>;
  checkOnlineStatus: (userIds: string[]) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  sendChatMessage: (toUserId: string, content: string) => void;
  getChatHistory: (userId: string) => ChatMessage[];
}

export interface UseWebSocketOptions {
  onNotification?: (notification: Notification) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  checkOnlineUsers?: string[];
}

export interface Neo4jInteger {
  low: number;
  high: number;
}

export interface Neo4jDate {
  year: Neo4jInteger | number;
  month: Neo4jInteger | number;
  day: Neo4jInteger | number;
}

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  activated: boolean;
  latitude?: number;
  longitude?: number;
  birthDate?: string;
  iat?: number;
  exp?: number;
  nbf?: number;
}

export interface TokenValidationResult {
  valid: boolean;
  reason?: string;
}

export interface ProfileViewed {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  photo0: string;
  viewedAt: number;
}

export interface UserPhotosResponse {
  photoNames: string[];
}

export interface UserTagsResponse {
  tags: string[];
}

export interface ChatHistoryResponse {
  data: ChatMessage[];
}
