-- Security Fix: Protect Customer Reviews and Contact Data (Safe Approach)

-- Create additional security policies if they don't exist
DO $$
BEGIN
    -- Block anonymous UPDATE access if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Block anonymous review updates'
    ) THEN
        CREATE POLICY "Block anonymous review updates" ON public.reviews
          FOR UPDATE
          TO anon
          USING (false);
    END IF;
    
    -- Block anonymous DELETE access if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' 
        AND policyname = 'Block anonymous review deletes'
    ) THEN
        CREATE POLICY "Block anonymous review deletes" ON public.reviews
          FOR DELETE
          TO anon
          USING (false);
    END IF;
    
    -- Users can view their own reviews if not exists
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
  'action', 'protected_customer_review_data_enhanced',
  'table', 'reviews',
  'vulnerability_type', 'customer_contact_data_exposure',
  'fix_description', 'Created secure public view excluding emails, added user-specific access controls',
  'data_protected', ARRAY['customer_emails', 'customer_names', 'unpublished_reviews'],
  'secure_view_created', 'public_reviews_safe'
));