-- Fix Customer Personal Information Exposure in Reviews
-- Create a view that masks sensitive data for public access
CREATE OR REPLACE VIEW public.public_reviews_safe AS
SELECT 
  id,
  rating,
  COALESCE(NULLIF(title, ''), 'Bewertung') as title,
  body,
  published_at,
  -- Display name: first name + initial (no email exposure)
  CASE
      WHEN name IS NULL OR LENGTH(BTRIM(name)) = 0 THEN 'Anonym'
      ELSE 
          TRIM(SPLIT_PART(name, ' ', 1)) ||
          CASE 
              WHEN SPLIT_PART(name, ' ', 2) <> '' 
              THEN ' ' || LEFT(SPLIT_PART(name, ' ', 2), 1) || '.'
              ELSE '' 
          END
  END as display_name
FROM reviews
WHERE status = 'veroeffentlicht';

-- Remove public access to full reviews table for anonymous users
DROP POLICY IF EXISTS "Public can view published reviews only" ON public.reviews;

-- Create restrictive policy for reviews - only authenticated users can see their own
CREATE POLICY "Users can view their own reviews only" 
ON public.reviews 
FOR SELECT 
USING (email = (auth.jwt() ->> 'email'::text));

-- Service role maintains full access for admin functions
-- (existing "Service role can update reviews" and other service policies remain)

-- Enable RLS on the safe view (views inherit from base table but we ensure it's explicit)
-- Views automatically inherit RLS from base tables, but the view itself is safe

-- Add more granular help_requests policy
DROP POLICY IF EXISTS "Service role only access for help_requests" ON public.help_requests;

-- Create specific admin-only policy for help_requests
CREATE POLICY "Admin service role can manage help_requests" 
ON public.help_requests 
FOR ALL 
USING (
  -- Only allow access if using service role key (not anon key)
  auth.role() = 'service_role'
);

-- Add audit logging for help_requests access
CREATE OR REPLACE FUNCTION log_help_request_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any access to help_requests for security monitoring
  INSERT INTO audit_log (event_type, actor_role, details)
  VALUES (
    'help_request_access',
    COALESCE(auth.role(), 'unknown'),
    jsonb_build_object(
      'request_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'timestamp', now()
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for help_requests monitoring
DROP TRIGGER IF EXISTS help_request_access_log ON public.help_requests;
CREATE TRIGGER help_request_access_log
  AFTER INSERT OR UPDATE OR DELETE ON public.help_requests
  FOR EACH ROW EXECUTE FUNCTION log_help_request_access();

-- Add more restrictive uploads policy
DROP POLICY IF EXISTS "Users can view their own uploads" ON public.uploads;

-- Create more granular uploads policies
CREATE POLICY "Users can view their own uploads only" 
ON public.uploads 
FOR SELECT 
USING (user_email = (auth.jwt() ->> 'email'::text) AND deleted_at IS NULL);

CREATE POLICY "Service role can manage uploads with logging" 
ON public.uploads 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add upload access logging
CREATE OR REPLACE FUNCTION log_upload_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log service role access to uploads for security monitoring
  IF auth.role() = 'service_role' THEN
    INSERT INTO audit_log (event_type, actor_role, details)
    VALUES (
      'upload_access',
      'service_role',
      jsonb_build_object(
        'upload_id', COALESCE(NEW.id, OLD.id),
        'operation', TG_OP,
        'user_email', COALESCE(NEW.user_email, OLD.user_email),
        'timestamp', now()
      )
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for uploads monitoring
DROP TRIGGER IF EXISTS upload_access_log ON public.uploads;
CREATE TRIGGER upload_access_log
  AFTER INSERT OR UPDATE OR DELETE ON public.uploads
  FOR EACH ROW EXECUTE FUNCTION log_upload_access();