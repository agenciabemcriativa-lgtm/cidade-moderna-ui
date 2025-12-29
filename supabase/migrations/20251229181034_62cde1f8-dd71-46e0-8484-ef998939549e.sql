-- Create enum for document types
CREATE TYPE public.tipo_documento_pessoal AS ENUM (
  'estagiarios',
  'remuneracao_cargo',
  'servidores',
  'lista_nominal_cargo'
);

-- Create table for personnel documents
CREATE TABLE public.documentos_pessoal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo public.tipo_documento_pessoal NOT NULL,
  titulo TEXT NOT NULL,
  mes_referencia INTEGER NOT NULL CHECK (mes_referencia >= 1 AND mes_referencia <= 12),
  ano_referencia INTEGER NOT NULL CHECK (ano_referencia >= 2000 AND ano_referencia <= 2100),
  arquivo_nome TEXT NOT NULL,
  arquivo_url TEXT NOT NULL,
  descricao TEXT,
  observacoes TEXT,
  data_postagem DATE NOT NULL DEFAULT CURRENT_DATE,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documentos_pessoal ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published documents" 
ON public.documentos_pessoal 
FOR SELECT 
USING (publicado = true);

CREATE POLICY "Admins can do everything" 
ON public.documentos_pessoal 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'editor')
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_documentos_pessoal_updated_at
BEFORE UPDATE ON public.documentos_pessoal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();