-- Tabela para Órgãos da Administração Direta
CREATE TABLE public.orgaos_administracao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  icone TEXT NOT NULL DEFAULT 'Building2',
  competencia TEXT,
  responsavel TEXT,
  contato TEXT,
  email TEXT,
  base_legal TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para Unidades Vinculadas
CREATE TABLE public.unidades_vinculadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  secretaria TEXT NOT NULL,
  icone TEXT NOT NULL DEFAULT 'Building2',
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para as unidades de cada secretaria
CREATE TABLE public.unidades_vinculadas_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unidade_vinculada_id UUID NOT NULL REFERENCES public.unidades_vinculadas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.orgaos_administracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_vinculadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_vinculadas_itens ENABLE ROW LEVEL SECURITY;

-- Políticas para orgaos_administracao
CREATE POLICY "Leitura pública de órgãos ativos"
ON public.orgaos_administracao
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admin pode gerenciar órgãos"
ON public.orgaos_administracao
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Políticas para unidades_vinculadas
CREATE POLICY "Leitura pública de unidades vinculadas ativas"
ON public.unidades_vinculadas
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admin pode gerenciar unidades vinculadas"
ON public.unidades_vinculadas
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Políticas para unidades_vinculadas_itens
CREATE POLICY "Leitura pública de itens ativos"
ON public.unidades_vinculadas_itens
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admin pode gerenciar itens de unidades"
ON public.unidades_vinculadas_itens
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers para updated_at
CREATE TRIGGER update_orgaos_administracao_updated_at
BEFORE UPDATE ON public.orgaos_administracao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_unidades_vinculadas_updated_at
BEFORE UPDATE ON public.unidades_vinculadas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais - Órgãos da Administração
INSERT INTO public.orgaos_administracao (nome, icone, competencia, responsavel, contato, email, base_legal, ordem) VALUES
('Gabinete do Prefeito', 'Building2', 'Assessoramento direto ao Chefe do Poder Executivo Municipal na direção superior da administração municipal.', 'Prefeito Municipal', '(87) 3831-1156', 'gabinete@ipubi.pe.gov.br', 'Lei Orgânica Municipal', 1),
('Secretaria Municipal de Administração', 'Users', 'Gestão de pessoal, recursos humanos, patrimônio público, serviços gerais e administração de contratos.', 'Secretário(a) de Administração', '(87) 3831-1156', 'administracao@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 2),
('Secretaria Municipal de Finanças', 'Wallet', 'Gestão financeira, orçamentária, tributária, contabilidade e controle fiscal do município.', 'Secretário(a) de Finanças', '(87) 3831-1156', 'financas@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 3),
('Secretaria Municipal de Saúde', 'Heart', 'Planejamento, coordenação e execução das políticas públicas de saúde no âmbito municipal.', 'Secretário(a) de Saúde', '(87) 3831-1156', 'saude@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 4),
('Secretaria Municipal de Educação', 'GraduationCap', 'Gestão da educação básica municipal, incluindo educação infantil e ensino fundamental.', 'Secretário(a) de Educação', '(87) 3831-1156', 'educacao@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 5),
('Secretaria Municipal de Assistência Social', 'HandHeart', 'Coordenação e execução das políticas de assistência social, proteção básica e especial.', 'Secretário(a) de Assistência Social', '(87) 3831-1156', 'assistenciasocial@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 6),
('Secretaria Municipal de Infraestrutura', 'HardHat', 'Obras públicas, urbanismo, transporte, manutenção de vias e equipamentos urbanos.', 'Secretário(a) de Infraestrutura', '(87) 3831-1156', 'infraestrutura@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 7),
('Secretaria Municipal de Agricultura', 'Wheat', 'Políticas de fomento à agricultura familiar, abastecimento e desenvolvimento rural.', 'Secretário(a) de Agricultura', '(87) 3831-1156', 'agricultura@ipubi.pe.gov.br', 'Lei Municipal de Estrutura Administrativa', 8);

-- Inserir dados iniciais - Unidades Vinculadas
INSERT INTO public.unidades_vinculadas (id, secretaria, icone, ordem) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Secretaria Municipal de Saúde', 'Heart', 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Secretaria Municipal de Assistência Social', 'HandHeart', 2),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Secretaria Municipal de Educação', 'GraduationCap', 3);

-- Inserir itens das unidades
INSERT INTO public.unidades_vinculadas_itens (unidade_vinculada_id, nome, ordem) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Unidades Básicas de Saúde (UBS)', 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Centro de Atenção Psicossocial (CAPS)', 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hospital/Unidade Mista', 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Academia da Saúde', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Núcleo Ampliado de Saúde da Família (NASF)', 5),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Centro de Referência de Assistência Social (CRAS)', 1),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Centro de Referência Especializado de Assistência Social (CREAS)', 2),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Conselho Tutelar', 3),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Escolas Municipais', 1),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Creches e Centros de Educação Infantil', 2);