/*
  # Needs Analysis System

  1. New Tables
    - `needs_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `client_name` (text)
      - `client_data` (jsonb) - stores all form data
      - `analysis_results` (jsonb) - stores calculation results
      - `total_needs` (numeric)
      - `coverage_gap` (numeric)
      - `estimated_premium` (numeric)
      - `recommendations` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `needs_analyses` table
    - Users can only access their own analyses
    - Admins can view all analyses

  3. Indexes
    - Index on user_id for performance
    - Index on client_name for search
    - Index on created_at for sorting
*/

-- Create needs analyses table
CREATE TABLE IF NOT EXISTS needs_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_data jsonb NOT NULL DEFAULT '{}',
  analysis_results jsonb NOT NULL DEFAULT '{}',
  total_needs numeric DEFAULT 0,
  coverage_gap numeric DEFAULT 0,
  estimated_premium numeric DEFAULT 0,
  recommendations jsonb DEFAULT '[]',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE needs_analyses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own analyses"
  ON needs_analyses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own analyses"
  ON needs_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own analyses"
  ON needs_analyses
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own analyses"
  ON needs_analyses
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can read all analyses"
  ON needs_analyses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_needs_analyses_user_id ON needs_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_needs_analyses_client_name ON needs_analyses(client_name);
CREATE INDEX IF NOT EXISTS idx_needs_analyses_created_at ON needs_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_needs_analyses_status ON needs_analyses(status);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_needs_analyses_updated_at ON needs_analyses;
CREATE TRIGGER update_needs_analyses_updated_at
  BEFORE UPDATE ON needs_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();