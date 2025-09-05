-- CRITICAL SECURITY FIX: Restrict access to bookings table personal data
-- Current issue: bookings table allows unrestricted public access to customer emails, names, Discord usernames

-- Drop the overly permissive service role policy
DROP POLICY IF EXISTS "bookings_select_service" ON bookings;

-- Create secure policies that protect customer personal data

-- 1. Allow service role to SELECT for admin functions (Edge Functions)
CREATE POLICY "Service role can view all bookings" ON bookings
  FOR SELECT
  TO service_role
  USING (true);

-- 2. Allow authenticated users to view ONLY their own bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- 3. Keep existing insert policy for public booking creation
-- (bookings_insert_public already exists and is appropriate)

-- 4. Allow service role to UPDATE/DELETE for admin management
CREATE POLICY "Service role can manage bookings" ON bookings
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete bookings" ON bookings
  FOR DELETE  
  TO service_role
  USING (true);