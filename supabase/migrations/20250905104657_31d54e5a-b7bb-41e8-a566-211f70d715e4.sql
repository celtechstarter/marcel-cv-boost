-- Create a safer version of slots_remaining that doesn't fail
CREATE OR REPLACE FUNCTION public.slots_remaining_safe(p_year integer, p_month integer)
RETURNS integer
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE((max_slots - used_slots), 5)
  FROM monthly_free_slots
  WHERE year = p_year AND month = p_month
  UNION ALL
  SELECT 5 -- Default to 5 free slots if no record exists
  WHERE NOT EXISTS (
    SELECT 1 FROM monthly_free_slots 
    WHERE year = p_year AND month = p_month
  )
  LIMIT 1;
$$;