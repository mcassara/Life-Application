/*
  # Client Intake System

  1. New Tables
    - `client_intakes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `needs_analysis_id` (uuid, optional reference to needs_analyses)
      - `client_name` (text)
      - `client_email` (text)
      - `client_phone` (text)
      - `personal_info` (jsonb)
      - `financial_info` (jsonb)
      - `family_info` (jsonb)
      - `insurance_info` (jsonb)
      - `documents` (jsonb) - array of document references
      - `status` (text)
      - `completion_percentage` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `client_intakes` table
    - Users can only access their own client intakes
    - Admins can view all intakes

  3. Features
    - Link to needs analysis for seamless workflow
    - Track completion percentage
    - Store documents securely
*/

-- Create client intakes table
CREATE TABLE IF NOT EXISTS client_intakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  needs_analysis_id uuid REFERENCES needs_analyses(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text DEFAULT '',
  client_phone text DEFAULT '',
  personal_info jsonb DEFAULT '{}',
  financial_info jsonb DEFAULT '{}',
  family_info jsonb DEFAULT '{}',
  insurance_info jsonb DEFAULT '{}',
  documents jsonb DEFAULT '[]',
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'pending_review', 'approved')),
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_intakes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own client intakes"
  ON client_intakes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own client intakes"
  ON client_intakes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own client intakes"
  ON client_intakes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own client intakes"
  ON client_intakes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can read all client intakes"
  ON client_intakes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_intakes_user_id ON client_intakes(user_id);
CREATE INDEX IF NOT EXISTS idx_client_intakes_needs_analysis_id ON client_intakes(needs_analysis_id);
CREATE INDEX IF NOT EXISTS idx_client_intakes_client_name ON client_intakes(client_name);
CREATE INDEX IF NOT EXISTS idx_client_intakes_status ON client_intakes(status);
CREATE INDEX IF NOT EXISTS idx_client_intakes_created_at ON client_intakes(created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_client_intakes_updated_at ON client_intakes;
CREATE TRIGGER update_client_intakes_updated_at
  BEFORE UPDATE ON client_intakes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();