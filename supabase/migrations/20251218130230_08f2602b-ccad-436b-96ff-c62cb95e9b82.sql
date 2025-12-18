-- Create enum for report types
CREATE TYPE tipo_relatorio_fiscal AS ENUM (
  'rreo',
  'rgf',
  'parecer_tce',
  'prestacao_contas'
);

-- Create table for fiscal reports
CREATE TABLE public.relatorios_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo tipo_relatorio_fiscal NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ano INTEGER NOT NULL,
  bimestre INTEGER, -- For RREO (1-6)
  quadrimestre INTEGER, -- For RGF (1-3)
  exercicio TEXT, -- For prestação de contas
  data_publicacao DATE NOT NULL DEFAULT CURRENT_DATE,
  arquivo_url TEXT NOT NULL,
  arquivo_nome TEXT NOT NULL,
  observacoes TEXT,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.relatorios_fiscais ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view published relatorios_fiscais"
ON public.relatorios_fiscais
FOR SELECT
USING (publicado = true);

CREATE POLICY "Admins can view all relatorios_fiscais"
ON public.relatorios_fiscais
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert relatorios_fiscais"
ON public.relatorios_fiscais
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update relatorios_fiscais"
ON public.relatorios_fiscais
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete relatorios_fiscais"
ON public.relatorios_fiscais
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_relatorios_fiscais_updated_at
BEFORE UPDATE ON public.relatorios_fiscais
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for common queries
CREATE INDEX idx_relatorios_fiscais_tipo_ano ON public.relatorios_fiscais(tipo, ano DESC);
CREATE INDEX idx_relatorios_fiscais_publicado ON public.relatorios_fiscais(publicado);