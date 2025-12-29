-- Criar tabela para folha de pagamento
CREATE TABLE public.folha_pagamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_servidor TEXT NOT NULL,
  matricula TEXT,
  cargo TEXT NOT NULL,
  secretaria TEXT,
  vinculo TEXT DEFAULT 'efetivo',
  carga_horaria INTEGER DEFAULT 40,
  salario_base NUMERIC NOT NULL,
  gratificacoes NUMERIC DEFAULT 0,
  adicionais NUMERIC DEFAULT 0,
  outros_proventos NUMERIC DEFAULT 0,
  total_bruto NUMERIC,
  inss NUMERIC DEFAULT 0,
  irrf NUMERIC DEFAULT 0,
  outros_descontos NUMERIC DEFAULT 0,
  total_descontos NUMERIC,
  salario_liquido NUMERIC,
  mes_referencia INTEGER NOT NULL,
  ano_referencia INTEGER NOT NULL,
  observacoes TEXT,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.folha_pagamento ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage folha_pagamento" 
ON public.folha_pagamento 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view published folha_pagamento" 
ON public.folha_pagamento 
FOR SELECT 
USING (publicado = true);

-- Atualizar o item de transparência para apontar para página interna
UPDATE transparencia_itens 
SET url = '/transparencia/folha-pagamento',
    externo = false
WHERE id = '7ce683c1-1fff-4e94-9e15-dc610f6d1e84';