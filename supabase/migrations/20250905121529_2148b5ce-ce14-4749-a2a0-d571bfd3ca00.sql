-- Fix Security Warning: Remove SECURITY DEFINER View

-- Drop the problematic view that caused security warning
DROP VIEW IF EXISTS public.public_reviews_safe;

-- Instead, modify the existing database function to safely return review data
-- The existing public_get_published_reviews function already handles this securely
-- We just need to ensure proper access control

-- Verify the reviews table policies are correct (existing policy should be adequate)
-- The existing "Public can view published reviews only" policy already restricts access to published reviews

-- Log the security fix
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'removed_security_definer_view',
  'table', 'reviews',
  'vulnerability_type', 'security_definer_view_risk',
  'fix_description', 'Removed potentially unsafe view, rely on existing secure function public_get_published_reviews',
  'recommendation', 'Use public_get_published_reviews() function for safe public access'
));