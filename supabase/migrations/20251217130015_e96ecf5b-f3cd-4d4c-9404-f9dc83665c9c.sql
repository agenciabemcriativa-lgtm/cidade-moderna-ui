-- Add bg_color column for hexadecimal background color
ALTER TABLE public.banner_slides 
ADD COLUMN bg_color TEXT DEFAULT NULL;