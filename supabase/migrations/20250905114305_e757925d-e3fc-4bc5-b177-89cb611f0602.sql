-- Fix RLS policies for help_requests table
-- Since help_requests are accessed only via service role in Edge Functions,
-- we need to add policies or disable RLS. We'll add restrictive policies for security.

-- Policy to allow service role to manage help_requests (used by Edge Functions)
CREATE POLICY "Service role can manage help_requests" ON help_requests
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- No public access - help_requests should only be accessed via admin functions