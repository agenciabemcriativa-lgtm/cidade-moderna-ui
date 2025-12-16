-- Create table for O Governo menu items
CREATE TABLE public.governo_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Município menu items
CREATE TABLE public.municipio_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.governo_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipio_itens ENABLE ROW LEVEL SECURITY;

-- RLS policies for governo_itens
CREATE POLICY "Public can view active governo_itens" ON public.governo_itens
FOR SELECT USING (ativo = true);

CREATE POLICY "Admins can view all governo_itens" ON public.governo_itens
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert governo_itens" ON public.governo_itens
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update governo_itens" ON public.governo_itens
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete governo_itens" ON public.governo_itens
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS policies for municipio_itens
CREATE POLICY "Public can view active municipio_itens" ON public.municipio_itens
FOR SELECT USING (ativo = true);

CREATE POLICY "Admins can view all municipio_itens" ON public.municipio_itens
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert municipio_itens" ON public.municipio_itens
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update municipio_itens" ON public.municipio_itens
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete municipio_itens" ON public.municipio_itens
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Insert default data for O Governo
INSERT INTO public.governo_itens (titulo, slug, ordem) VALUES
('Prefeito', 'prefeito', 1),
('Vice-Prefeito', 'vice-prefeito', 2),
('Estrutura Organizacional', 'estrutura-organizacional', 3),
('Organograma', 'organograma', 4);

-- Insert default data for Município
INSERT INTO public.municipio_itens (titulo, slug, ordem) VALUES
('Cultura', 'cultura', 1),
('História', 'historia', 2),
('Símbolos Oficiais', 'simbolos-oficiais', 3),
('Dados Demográficos', 'dados-demograficos', 4);