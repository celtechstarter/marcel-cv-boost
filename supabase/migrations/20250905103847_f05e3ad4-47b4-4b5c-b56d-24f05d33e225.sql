-- Create RPC function to apply free slot usage
CREATE OR REPLACE FUNCTION public.apply_free_slot(p_year integer, p_month integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert or update monthly slots record
  INSERT INTO monthly_free_slots (year, month, max_slots, used_slots)
  VALUES (p_year, p_month, 5, 1)
  ON CONFLICT (year, month) 
  DO UPDATE SET used_slots = monthly_free_slots.used_slots + 1
  WHERE monthly_free_slots.used_slots < monthly_free_slots.max_slots;
  
  -- Check if update was successful (no rows updated means we're at max)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No free slots available for % %', p_month, p_year;
  END IF;
END $$;

-- Create RPC function to reset monthly slots
CREATE OR REPLACE FUNCTION public.reset_month_slots()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  INSERT INTO monthly_free_slots (year, month, max_slots, used_slots)
  VALUES (EXTRACT(YEAR FROM now())::integer, EXTRACT(MONTH FROM now())::integer, 5, 0)
  ON CONFLICT (year, month) 
  DO UPDATE SET used_slots = 0;
$$;

-- Create constraint to ensure used_slots never exceeds max_slots
ALTER TABLE monthly_free_slots 
ADD CONSTRAINT check_slots_limit 
CHECK (used_slots <= max_slots);