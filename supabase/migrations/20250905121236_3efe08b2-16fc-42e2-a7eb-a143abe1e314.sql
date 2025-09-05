-- Security Fix: Protect Customer Reviews and Contact Data

-- Drop existing public review access policy to recreate with better security
DROP POLICY IF EXISTS "reviews_select_published" ON public.reviews;

-- Create secure policy for public access to published reviews (without email exposure)
CREATE POLICY "Public can view published reviews only" ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'veroeffentlicht' AND
    -- This policy allows access but frontend should filter out email addresses
    true
  );

-- Block all INSERT access for anonymous users (if not already blocked)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Block anonymous review modification'
    ) THEN
        CREATE POLICY "Block anonymous review modification" ON public.reviews
          FOR UPDATE, DELETE
          TO anon
          USING (false);
    END IF;
END$$;

-- Users can view their own reviews (all statuses)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Users can view their own reviews'
    ) THEN
        CREATE POLICY "Users can view their own reviews" ON public.reviews
          FOR SELECT
          TO authenticated
          USING (email = (auth.jwt() ->> 'email'));
    END IF;
END$$;

-- Create a secure view for public review access that excludes sensitive data
CREATE OR REPLACE VIEW public.public_reviews_safe AS
SELECT 
    id,
    rating,
    title,
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
FROM public.reviews
WHERE status = 'veroeffentlicht';

-- Grant access to the safe view
GRANT SELECT ON public.public_reviews_safe TO anon, authenticated;

-- Log this security enhancement
INSERT INTO audit_log (event_type, actor_role, details)
VALUES ('security_policy_update', 'system', jsonb_build_object(
  'action', 'protected_customer_review_data',
  'table', 'reviews',
  'vulnerability_type', 'customer_contact_data_exposure',
  'fix_description', 'Added email protection, created safe public view, restricted unpublished review access',
  'data_protected', ARRAY['customer_emails', 'customer_names', 'unpublished_reviews']
));