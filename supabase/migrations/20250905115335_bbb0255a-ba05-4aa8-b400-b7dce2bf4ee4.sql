-- GDPR & Security Hardening: Database Schema Updates

-- 1. Create private CV uploads bucket and secure storage policies
INSERT INTO storage.buckets (id, name, public, avif_autodetection, allowed_mime_types, file_size_limit)
VALUES ('cv_uploads', 'cv_uploads', false, false, ARRAY['application/pdf'], 10485760) -- 10MB limit
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create strict storage policies for CV uploads
-- Drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Users can upload their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage all files" ON storage.objects;

-- Only service role can manage CV files (via Edge Functions with signed URLs)
CREATE POLICY "Service role manages CV uploads" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'cv_uploads')
  WITH CHECK (bucket_id = 'cv_uploads');

-- No direct public or authenticated access to CV files
-- Files accessed only via short-lived signed URLs

-- 4. Create uploads metadata table for tracking and GDPR compliance
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  size_bytes BIGINT NOT NULL,
  sha256_hash TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delete_after TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days'), -- GDPR retention
  deleted_at TIMESTAMPTZ NULL,
  created_by_ip TEXT NULL
);

-- Enable RLS on uploads table
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Only service role can manage uploads (Edge Functions only)
CREATE POLICY "Service role manages uploads" ON uploads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Create audit log table for compliance tracking
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'file_upload', 'file_delete', 'review_publish', 'admin_login', 'slot_reset'
  actor_email TEXT NULL,
  actor_role TEXT NULL, -- 'anonymous', 'authenticated', 'service_role', 'admin'
  actor_ip TEXT NULL,
  resource_id TEXT NULL, -- ID of affected resource
  details JSONB NULL, -- Additional event details
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role can write to audit log
CREATE POLICY "Service role writes audit log" ON audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can read all audit logs (for admin UI)
CREATE POLICY "Service role reads audit log" ON audit_log
  FOR SELECT
  TO service_role
  USING (true);

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_uploads_user_email ON uploads(user_email);
CREATE INDEX IF NOT EXISTS idx_uploads_delete_after ON uploads(delete_after) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);

-- 7. Create function for secure file cleanup (used by cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_uploads()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cleanup_count INTEGER := 0;
  upload_record RECORD;
BEGIN
  -- Find expired uploads that haven't been deleted yet
  FOR upload_record IN 
    SELECT id, storage_path 
    FROM uploads 
    WHERE delete_after < now() 
    AND deleted_at IS NULL
  LOOP
    -- Delete from storage bucket
    PERFORM storage.delete_object('cv_uploads', upload_record.storage_path);
    
    -- Mark as deleted in metadata
    UPDATE uploads 
    SET deleted_at = now() 
    WHERE id = upload_record.id;
    
    cleanup_count := cleanup_count + 1;
  END LOOP;
  
  -- Log cleanup action
  INSERT INTO audit_log (event_type, actor_role, details)
  VALUES ('file_cleanup', 'system', jsonb_build_object('files_deleted', cleanup_count));
  
  RETURN cleanup_count;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION cleanup_expired_uploads() TO service_role;