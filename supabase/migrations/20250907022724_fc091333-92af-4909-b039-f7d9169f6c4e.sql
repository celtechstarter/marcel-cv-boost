-- Fix critical security vulnerabilities

-- 1. Fix help_requests table - add explicit SELECT restriction
DROP POLICY IF EXISTS "Admin service role can manage help_requests" ON public.help_requests;

-- Create separate policies for better granular control
CREATE POLICY "Block public SELECT on help_requests" 
ON public.help_requests 
FOR SELECT 
USING (false);

CREATE POLICY "Service role can SELECT help_requests" 
ON public.help_requests 
FOR SELECT 
TO service_role
USING (true);

CREATE POLICY "Service role can INSERT help_requests" 
ON public.help_requests 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can UPDATE help_requests" 
ON public.help_requests 
FOR UPDATE 
TO service_role
USING (true);

CREATE POLICY "Service role can DELETE help_requests" 
ON public.help_requests 
FOR DELETE 
TO service_role
USING (true);

-- 2. Fix review_verifications table - add explicit SELECT restriction
DROP POLICY IF EXISTS "Service role manages verification codes" ON public.review_verifications;

-- Create separate policies for verification codes
CREATE POLICY "Block public SELECT on verification codes" 
ON public.review_verifications 
FOR SELECT 
USING (false);

CREATE POLICY "Service role can SELECT verification codes" 
ON public.review_verifications 
FOR SELECT 
TO service_role
USING (true);

CREATE POLICY "Service role can INSERT verification codes" 
ON public.review_verifications 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can UPDATE verification codes" 
ON public.review_verifications 
FOR UPDATE 
TO service_role
USING (true);

CREATE POLICY "Service role can DELETE verification codes" 
ON public.review_verifications 
FOR DELETE 
TO service_role
USING (true);

-- 3. Remove the problematic SECURITY DEFINER view
DROP VIEW IF EXISTS public.public_reviews_safe;

-- Create a safe function instead to get published reviews
CREATE OR REPLACE FUNCTION public.get_published_reviews_safe(p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(
  id uuid,
  rating integer,
  title text,
  body text,
  published_at timestamp with time zone,
  display_name text
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

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_published_reviews_safe TO anon, authenticated;