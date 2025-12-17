-- Add column to control if CTA link opens in new tab
ALTER TABLE public.banner_slides 
ADD COLUMN cta_nova_aba boolean DEFAULT true;