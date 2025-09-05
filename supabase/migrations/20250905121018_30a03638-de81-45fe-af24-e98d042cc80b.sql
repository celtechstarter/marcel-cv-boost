-- Security Fix: Prevent Public Access to Customer Booking Data

-- Explicitly block anonymous read access to bookings table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Block anonymous read access to bookings'
    ) THEN
        CREATE POLICY "Block anonymous read access to bookings" ON public.bookings
          FOR SELECT
          TO anon
          USING (false);
    END IF;
END$$;

-- Ensure authenticated users can only view bookings with their email
-- (This policy should already exist, but let's make sure it's secure)
DO $$
BEGIN
    -- Drop and recreate the user access policy to ensure it's secure
    DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
    
    CREATE POLICY "Users can view their own bookings" ON public.bookings
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() IS NOT NULL AND 
        email = (auth.jwt() ->> 'email')
      );
END$$;

-- Log this critical security fix
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'prevented_customer_data_theft',
  'table', 'bookings',
  'vulnerability_type', 'unauthorized_customer_data_access',
  'fix_description', 'Blocked anonymous read access and secured user-specific access',
  'data_protected', ARRAY['emails', 'names', 'discord_usernames', 'booking_details']
));