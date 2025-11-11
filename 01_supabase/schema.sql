-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  line_user_id VARCHAR(255) UNIQUE,
  display_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  trust_level INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories for sharing groups
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sharing groups/posts
CREATE TABLE IF NOT EXISTS sharing_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  creator_id UUID REFERENCES profiles(id),
  max_members INTEGER NOT NULL,
  current_members INTEGER DEFAULT 1,
  price_per_person DECIMAL(10,2) NOT NULL,
  billing_cycle VARCHAR(50) DEFAULT 'monthly', -- monthly, yearly, one-time
  status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
  escrow_status VARCHAR(50) DEFAULT 'pending', -- pending, funded, released, refunded
  line_group_url TEXT,
  subscription_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members
CREATE TABLE IF NOT EXISTS group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES sharing_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, left
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Transactions/Escrow records
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES sharing_groups(id),
  user_id UUID REFERENCES profiles(id),
  type VARCHAR(50) NOT NULL, -- payment, refund, escrow_release
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'THB',
  payment_method VARCHAR(50), -- promptpay, stripe
  payment_reference TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Identity verifications
CREATE TABLE IF NOT EXISTS verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type VARCHAR(50) NOT NULL, -- phone, id_card, promptpay
  data JSONB NOT NULL, -- encrypted verification data
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  verified_by UUID REFERENCES profiles(id), -- admin who verified
  documents TEXT[], -- URLs to stored documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Trust score events
CREATE TABLE IF NOT EXISTS trust_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  event_type VARCHAR(50) NOT NULL, -- positive, negative, neutral
  reason VARCHAR(255) NOT NULL,
  score_change INTEGER NOT NULL,
  reference_type VARCHAR(50), -- transaction, group, verification, report
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud/scam reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id),
  reported_user_id UUID REFERENCES profiles(id),
  reported_group_id UUID REFERENCES sharing_groups(id),
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, under_review, resolved, dismissed
  ai_risk_score INTEGER, -- 0-100 risk score from AI analysis
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Messages within groups (for AI monitoring)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES sharing_groups(id),
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, file
  ai_analysis JSONB, -- fraud risk, sentiment, etc.
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  badge_type VARCHAR(50) NOT NULL, -- verified, trusted, safe_partner, etc.
  badge_name VARCHAR(100) NOT NULL,
  badge_icon VARCHAR(20),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, badge_type)
);

-- Insert default categories
INSERT INTO categories (name, icon, description) VALUES
('Streaming', '🎬', 'Netflix, Disney+, etc. streaming services'),
('AI Tools', '🧠', 'ChatGPT, Midjourney, etc. AI subscriptions'),
('Gaming', '🎮', 'Game passes, gaming platforms, etc.'),
('Software', '💼', 'Adobe, Microsoft, etc. software licenses')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_line_user_id ON profiles(line_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_trust_score ON profiles(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_sharing_groups_creator_id ON sharing_groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_sharing_groups_category_id ON sharing_groups(category_id);
CREATE INDEX IF NOT EXISTS idx_sharing_groups_status ON sharing_groups(status);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_group_id ON transactions(group_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Sharing groups policies
CREATE POLICY "Anyone can view active sharing groups" ON sharing_groups FOR SELECT USING (status = 'active');
CREATE POLICY "Verified users can create sharing groups" ON sharing_groups FOR INSERT WITH CHECK (
  auth.uid() = creator_id AND
  (SELECT is_verified FROM profiles WHERE id = auth.uid()) = true
);

-- Group members policies
CREATE POLICY "Users can view group members" ON group_members FOR SELECT USING (true);
CREATE POLICY "Group members can manage their membership" ON group_members FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Group members can view group messages" ON messages FOR SELECT USING (
  user_id IN (
    SELECT user_id FROM group_members
    WHERE group_id = messages.group_id AND status = 'approved'
  )
);
CREATE POLICY "Group members can create messages" ON messages FOR INSERT WITH CHECK (
  user_id IN (
    SELECT user_id FROM group_members
    WHERE group_id = messages.group_id AND status = 'approved'
  )
);

-- Reports policies
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can view all reports" ON reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_verified = true)
);

-- Functions to automatically update trust scores
CREATE OR REPLACE FUNCTION update_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET trust_score = (
    SELECT COALESCE(SUM(score_change), 0)
    FROM trust_events
    WHERE user_id = NEW.user_id
  ),
  updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Update trust level based on score
  UPDATE profiles
  SET trust_level = CASE
    WHEN trust_score >= 100 THEN 5
    WHEN trust_score >= 50 THEN 4
    WHEN trust_score >= 20 THEN 3
    WHEN trust_score >= 5 THEN 2
    ELSE 1
  END
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trust_score
  AFTER INSERT OR UPDATE ON trust_events
  FOR EACH ROW
  EXECUTE FUNCTION update_trust_score();

-- Function to update current members in sharing groups
CREATE OR REPLACE FUNCTION update_group_members()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sharing_groups
    SET current_members = current_members + 1,
        updated_at = NOW()
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sharing_groups
    SET current_members = current_members - 1,
        updated_at = NOW()
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_group_members
  AFTER INSERT OR DELETE ON group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_members();