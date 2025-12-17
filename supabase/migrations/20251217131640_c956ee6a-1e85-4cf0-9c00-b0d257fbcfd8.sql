-- Add transition_effect column for banner slide transitions
ALTER TABLE public.banner_slides 
ADD COLUMN transition_effect TEXT DEFAULT 'fade';