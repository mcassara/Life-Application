/*
  # Initial Database Schema for Life Application (Fixed)

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `needs_analyses` - Insurance needs analysis records
    - `clients` - Client information and intake data
    - `client_documents` - Document storage for clients
    - `client_communications` - Communication history
    - `analysis_templates` - Reusable analysis templates
    - `system_banners` - Admin system announcements
    - `user_notifications` - User notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data (with conditional creation)
    - Add admin policies where appropriate

  3. Indexes
    - Add performance indexes for frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  role text DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  company_name text DEFAULT '',
  brand_logo text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  license_number text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Needs Analyses Table
CREATE TABLE IF NOT EXISTS needs_analyses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  client_name text NOT NULL DEFAULT '',
  annual_income numeric DEFAULT 0,
  current_savings numeric DEFAULT 0,
  monthly_expenses numeric DEFAULT 0,
  current_life_insurance numeric DEFAULT 0,
  spouse_income numeric DEFAULT 0,
  number_of_dependents integer DEFAULT 0,
  children_ages text DEFAULT '',
  marital_status text DEFAULT '',
  employer_benefits numeric DEFAULT 0,
  coverage_gap numeric DEFAULT 0,
  recommended_coverage numeric DEFAULT 0,
  priority_score numeric DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'reviewed')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  status text DEFAULT 'prospect' CHECK (status IN ('prospect', 'active', 'inactive')),
  notes jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Client Documents Table
CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL DEFAULT '',
  file_path text NOT NULL,
  file_size integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Client Communications Table
CREATE TABLE IF NOT EXISTS client_communications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  communication_type text NOT NULL CHECK (communication_type IN ('email', 'phone', 'meeting')),
  subject text NOT NULL DEFAULT '',
  content text DEFAULT '',
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Analysis Templates Table
CREATE TABLE IF NOT EXISTS analysis_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  template_data jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- System Banners Table
CREATE TABLE IF NOT EXISTS system_banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  banner_type text DEFAULT 'info' CHECK (banner_type IN ('info', 'warning', 'success', 'error')),
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- User Notifications Table
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE needs_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies (conditional creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Needs Analyses Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'needs_analyses' AND policyname = 'Users can read own analyses'
  ) THEN
    CREATE POLICY "Users can read own analyses"
      ON needs_analyses
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'needs_analyses' AND policyname = 'Users can insert own analyses'
  ) THEN
    CREATE POLICY "Users can insert own analyses"
      ON needs_analyses
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'needs_analyses' AND policyname = 'Users can update own analyses'
  ) THEN
    CREATE POLICY "Users can update own analyses"
      ON needs_analyses
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'needs_analyses' AND policyname = 'Users can delete own analyses'
  ) THEN
    CREATE POLICY "Users can delete own analyses"
      ON needs_analyses
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Clients Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' AND policyname = 'Users can read own clients'
  ) THEN
    CREATE POLICY "Users can read own clients"
      ON clients
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' AND policyname = 'Users can insert own clients'
  ) THEN
    CREATE POLICY "Users can insert own clients"
      ON clients
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' AND policyname = 'Users can update own clients'
  ) THEN
    CREATE POLICY "Users can update own clients"
      ON clients
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' AND policyname = 'Users can delete own clients'
  ) THEN
    CREATE POLICY "Users can delete own clients"
      ON clients
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Client Documents Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_documents' AND policyname = 'Users can read own client documents'
  ) THEN
    CREATE POLICY "Users can read own client documents"
      ON client_documents
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_documents' AND policyname = 'Users can insert own client documents'
  ) THEN
    CREATE POLICY "Users can insert own client documents"
      ON client_documents
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_documents' AND policyname = 'Users can delete own client documents'
  ) THEN
    CREATE POLICY "Users can delete own client documents"
      ON client_documents
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Client Communications Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_communications' AND policyname = 'Users can read own client communications'
  ) THEN
    CREATE POLICY "Users can read own client communications"
      ON client_communications
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_communications' AND policyname = 'Users can insert own client communications'
  ) THEN
    CREATE POLICY "Users can insert own client communications"
      ON client_communications
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_communications' AND policyname = 'Users can update own client communications'
  ) THEN
    CREATE POLICY "Users can update own client communications"
      ON client_communications
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'client_communications' AND policyname = 'Users can delete own client communications'
  ) THEN
    CREATE POLICY "Users can delete own client communications"
      ON client_communications
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Analysis Templates Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analysis_templates' AND policyname = 'Users can read own and public templates'
  ) THEN
    CREATE POLICY "Users can read own and public templates"
      ON analysis_templates
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() OR is_public = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analysis_templates' AND policyname = 'Users can insert own templates'
  ) THEN
    CREATE POLICY "Users can insert own templates"
      ON analysis_templates
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analysis_templates' AND policyname = 'Users can update own templates'
  ) THEN
    CREATE POLICY "Users can update own templates"
      ON analysis_templates
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'analysis_templates' AND policyname = 'Users can delete own templates'
  ) THEN
    CREATE POLICY "Users can delete own templates"
      ON analysis_templates
      FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- System Banners Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'system_banners' AND policyname = 'Everyone can read active banners'
  ) THEN
    CREATE POLICY "Everyone can read active banners"
      ON system_banners
      FOR SELECT
      TO authenticated
      USING (active = true AND (expires_at IS NULL OR expires_at > now()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'system_banners' AND policyname = 'Admins can manage banners'
  ) THEN
    CREATE POLICY "Admins can manage banners"
      ON system_banners
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- User Notifications Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' AND policyname = 'Users can read own notifications'
  ) THEN
    CREATE POLICY "Users can read own notifications"
      ON user_notifications
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notifications' AND policyname = 'Users can update own notifications'
  ) THEN
    CREATE POLICY "Users can update own notifications"
      ON user_notifications
      FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_needs_analyses_user_id ON needs_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_needs_analyses_created_at ON needs_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_communications_user_id ON client_communications(user_id);
CREATE INDEX IF NOT EXISTS idx_client_communications_client_id ON client_communications(client_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_banners_active ON system_banners(active, expires_at);