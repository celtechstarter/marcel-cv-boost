-- Fix additional critical security vulnerabilities (corrected syntax)

-- 1. SECURE HELP_REQUESTS TABLE
-- Fix: Restrict to service role only (admin access via Edge Functions)
DROP POLICY IF EXISTS "Service role can manage help_requests" ON help_requests;

CREATE POLICY "Service role only access for help_requests" ON help_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- 2. SECURE REVIEW_VERIFICATIONS TABLE  
-- Fix: Restrict to service role only
DROP POLICY IF EXISTS "review_verifications_insert_public" ON review_verifications;
DROP POLICY IF EXISTS "review_verifications_service_select" ON review_verifications; 
DROP POLICY IF EXISTS "review_verifications_service_delete" ON review_verifications;

CREATE POLICY "Service role manages verification codes" ON review_verifications
  FOR ALL
  TO service_role  
  USING (true)
  WITH CHECK (true);


-- 3. SECURE REVIEWS TABLE
-- Add missing UPDATE/DELETE restrictions (drop first if they exist)
DROP POLICY IF EXISTS "Service role can update reviews" ON reviews;
DROP POLICY IF EXISTS "Service role can delete reviews" ON reviews;

CREATE POLICY "Service role can update reviews" ON reviews
  FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete reviews" ON reviews  
  FOR DELETE
  TO service_role
  USING (true);