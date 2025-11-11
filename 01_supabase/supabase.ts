import { createClient } from '@supabase/supabase-js';

// These should be stored in environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  line_user_id?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  trust_level: number;
  trust_score: number;
  is_verified: boolean;
  verification_data?: any;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface SharingGroup {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  creator_id: string;
  max_members: number;
  current_members: number;
  price_per_person: number;
  billing_cycle: string;
  status: string;
  escrow_status: string;
  line_group_url?: string;
  subscription_details?: any;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'left';
  payment_status: 'pending' | 'paid' | 'refunded';
  joined_at: string;
}

export interface Transaction {
  id: string;
  group_id: string;
  user_id: string;
  type: 'payment' | 'refund' | 'escrow_release';
  amount: number;
  currency: string;
  payment_method?: 'promptpay' | 'stripe';
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  metadata?: any;
  created_at: string;
  completed_at?: string;
}

export interface Verification {
  id: string;
  user_id: string;
  type: 'phone' | 'id_card' | 'promptpay';
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  verified_by?: string;
  documents?: string[];
  created_at: string;
  verified_at?: string;
}

export interface TrustEvent {
  id: string;
  user_id: string;
  event_type: 'positive' | 'negative' | 'neutral';
  reason: string;
  score_change: number;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_group_id?: string;
  reason: string;
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  ai_risk_score?: number;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Message {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  ai_analysis?: any;
  is_flagged: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_icon?: string;
  earned_at: string;
  expires_at?: string;
}

// Database queries and helpers
export const db = {
  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'trust_score' | 'trust_level'>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...profile,
        trust_score: 0,
        trust_level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Sharing Groups
  async getSharingGroups(categoryId?: string): Promise<SharingGroup[]> {
    let query = supabase
      .from('sharing_groups')
      .select(`
        *,
        creator:profiles(display_name, avatar_url, trust_score),
        category:categories(name, icon)
      `)
      .eq('status', 'active');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSharingGroup(groupId: string): Promise<SharingGroup | null> {
    const { data, error } = await supabase
      .from('sharing_groups')
      .select(`
        *,
        creator:profiles(display_name, avatar_url, trust_score),
        category:categories(name, icon),
        members:group_members(
          id,
          user_id,
          status,
          joined_at,
          profile:profiles(display_name, avatar_url, trust_score)
        )
      `)
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data;
  },

  async createSharingGroup(group: Omit<SharingGroup, 'id' | 'created_at' | 'updated_at' | 'current_members'>): Promise<SharingGroup> {
    const { data, error } = await supabase
      .from('sharing_groups')
      .insert({
        ...group,
        current_members: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as first member
    await this.addGroupMember(data.id, group.creator_id);

    return data;
  },

  // Group Members
  async addGroupMember(groupId: string, userId: string): Promise<GroupMember> {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        status: 'approved',
        payment_status: 'pending',
        joined_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        status: 'pending',
        payment_status: 'pending',
        joined_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Transactions
  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        sharing_groups(title)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Trust Events
  async addTrustEvent(event: Omit<TrustEvent, 'id' | 'created_at'>): Promise<TrustEvent> {
    const { data, error } = await supabase
      .from('trust_events')
      .insert({
        ...event,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reports
  async createReport(report: Omit<Report, 'id' | 'created_at' | 'resolved_at'>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        ...report,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Messages
  async getGroupMessages(groupId: string, limit: number = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profile:profiles(display_name, avatar_url)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async sendMessage(message: Omit<Message, 'id' | 'created_at' | 'is_flagged' | 'ai_analysis'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        is_flagged: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export default supabase;