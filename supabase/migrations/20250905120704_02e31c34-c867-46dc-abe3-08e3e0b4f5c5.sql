-- Security Fix: Restrict Uploads Table Access to Prevent Data Exposure

-- Add policy for authenticated users to view only their own uploads
CREATE POLICY "Users can view their own uploads" ON public.uploads
  FOR SELECT
  TO authenticated
  USING (user_email = (auth.jwt() ->> 'email'));

-- Explicitly block anonymous access to uploads table
CREATE POLICY "Block anonymous access to uploads" ON public.uploads
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- Log this security fix
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'restricted_uploads_table_access',
  'table', 'uploads',
  'vulnerability_type', 'unauthorized_file_information_access',
  'fix_description', 'Added user-specific access control and blocked anonymous access'
));