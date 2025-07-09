/*
  # Enhance existing tables with additional useful columns

  1. User Profiles Enhancements
    - Add role-based access control
    - Add subscription/plan information
    - Add preferences and settings

  2. Clients Enhancements
    - Add client status and lifecycle tracking
    - Add referral source tracking
    - Add client value metrics

  3. Needs Analyses Enhancements
    - Add analysis status workflow
    - Add collaboration features
    - Add version control

  4. Tools Enhancements
    - Add usage analytics
    - Add feature flags
*/

-- Enhance user_profiles table
DO $$
BEGIN
  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text DEFAULT 'agent';
  END IF;

  -- Add subscription information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_plan text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_status text DEFAULT 'active';
  END IF;

  -- Add preferences
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'preferences'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN preferences jsonb DEFAULT '{}';
  END IF;

  -- Add last login tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Enhance clients table
DO $$
BEGIN
  -- Add client status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'status'
  ) THEN
    ALTER TABLE clients ADD COLUMN status text DEFAULT 'prospect';
  END IF;

  -- Add referral source
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'referral_source'
  ) THEN
    ALTER TABLE clients ADD COLUMN referral_source text DEFAULT '';
  END IF;

  -- Add client value metrics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'lifetime_value'
  ) THEN
    ALTER TABLE clients ADD COLUMN lifetime_value numeric DEFAULT 0;
  END IF;

  -- Add tags for categorization
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'tags'
  ) THEN
    ALTER TABLE clients ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add last contact date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'last_contact'
  ) THEN
    ALTER TABLE clients ADD COLUMN last_contact timestamptz;
  END IF;
END $$;

-- Enhance needs_analyses table
DO $$
BEGIN
  -- Add analysis status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'needs_analyses' AND column_name = 'status'
  ) THEN
    ALTER TABLE needs_analyses ADD COLUMN status text DEFAULT 'draft';
  END IF;

  -- Add version control
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'needs_analyses' AND column_name = 'version'
  ) THEN
    ALTER TABLE needs_analyses ADD COLUMN version integer DEFAULT 1;
  END IF;

  -- Add parent analysis for versioning
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'needs_analyses' AND column_name = 'parent_analysis_id'
  ) THEN
    ALTER TABLE needs_analyses ADD COLUMN parent_analysis_id uuid REFERENCES needs_analyses(id);
  END IF;

  -- Add shared access
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'needs_analyses' AND column_name = 'shared_with'
  ) THEN
    ALTER TABLE needs_analyses ADD COLUMN shared_with uuid[] DEFAULT '{}';
  END IF;

  -- Add analysis metadata
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'needs_analyses' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE needs_analyses ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Enhance tools table
DO $$
BEGIN
  -- Add usage analytics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'usage_count'
  ) THEN
    ALTER TABLE tools ADD COLUMN usage_count integer DEFAULT 0;
  END IF;

  -- Add feature flags
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'feature_flags'
  ) THEN
    ALTER TABLE tools ADD COLUMN feature_flags jsonb DEFAULT '{}';
  END IF;

  -- Add required permissions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'required_role'
  ) THEN
    ALTER TABLE tools ADD COLUMN required_role text DEFAULT 'agent';
  END IF;

  -- Add tool configuration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tools' AND column_name = 'configuration'
  ) THEN
    ALTER TABLE tools ADD COLUMN configuration jsonb DEFAULT '{}';
  END IF;
END $$;

-- Add some useful indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_plan, subscription_status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_last_contact ON clients(last_contact DESC);
CREATE INDEX IF NOT EXISTS idx_needs_analyses_status ON needs_analyses(status);
CREATE INDEX IF NOT EXISTS idx_needs_analyses_version ON needs_analyses(parent_analysis_id, version);
CREATE INDEX IF NOT EXISTS idx_tools_role ON tools(required_role);