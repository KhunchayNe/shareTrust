// User types
export interface User {
  id: string
  display_name: string
  user_id: string
  picture_url?: string
  status_message?: string
  trust_score?: number
  trust_level?: number
  is_verified?: boolean
  status?: 'active' | 'suspended' | 'pending'
  created_at?: string
  updated_at?: string
  badges?: string[]
  email?: string
  phone?: string
  location?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  notifications: NotificationPreferences
  privacy: PrivacyPreferences
  payment: PaymentPreferences
}

export interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  group_messages: boolean
  payment_updates: boolean
  trust_updates: boolean
}

export interface PrivacyPreferences {
  profile_visibility: 'public' | 'members_only' | 'private'
  show_trust_score: boolean
  show_activity: boolean
  allow_messages: boolean
}

export interface PaymentPreferences {
  default_currency: string
  auto_renew: boolean
  payment_methods: string[]
}

// Sharing Group types
export interface SharingGroup {
  id: string
  title: string
  description: string
  category: string
  price_per_person: number
  currency: string
  max_members: number
  current_members: number
  min_members: number
  creator_id: string
  creator: User
  escrow_status: 'pending' | 'funded' | 'released' | 'refunded' | 'cancelled'
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  created_at: string
  updated_at: string
  expires_at: string
  renewal_date?: string
  subscription_url?: string
  subscription_details?: SubscriptionDetails
  tags?: string[]
  images?: string[]
  verification_required: boolean
  auto_approve: boolean
  members: GroupMember[]
  requirements?: GroupRequirements
}

export interface SubscriptionDetails {
  service_name: string
  plan_name: string
  features: string[]
  original_price: number
  savings_percentage: number
  renewal_frequency: 'monthly' | 'yearly'
}

export interface GroupRequirements {
  min_trust_level: number
  verification_required: boolean
  age_restriction?: number
  location_restriction?: string[]
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  user: User
  status: 'pending' | 'active' | 'suspended' | 'removed'
  joined_at: string
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
  role: 'creator' | 'member' | 'admin'
}

// Transaction types
export interface Transaction {
  id: string
  group_id: string
  user_id: string
  user: User
  group: SharingGroup
  amount: number
  currency: string
  payment_method: 'promptpay' | 'stripe' | 'paypal' | 'bank_transfer'
  payment_reference: string
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
  escrow_status: 'pending' | 'held' | 'released' | 'refunded'
  created_at: string
  updated_at: string
  completed_at?: string
  refunded_at?: string
  metadata?: TransactionMetadata
}

export interface TransactionMetadata {
  external_id?: string
  gateway_response?: any
  refund_reason?: string
  notes?: string
}

// Trust System types
export interface TrustEvent {
  id: string
  user_id: string
  event_type: 'positive' | 'negative' | 'neutral'
  event_name: string
  points: number
  description: string
  reference_id?: string
  reference_type?: 'transaction' | 'verification' | 'group' | 'report'
  created_at: string
  metadata?: any
}

export interface TrustLevel {
  level: number
  name: string
  min_score: number
  max_score: number
  benefits: string[]
  color: string
  icon: string
}

// Verification types
export interface Verification {
  id: string
  user_id: string
  type: 'phone' | 'id_card' | 'address' | 'email' | 'payment_method'
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  data: VerificationData
  documents?: VerificationDocument[]
  submitted_at: string
  reviewed_at?: string
  reviewer_id?: string
  expires_at?: string
  notes?: string
}

export interface VerificationData {
  [key: string]: any
}

export interface VerificationDocument {
  id: string
  type: string
  url: string
  filename: string
  size: number
  mime_type: string
  uploaded_at: string
}

// Message types
export interface Message {
  id: string
  group_id: string
  sender_id: string
  sender: User
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  reply_to_id?: string
  attachments?: MessageAttachment[]
  created_at: string
  updated_at: string
  is_edited: boolean
  is_deleted: boolean
}

export interface MessageAttachment {
  id: string
  message_id: string
  type: 'image' | 'file' | 'video'
  url: string
  filename: string
  size: number
  mime_type: string
  thumbnail_url?: string
}

// Report types
export interface Report {
  id: string
  reporter_id: string
  reporter: User
  reported_user_id?: string
  reported_user?: User
  reported_group_id?: string
  reported_group?: SharingGroup
  reported_message_id?: string
  type: 'user' | 'group' | 'message' | 'transaction'
  category: 'fraud' | 'spam' | 'inappropriate' | 'harassment' | 'other'
  description: string
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
  updated_at: string
  resolved_at?: string
  resolved_by?: string
  resolution_notes?: string
  evidence?: ReportEvidence[]
}

export interface ReportEvidence {
  id: string
  report_id: string
  type: 'screenshot' | 'chat_log' | 'transaction' | 'other'
  url: string
  description: string
  uploaded_at: string
}

// Notification types
export interface Notification {
  id: string
  user_id: string
  type: 'group_invite' | 'payment_due' | 'payment_received' | 'group_update' | 'trust_update' | 'verification' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
  read_at?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// LIFF types
export interface LiffProfile {
  displayName: string
  userId: string
  pictureUrl?: string
  statusMessage?: string
}

// Form types
export interface CreateGroupFormData {
  title: string
  description: string
  category: string
  price_per_person: number
  currency: string
  max_members: number
  min_members: number
  expires_at?: string
  verification_required: boolean
  auto_approve: boolean
  subscription_url?: string
  tags?: string[]
  images?: File[]
}

export interface JoinGroupFormData {
  group_id: string
  payment_method: string
  agree_to_terms: boolean
}

export interface VerificationFormData {
  type: string
  data: any
  documents?: File[]
}

// Filter and Search types
export interface GroupFilters {
  category?: string[]
  price_range?: [number, number]
  member_count?: [number, number]
  trust_level?: number[]
  verification_required?: boolean
  status?: string[]
  search_query?: string
}

export interface SortOptions {
  field: 'created_at' | 'price_per_person' | 'trust_score' | 'current_members'
  direction: 'asc' | 'desc'
}

// Component Props types
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

// Theme types
export interface Theme {
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    danger: string
    info: string
  }
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}