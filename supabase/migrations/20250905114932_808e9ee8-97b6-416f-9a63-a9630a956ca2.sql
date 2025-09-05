-- Fix additional critical security vulnerabilities

-- 1. SECURE HELP_REQUESTS TABLE
-- Current issue: Accessible to service roles without user restrictions
-- Fix: Restrict to service role only (admin access via Edge Functions)
DROP POLICY IF EXISTS "Service role can manage help_requests" ON help_requests;

CREATE POLICY "Service role only access for help_requests" ON help_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- No public or authenticated user access - help requests are admin-only


-- 2. SECURE REVIEW_VERIFICATIONS TABLE  
-- Current issue: Public INSERT and unrestricted access to verification codes
-- Fix: Restrict to service role only

-- Check existing policies and drop problematic ones
DROP POLICY IF EXISTS "review_verifications_insert_public" ON review_verifications;
DROP POLICY IF EXISTS "review_verifications_service_select" ON review_verifications; 
DROP POLICY IF EXISTS "review_verifications_service_delete" ON review_verifications;

-- Create secure service-role-only policies
CREATE POLICY "Service role manages verification codes" ON review_verifications
  FOR ALL
  TO service_role  
  USING (true)
  WITH CHECK (true);


-- 3. SECURE REVIEWS TABLE
-- Current issue: Only SELECT restricted, other operations could expose unpublished data
-- Fix: Add comprehensive policies for all operations

-- Allow public to SELECT only published reviews (already exists via reviews_select_published)
-- Allow public to INSERT new reviews (already exists via reviews_insert_public)

-- Add missing UPDATE/DELETE restrictions
CREATE POLICY IF NOT EXISTS "Service role can update reviews" ON reviews
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY IF NOT EXISTS "Service role can delete reviews" ON reviews  
  FOR DELETE
  TO service_role
  USING (true);