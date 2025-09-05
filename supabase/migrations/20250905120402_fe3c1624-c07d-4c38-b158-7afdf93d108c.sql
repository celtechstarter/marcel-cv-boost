-- Critical Security Fixes: Remove Data Exposure Vulnerabilities (Fixed)

-- 1. Fix Profile Table Security
-- Drop the overly permissive policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create secure policy only if it doesn't exist: users can only view their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles
          FOR SELECT 
          USING (auth.uid() = id);
    END IF;
END$$;

-- Add service role policy for admin access when needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Service role can view all profiles'
    ) THEN
        CREATE POLICY "Service role can view all profiles" ON public.profiles
          FOR SELECT
          TO service_role
          USING (true);
    END IF;
END$$;

-- 2. Fix Booking System Security
-- Drop the public insert policy that allows unauthenticated bookings
DROP POLICY IF EXISTS "bookings_insert_public" ON public.bookings;

-- Block all anonymous inserts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Block anonymous booking creation'
    ) THEN
        CREATE POLICY "Block anonymous booking creation" ON public.bookings
          FOR INSERT
          TO anon
          WITH CHECK (false);
    END IF;
END$$;

-- Add authenticated user policy for creating bookings via service role (Edge Functions)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Service role can create bookings'
    ) THEN
        CREATE POLICY "Service role can create bookings" ON public.bookings
          FOR INSERT
          TO service_role
          WITH CHECK (true);
    END IF;
END$$;

-- 3. Add audit logging for security events
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'fixed_critical_vulnerabilities',
  'tables_affected', ARRAY['profiles', 'bookings'],
  'vulnerability_type', 'data_exposure_prevention'
));