-- Add duration fields for banner slides
ALTER TABLE public.banner_slides 
ADD COLUMN display_duration INTEGER DEFAULT 6,
ADD COLUMN transition_duration INTEGER DEFAULT 700;