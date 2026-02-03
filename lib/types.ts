/**
 * Type definitions for HeartMatch Dating App
 */

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  accuracy?: number;
  hideExactLocation?: boolean;
  lastUpdated?: Date;
}

// User Types
export interface User {
  id: string;
  telegramId?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  photos: string[];
  location: LocationData;
  relationshipType: RelationshipType;
  preferences: UserPreferences;
  isPremium: boolean;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  ageMin: number;
  ageMax: number;
  genderPreference: 'male' | 'female' | 'all';
  maxDistance: number;
  interests: string[];
  relationshipTypes: RelationshipType[];
}

export type RelationshipType = 'friendship' | 'serious' | 'casual' | 'professional';

// Profile Types
export interface Profile {
  id: string;
  userId: string;
  user: User;
  photos: string[];
  compatibility?: number;
  distance?: number;
  isNew?: boolean;
}

// Interaction Types
export interface Interaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'like' | 'pass' | 'super_like';
  createdAt: Date;
}

// Match Types
export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: User;
  user2: User;
  matchedAt: Date;
  unmatchedAt?: Date;
  isActive: boolean;
}

// Message Types
export interface Message {
  id: string;
  matchId: string;
  fromUserId: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  matchId: string;
  match: Match;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  expiryDate: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
}

export type SubscriptionPlan = '1_month' | '3_months' | '6_months' | '1_year';

export interface SubscriptionDetails {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  perMonth: number;
  discount?: number;
  features: string[];
}

// Like Types
export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  isMatched: boolean;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'like' | 'message' | 'super_like' | 'promotion';
  title: string;
  description: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// Filter Types
export interface DiscoveryFilter {
  ageMin?: number;
  ageMax?: number;
  genderPreference?: 'male' | 'female' | 'all';
  maxDistance?: number;
  relationshipTypes?: RelationshipType[];
  interests?: string[];
  excludeMatched?: boolean;
  excludePassed?: boolean;
  sortBy?: 'distance' | 'compatibility' | 'recent' | 'top_rated';
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
}

// Distance Info Type
export interface DistanceInfo {
  distance: number;
  isExact: boolean;
  displayDistance: string;
  distanceCategory: 'very_close' | 'close' | 'nearby' | 'moderate' | 'far';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Auth Types
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface TelegramInitData {
  userId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  authDate: number;
  hash: string;
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  swipesPerDay: number;
  likesReceived: number;
  matchesCount: number;
  messagesCount: number;
  premiumUpgradeDate?: Date;
  churnRisk: 'high' | 'medium' | 'low';
}

// Settings Types
export interface UserSettings {
  emailNotifications: boolean;
  matchNotifications: boolean;
  messageNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  profileVisibility: 'public' | 'friends' | 'private';
  language: string;
}

// Boost/Feature Types
export interface Boost {
  id: string;
  userId: string;
  type: 'super_like' | 'profile_boost' | 'super_swipe';
  expiresAt: Date;
  isActive: boolean;
}

// Error Types
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
} as const;
