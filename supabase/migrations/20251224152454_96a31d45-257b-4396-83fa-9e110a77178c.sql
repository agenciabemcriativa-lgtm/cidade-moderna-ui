-- Tabela para categorias de receitas
CREATE TABLE public.receitas_categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.receitas_categorias ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer um pode ver categorias ativas)
CREATE POLICY "Categorias de receitas são públicas"
ON public.receitas_categorias
FOR SELECT
USING (ativo = true);

-- Política para admins gerenciarem (todas as operações)
CREATE POLICY "Admins podem gerenciar categorias de receitas"
ON public.receitas_categorias
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_receitas_categorias_updated_at
BEFORE UPDATE ON public.receitas_categorias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.receitas_categorias (titulo, url, ordem) VALUES
('Arrecadação Orçamentária Geral', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', 1),
('Receitas Extras', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', 2),
('Arrecadação Orçamentária – Transferência do Estado', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', 3),
('Arrecadação Extra-orçamentária', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', 4),
('Dívida Ativa', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', 5);