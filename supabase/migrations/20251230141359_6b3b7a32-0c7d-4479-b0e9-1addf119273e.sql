-- Create table for cardápios escolares organized by month
CREATE TABLE public.cardapios_escolares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  mes_referencia INTEGER NOT NULL CHECK (mes_referencia >= 1 AND mes_referencia <= 12),
  ano_referencia INTEGER NOT NULL,
  arquivo_nome TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cardapios_escolares ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view published cardapios" 
ON public.cardapios_escolares 
FOR SELECT 
USING (publicado = true);

CREATE POLICY "Admins can view all cardapios" 
ON public.cardapios_escolares 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert cardapios" 
ON public.cardapios_escolares 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update cardapios" 
ON public.cardapios_escolares 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete cardapios" 
ON public.cardapios_escolares 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_cardapios_escolares_ano_mes ON public.cardapios_escolares(ano_referencia DESC, mes_referencia DESC);