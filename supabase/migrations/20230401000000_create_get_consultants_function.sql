
-- Create RPC function to get consultants
CREATE OR REPLACE FUNCTION public.get_consultants()
RETURNS SETOF public.consultants
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.consultants;
$$;
