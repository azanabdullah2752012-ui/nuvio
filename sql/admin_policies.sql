-- 🏆 ADMIN AUTHORITY UPGRADE
-- Execute this in your Supabase SQL Editor to allow Admins to manage all users.

-- 1. DROP EXISTING STRICT POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 2. CREATE NEW DIVINE POLICIES
-- Anyone can view their own profile, BUT Admins can view ALL profiles.
CREATE POLICY "Profiles are viewable by owners and admins" 
ON profiles FOR SELECT 
USING (
  auth.uid() = id OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Anyone can update their own profile, BUT Admins can update ALL profiles.
CREATE POLICY "Profiles are updatable by owners and admins" 
ON profiles FOR UPDATE 
USING (
  auth.uid() = id OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
