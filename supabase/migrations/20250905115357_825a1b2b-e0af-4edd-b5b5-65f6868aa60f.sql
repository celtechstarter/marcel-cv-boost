-- GDPR & Security Hardening: Database Schema Updates (Fixed)

-- 1. Create uploads metadata table for tracking and GDPR compliance
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

-- 2. Create audit log table for compliance tracking
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

-- 3. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_uploads_user_email ON uploads(user_email);
CREATE INDEX IF NOT EXISTS idx_uploads_delete_after ON uploads(delete_after) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON audit_log(event_type);

-- 4. Create function for secure file cleanup (used by cron job)
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

-- 5. Helper function for audit logging
CREATE OR REPLACE FUNCTION log_audit_event(
  p_event_type TEXT,
  p_actor_email TEXT DEFAULT NULL,
  p_actor_role TEXT DEFAULT NULL,
  p_actor_ip TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO audit_log (event_type, actor_email, actor_role, actor_ip, resource_id, details)
  VALUES (p_event_type, p_actor_email, p_actor_role, p_actor_ip, p_resource_id, p_details)
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

GRANT EXECUTE ON FUNCTION log_audit_event(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO service_role;