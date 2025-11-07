-- Add explicit policy to block all public access to audit_log
-- This ensures no anonymous or authenticated users can read audit logs
CREATE POLICY "Block all public access to audit_log"
ON public.audit_log
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);