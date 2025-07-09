/*
  # Add client documents and communication tracking

  1. New Tables
    - `client_documents` - Store client document metadata and links
    - `client_communications` - Track all client interactions
    - `analysis_templates` - Reusable analysis templates
    - `user_notifications` - In-app notification system

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for user access

  3. Enhancements
    - Add document management capabilities
    - Track client communication history
    - Template system for analyses
    - Notification system
*/

-- Client Documents Table
CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL DEFAULT 'general',
  file_url text,
  file_size integer,
  mime_type text,
  upload_date timestamptz DEFAULT now(),
  is_signed boolean DEFAULT false,
  signed_date timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Client Communications Table
CREATE TABLE IF NOT EXISTS client_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  communication_type text NOT NULL DEFAULT 'email',
  subject text NOT NULL,
  content text NOT NULL,
  direction text NOT NULL DEFAULT 'outbound',
  status text DEFAULT 'sent',
  scheduled_for timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analysis Templates Table
CREATE TABLE IF NOT EXISTS analysis_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  template_name text NOT NULL,
  template_description text DEFAULT '',
  template_data jsonb NOT NULL DEFAULT '{}',
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Notifications Table
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  is_read boolean DEFAULT false,
  action_url text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- System Banners Table (for admin announcements)
CREATE TABLE IF NOT EXISTS system_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_type ON client_documents(document_type);

CREATE INDEX IF NOT EXISTS idx_client_communications_client_id ON client_communications(client_id);
CREATE INDEX IF NOT EXISTS idx_client_communications_user_id ON client_communications(user_id);
CREATE INDEX IF NOT EXISTS idx_client_communications_type ON client_communications(communication_type);
CREATE INDEX IF NOT EXISTS idx_client_communications_date ON client_communications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_templates_user_id ON analysis_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_templates_public ON analysis_templates(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_unread ON user_notifications(user_id, is_read) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_system_banners_active ON system_banners(active, expires_at) WHERE active = true;

-- Enable RLS
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_documents
CREATE POLICY "Users can manage own client documents"
  ON client_documents
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for client_communications
CREATE POLICY "Users can manage own client communications"
  ON client_communications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for analysis_templates
CREATE POLICY "Users can manage own templates"
  ON analysis_templates
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view public templates"
  ON analysis_templates
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- RLS Policies for user_notifications
CREATE POLICY "Users can view own notifications"
  ON user_notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON user_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for system_banners
CREATE POLICY "Everyone can view active banners"
  ON system_banners
  FOR SELECT
  TO authenticated
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage banners"
  ON system_banners
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND (full_name ILIKE '%admin%' OR company_name ILIKE '%admin%')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND (full_name ILIKE '%admin%' OR company_name ILIKE '%admin%')
    )
  );

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_documents_updated_at
    BEFORE UPDATE ON client_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_communications_updated_at
    BEFORE UPDATE ON client_communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_templates_updated_at
    BEFORE UPDATE ON analysis_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();