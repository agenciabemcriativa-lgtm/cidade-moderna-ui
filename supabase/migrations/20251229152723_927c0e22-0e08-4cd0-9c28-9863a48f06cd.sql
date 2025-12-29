
-- Drop existing table and recreate with document-based structure
DROP TABLE IF EXISTS public.folha_pagamento;

-- Create new table for monthly payroll documents
CREATE TABLE public.folha_pagamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  mes_referencia INTEGER NOT NULL CHECK (mes_referencia >= 1 AND mes_referencia <= 12),
  ano_referencia INTEGER NOT NULL CHECK (ano_referencia >= 2000 AND ano_referencia <= 2100),
  arquivo_url TEXT NOT NULL,
  arquivo_nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  observacoes TEXT,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(mes_referencia, ano_referencia)
);

-- Enable RLS
ALTER TABLE public.folha_pagamento ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Folha pagamento visible to everyone"
  ON public.folha_pagamento
  FOR SELECT
  USING (publicado = true);

-- Admin full access
CREATE POLICY "Admins can manage folha pagamento"
  ON public.folha_pagamento
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Update trigger
CREATE TRIGGER update_folha_pagamento_updated_at
  BEFORE UPDATE ON public.folha_pagamento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
