-- Critical Security Fixes: Remove Data Exposure Vulnerabilities

-- 1. Fix Profile Table Security
-- Drop the overly permissive policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Add secure policy: users can only view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Add service role policy for admin access when needed
CREATE POLICY "Service role can view all profiles" ON public.profiles
  FOR SELECT
  TO service_role
  USING (true);

-- 2. Fix Booking System Security
-- Drop the public insert policy that allows unauthenticated bookings
DROP POLICY IF EXISTS "bookings_insert_public" ON public.bookings;

-- Add authenticated user policy for creating bookings
CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    email = (auth.jwt() ->> 'email')
  );

-- Ensure only authenticated users can create bookings by email match
CREATE POLICY "Users can insert bookings with their email" ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (false); -- Block all anonymous inserts

-- 3. Add audit logging for security events
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'fixed_critical_vulnerabilities',
  'tables_affected', ARRAY['profiles', 'bookings'],
  'vulnerability_type', 'data_exposure_prevention'
));