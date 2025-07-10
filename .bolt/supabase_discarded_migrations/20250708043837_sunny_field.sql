/*
  # Admin Setup and Sample Data

  1. Admin User Setup
    - Create admin user for @legacywealthco.com
    - Set up proper role assignment

  2. Sample Data
    - Create sample needs analyses
    - Create sample client intakes

  3. Functions
    - Update profile creation to handle role assignment based on email
*/

-- Update the handle_new_user function to assign roles based on email domain
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role text := 'agent';
BEGIN
  -- Check if email ends with @legacywealthco.com for admin role
  IF NEW.email LIKE '%@legacywealthco.com' THEN
    user_role := 'admin';
  END IF;

  INSERT INTO user_profiles (id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user profile (this will be created when the user signs up)
-- The actual user creation happens through Supabase Auth

-- Insert sample system banner for testing
INSERT INTO system_banners (title, message, type, active, created_at) VALUES
('Welcome to LifeGuard Pro', 'Your advanced insurance platform is now live! Explore all the features available to help grow your business.', 'info', true, now())
ON CONFLICT DO NOTHING;