// Core user and profile types
export interface UserProfile {
  id: string;
  line_user_id?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  trust_level: number;
  trust_score: number;
  is_verified: boolean;
  verification_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// LINE user data from JWT token
export interface LineUserProfile {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
  [key: string]: unknown;
}

// Trust level definitions
export type TrustLevel = 1 | 2 | 3 | 4 | 5;

export interface TrustLevelInfo {
  level: TrustLevel;
  label: string;
  description: string;
  color: string;
  minScore: number;
  maxScore: number;
}

// Badge system
export interface UserBadge {
  id: string;
  badge_id: string;
  profile_id: string;
  earned_at: string;
  metadata?: Record<string, unknown>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'verification' | 'trust' | 'achievement';
  requirement_type: 'automatic' | 'manual' | 'threshold';
  requirement_value?: number;
}

// Sharing groups
export interface SharingGroup {
  id: string;
  title: string;
  description: string;
  category: SharingCategory;
  creator_id: string;
  price_per_member: number;
  currency: string;
  max_members: number;
  current_members: number;
  escrow_status: EscrowStatus;
  status: GroupStatus;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export type SharingCategory =
  | 'streaming'
  | 'ai_tools'
  | 'gaming'
  | 'software'
  | 'other';

export type EscrowStatus = 'pending' | 'funded' | 'released' | 'refunded';

export type GroupStatus = 'active' | 'completed' | 'expired' | 'cancelled';

// Transactions
export interface Transaction {
  id: string;
  group_id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  escrow_reference?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export type TransactionType = 'payment' | 'refund' | 'release' | 'fee';

export type PaymentMethod = 'promptpay' | 'stripe' | 'bank_transfer';

export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

// Trust events
export interface TrustEvent {
  id: string;
  profile_id: string;
  event_type: TrustEventType;
  score_change: number;
  description: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
}

export type TrustEventType =
  | 'profile_created'
  | 'phone_verified'
  | 'id_verified'
  | 'payment_completed'
  | 'group_created'
  | 'group_joined'
  | 'group_completed'
  | 'violation_reported'
  | 'penalty_applied';

// Verifications
export interface Verification {
  id: string;
  profile_id: string;
  type: VerificationType;
  status: VerificationStatus;
  data: Record<string, unknown>;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  verified_at?: string;
}

export type VerificationType = 'phone' | 'id_card' | 'promptpay' | 'email';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';

// UI Component Props
export interface ProfileStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export interface TrustProgressProps {
  currentScore: number;
  currentLevel: TrustLevel;
  nextLevelScore: number;
  showAnimation?: boolean;
}

export interface ActivityCardProps {
  title: string;
  description?: string;
  timestamp: string;
  type: 'transaction' | 'group' | 'verification' | 'trust';
  status?: string;
  amount?: number;
  currency?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

// Navigation and routing
export interface ProfileTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

// Form types
export interface ProfileFormData {
  display_name: string;
  phone?: string;
  email?: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy_settings: {
    show_real_name: boolean;
    show_email: boolean;
    show_phone: boolean;
    allow_group_invites: boolean;
  };
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Chart and analytics types
export interface TrustScoreHistory {
  date: string;
  score: number;
  level: TrustLevel;
  events: TrustEvent[];
}

export interface ActivitySummary {
  total_groups: number;
  total_transactions: number;
  total_spent: number;
  success_rate: number;
  member_rating: number;
}