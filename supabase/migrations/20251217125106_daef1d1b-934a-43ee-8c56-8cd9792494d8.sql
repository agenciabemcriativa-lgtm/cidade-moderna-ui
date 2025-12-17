-- Add background image fields to banner_slides table
ALTER TABLE public.banner_slides
ADD COLUMN IF NOT EXISTS bg_image_url TEXT,
ADD COLUMN IF NOT EXISTS bg_image_opacity DECIMAL(3,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS bg_image_position TEXT DEFAULT 'center';