-- Fix security linter issues

-- Fix 1: Remove SECURITY DEFINER from view and make it a regular view
DROP VIEW IF EXISTS public.public_reviews_safe;

-- Create regular view without SECURITY DEFINER
CREATE VIEW public.public_reviews_safe AS
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

-- Fix 2 & 3: Add SET search_path to functions
CREATE OR REPLACE FUNCTION log_help_request_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION log_upload_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;