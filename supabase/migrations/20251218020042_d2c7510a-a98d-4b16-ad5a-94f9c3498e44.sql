-- Create table for transparency portal categories
CREATE TABLE public.transparencia_categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  icone text DEFAULT 'FileText',
  cor text DEFAULT 'bg-blue-50 border-blue-200',
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for transparency portal items/links
CREATE TABLE public.transparencia_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid REFERENCES public.transparencia_categorias(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  url text NOT NULL,
  externo boolean DEFAULT true,
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for transparency quick access links
CREATE TABLE public.transparencia_links_rapidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  url text NOT NULL,
  icone text DEFAULT 'ExternalLink',
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transparencia_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparencia_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparencia_links_rapidos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transparencia_categorias
CREATE POLICY "Public can view active transparencia_categorias"
ON public.transparencia_categorias FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can view all transparencia_categorias"
ON public.transparencia_categorias FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert transparencia_categorias"
ON public.transparencia_categorias FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update transparencia_categorias"
ON public.transparencia_categorias FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete transparencia_categorias"
ON public.transparencia_categorias FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for transparencia_itens
CREATE POLICY "Public can view active transparencia_itens"
ON public.transparencia_itens FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can view all transparencia_itens"
ON public.transparencia_itens FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert transparencia_itens"
ON public.transparencia_itens FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update transparencia_itens"
ON public.transparencia_itens FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete transparencia_itens"
ON public.transparencia_itens FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for transparencia_links_rapidos
CREATE POLICY "Public can view active transparencia_links_rapidos"
ON public.transparencia_links_rapidos FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can view all transparencia_links_rapidos"
ON public.transparencia_links_rapidos FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert transparencia_links_rapidos"
ON public.transparencia_links_rapidos FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update transparencia_links_rapidos"
ON public.transparencia_links_rapidos FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete transparencia_links_rapidos"
ON public.transparencia_links_rapidos FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default categories
INSERT INTO public.transparencia_categorias (titulo, descricao, icone, cor, ordem) VALUES
('Despesas Públicas', 'Execução orçamentária, pagamentos, empenhos e liquidações', 'DollarSign', 'bg-red-50 border-red-200', 1),
('Receitas Públicas', 'Arrecadação municipal, transferências e demonstrativos', 'TrendingUp', 'bg-green-50 border-green-200', 2),
('Licitações e Contratos', 'Processos licitatórios, contratos e aditivos', 'FileText', 'bg-blue-50 border-blue-200', 3),
('Servidores e Pessoal', 'Estrutura administrativa, cargos e folha de pagamento', 'Users', 'bg-purple-50 border-purple-200', 4),
('Planejamento e Orçamento', 'PPA, LDO, LOA e instrumentos de planejamento', 'Calculator', 'bg-orange-50 border-orange-200', 5),
('Convênios e Parcerias', 'Convênios firmados, termos de colaboração e repasses', 'Handshake', 'bg-teal-50 border-teal-200', 6),
('Relatórios Fiscais', 'RREO, RGF, pareceres e demonstrativos contábeis', 'BarChart3', 'bg-indigo-50 border-indigo-200', 7),
('Acesso à Informação', 'e-SIC, Ouvidoria, LAI e perguntas frequentes', 'MessageSquare', 'bg-amber-50 border-amber-200', 8);

-- Insert default items for each category
INSERT INTO public.transparencia_itens (categoria_id, titulo, url, externo, ordem)
SELECT id, 'Execução Orçamentária', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 1 FROM transparencia_categorias WHERE titulo = 'Despesas Públicas'
UNION ALL
SELECT id, 'Pagamentos', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 2 FROM transparencia_categorias WHERE titulo = 'Despesas Públicas'
UNION ALL
SELECT id, 'Empenhos', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 3 FROM transparencia_categorias WHERE titulo = 'Despesas Públicas'
UNION ALL
SELECT id, 'Liquidações', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 4 FROM transparencia_categorias WHERE titulo = 'Despesas Públicas'
UNION ALL
SELECT id, 'Arrecadação', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 1 FROM transparencia_categorias WHERE titulo = 'Receitas Públicas'
UNION ALL
SELECT id, 'Transferências Recebidas', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 2 FROM transparencia_categorias WHERE titulo = 'Receitas Públicas'
UNION ALL
SELECT id, 'Demonstrativos de Receita', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 3 FROM transparencia_categorias WHERE titulo = 'Receitas Públicas'
UNION ALL
SELECT id, 'Licitações em Andamento', '/licitacoes', false, 1 FROM transparencia_categorias WHERE titulo = 'Licitações e Contratos'
UNION ALL
SELECT id, 'Contratos Administrativos', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 2 FROM transparencia_categorias WHERE titulo = 'Licitações e Contratos'
UNION ALL
SELECT id, 'Aditivos Contratuais', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 3 FROM transparencia_categorias WHERE titulo = 'Licitações e Contratos'
UNION ALL
SELECT id, 'Estrutura Administrativa', '/governo/estrutura-organizacional', false, 1 FROM transparencia_categorias WHERE titulo = 'Servidores e Pessoal'
UNION ALL
SELECT id, 'Folha de Pagamento', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 2 FROM transparencia_categorias WHERE titulo = 'Servidores e Pessoal'
UNION ALL
SELECT id, 'Plano Plurianual (PPA)', '/legislacao/planejamento-orcamento', false, 1 FROM transparencia_categorias WHERE titulo = 'Planejamento e Orçamento'
UNION ALL
SELECT id, 'Lei de Diretrizes Orçamentárias (LDO)', '/legislacao/planejamento-orcamento', false, 2 FROM transparencia_categorias WHERE titulo = 'Planejamento e Orçamento'
UNION ALL
SELECT id, 'Lei Orçamentária Anual (LOA)', '/legislacao/planejamento-orcamento', false, 3 FROM transparencia_categorias WHERE titulo = 'Planejamento e Orçamento'
UNION ALL
SELECT id, 'Convênios Firmados', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 1 FROM transparencia_categorias WHERE titulo = 'Convênios e Parcerias'
UNION ALL
SELECT id, 'Termos de Colaboração', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 2 FROM transparencia_categorias WHERE titulo = 'Convênios e Parcerias'
UNION ALL
SELECT id, 'RREO - Relatório Resumido', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 1 FROM transparencia_categorias WHERE titulo = 'Relatórios Fiscais'
UNION ALL
SELECT id, 'RGF - Relatório de Gestão Fiscal', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 2 FROM transparencia_categorias WHERE titulo = 'Relatórios Fiscais'
UNION ALL
SELECT id, 'Pareceres do TCE', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', true, 3 FROM transparencia_categorias WHERE titulo = 'Relatórios Fiscais'
UNION ALL
SELECT id, 'e-SIC - Solicitação de Informação', 'https://www.ipubi.pe.gov.br/esic/', true, 1 FROM transparencia_categorias WHERE titulo = 'Acesso à Informação'
UNION ALL
SELECT id, 'Ouvidoria Municipal', '/contato', false, 2 FROM transparencia_categorias WHERE titulo = 'Acesso à Informação'
UNION ALL
SELECT id, 'Lei de Acesso à Informação', '/legislacao/lei-acesso-informacao', false, 3 FROM transparencia_categorias WHERE titulo = 'Acesso à Informação';

-- Insert default quick access links
INSERT INTO public.transparencia_links_rapidos (titulo, url, icone, ordem) VALUES
('Portal da Transparência (Sistema)', 'https://www.ipubi.pe.gov.br/portaldatransparencia/', 'ExternalLink', 1),
('e-SIC', 'https://www.ipubi.pe.gov.br/esic/', 'Search', 2),
('Licitações', '/licitacoes', 'FileText', 3),
('Publicações Oficiais', '/publicacoes-oficiais', 'FileText', 4);