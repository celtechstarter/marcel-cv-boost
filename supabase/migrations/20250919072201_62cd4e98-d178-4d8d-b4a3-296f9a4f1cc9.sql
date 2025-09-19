-- Remove all review, booking, and admin related database objects

-- Drop functions first (to avoid dependency issues)
DROP FUNCTION IF EXISTS public.public_create_review(text, text, integer, text, text);
DROP FUNCTION IF EXISTS public.admin_publish_review(uuid);
DROP FUNCTION IF EXISTS public.public_verify_review(uuid, text);
DROP FUNCTION IF EXISTS public.public_get_review_stats();
DROP FUNCTION IF EXISTS public.get_published_reviews_safe(integer, integer);
DROP FUNCTION IF EXISTS public.public_get_published_reviews(integer, integer, integer);
DROP FUNCTION IF EXISTS public.public_create_booking(text, text, text, text, timestamp with time zone, integer);
DROP FUNCTION IF EXISTS public.admin_approve_booking(uuid);
DROP FUNCTION IF EXISTS public.admin_reject_booking(uuid);
DROP FUNCTION IF EXISTS public.public_bookings_next7();
DROP FUNCTION IF EXISTS public.public_export_bookings_csv(timestamp with time zone, timestamp with time zone);
DROP FUNCTION IF EXISTS public.slots_remaining(integer, integer);
DROP FUNCTION IF EXISTS public.slots_remaining_safe(integer, integer);
DROP FUNCTION IF EXISTS public.apply_free_slot(integer, integer);
DROP FUNCTION IF EXISTS public.reset_month_slots();
DROP FUNCTION IF EXISTS public.public_get_slot_state(integer, integer);

-- Drop views
DROP VIEW IF EXISTS public.public_reviews;

-- Drop tables (in correct order to handle dependencies)
DROP TABLE IF EXISTS public.review_verifications;
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.monthly_free_slots;

-- Drop custom types
DROP TYPE IF EXISTS public.review_status;
DROP TYPE IF EXISTS public.booking_status;

-- Clean up audit log entries related to these features
DELETE FROM public.audit_log 
WHERE event_type IN ('review_created', 'review_verified', 'review_published', 'booking_created', 'booking_approved', 'booking_rejected', 'slots_reset');

-- Note: help_requests table and uploads table are kept as they are still needed for CV uploads