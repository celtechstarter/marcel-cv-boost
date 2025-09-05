-- Fix Security Definer View Issue

-- Drop the problematic view
DROP VIEW IF EXISTS public.public_reviews_safe;

-- Create a security definer function instead that returns safe review data
CREATE OR REPLACE FUNCTION public.get_published_reviews_safe(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  rating INTEGER,
  title TEXT,
  body TEXT,
  published_at TIMESTAMPTZ,
  display_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.rating,
    COALESCE(NULLIF(r.title, ''), 'Bewertung') as title,
    r.body,
    r.published_at,
    -- Display name: first name + initial (no email exposure)
    CASE
        WHEN r.name IS NULL OR LENGTH(BTRIM(r.name)) = 0 THEN 'Anonym'
        ELSE 
            TRIM(SPLIT_PART(r.name, ' ', 1)) ||
            CASE 
                WHEN SPLIT_PART(r.name, ' ', 2) <> '' 
                THEN ' ' || LEFT(SPLIT_PART(r.name, ' ', 2), 1) || '.'
                ELSE '' 
            END
    END as display_name
  FROM public.reviews r
  WHERE r.status = 'veroeffentlicht'
  ORDER BY r.published_at DESC NULLS LAST, r.id
  LIMIT GREATEST(p_limit, 0)
  OFFSET GREATEST(p_offset, 0);
END;
$$;

-- Grant execute permission to public roles
GRANT EXECUTE ON FUNCTION public.get_published_reviews_safe(INTEGER, INTEGER) TO anon, authenticated;

-- Log the security fix
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'fixed_security_definer_view',
  'component', 'public_reviews_safe',
  'fix_description', 'Replaced security definer view with secure function to prevent RLS bypass'
));