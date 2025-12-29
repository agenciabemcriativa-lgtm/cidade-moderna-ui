-- Criar tabela para documentos de Emendas Parlamentares
CREATE TABLE public.emendas_parlamentares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  arquivo_nome TEXT NOT NULL,
  data_referencia DATE NOT NULL,
  data_postagem DATE NOT NULL DEFAULT CURRENT_DATE,
  ano_referencia INTEGER NOT NULL,
  observacoes TEXT,
  publicado BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.emendas_parlamentares ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Public can view published emendas" 
ON public.emendas_parlamentares 
FOR SELECT 
USING (publicado = true);

CREATE POLICY "Admins can view all emendas" 
ON public.emendas_parlamentares 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert emendas" 
ON public.emendas_parlamentares 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update emendas" 
ON public.emendas_parlamentares 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete emendas" 
ON public.emendas_parlamentares 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_emendas_parlamentares_updated_at
BEFORE UPDATE ON public.emendas_parlamentares
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();