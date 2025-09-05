-- Fix security definer view issue
-- Drop and recreate the public_reviews view without SECURITY DEFINER

DROP VIEW IF EXISTS public_reviews;

-- Recreate the view with SECURITY INVOKER (default behavior)
CREATE VIEW public_reviews WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  rating,
  title,
  body,
  published_at AS date_published
FROM reviews
WHERE status = 'veroeffentlicht'::review_status;

-- Grant appropriate permissions for the view
GRANT SELECT ON public_reviews TO anon, authenticated;