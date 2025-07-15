/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - The "Admins can read all profiles" policy causes infinite recursion
    - Policy tries to query user_profiles table to check if user is admin
    - This creates a circular dependency during policy evaluation

  2. Solution
    - Remove the problematic "Admins can read all profiles" policy
    - This resolves the infinite recursion error
    - Admin functionality can be re-implemented later using non-recursive patterns
*/

-- Remove the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;