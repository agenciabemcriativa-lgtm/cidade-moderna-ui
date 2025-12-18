-- ============================================
-- MÓDULO 1: OBRAS PÚBLICAS
-- ============================================
CREATE TYPE status_obra AS ENUM ('em_andamento', 'concluida', 'paralisada', 'planejada');
CREATE TYPE fonte_recurso_obra AS ENUM ('proprio', 'federal', 'estadual', 'convenio', 'financiamento', 'outros');

CREATE TABLE public.obras_publicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  objeto TEXT NOT NULL,
  descricao TEXT,
  valor_contratado NUMERIC(15, 2),
  valor_executado NUMERIC(15, 2),
  empresa_executora TEXT,
  cnpj_empresa TEXT,
  data_inicio DATE,
  data_previsao_termino DATE,
  data_conclusao DATE,
  prazo_execucao_dias INTEGER,
  fonte_recurso fonte_recurso_obra DEFAULT 'proprio',
  fonte_recurso_descricao TEXT,
  localizacao TEXT,
  secretaria_responsavel TEXT,
  fiscal_obra TEXT,
  status status_obra DEFAULT 'em_andamento',
  percentual_execucao NUMERIC(5, 2) DEFAULT 0,
  numero_contrato TEXT,
  link_sistema_oficial TEXT,
  foto_url TEXT,
  observacoes TEXT,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE public.obras_publicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published obras" ON public.obras_publicas
  FOR SELECT USING (publicado = true);

CREATE POLICY "Admins can view all obras" ON public.obras_publicas
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert obras" ON public.obras_publicas
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update obras" ON public.obras_publicas
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete obras" ON public.obras_publicas
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- MÓDULO 2: REMUNERAÇÃO DE AGENTES POLÍTICOS
-- ============================================
CREATE TYPE cargo_agente_politico AS ENUM ('prefeito', 'vice_prefeito', 'secretario', 'outros');

CREATE TABLE public.remuneracao_agentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo cargo_agente_politico NOT NULL,
  cargo_descricao TEXT,
  secretaria TEXT,
  subsidio_mensal NUMERIC(12, 2) NOT NULL,
  verba_representacao NUMERIC(12, 2) DEFAULT 0,
  outros_valores NUMERIC(12, 2) DEFAULT 0,
  total_bruto NUMERIC(12, 2),
  mes_referencia INTEGER NOT NULL,
  ano_referencia INTEGER NOT NULL,
  observacoes TEXT,
  foto_url TEXT,
  ativo BOOLEAN DEFAULT true,
  publicado BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.remuneracao_agentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published remuneracao" ON public.remuneracao_agentes
  FOR SELECT USING (publicado = true);

CREATE POLICY "Admins can view all remuneracao" ON public.remuneracao_agentes
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert remuneracao" ON public.remuneracao_agentes
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update remuneracao" ON public.remuneracao_agentes
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete remuneracao" ON public.remuneracao_agentes
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- MÓDULO 3: DIÁRIAS E PASSAGENS
-- ============================================
CREATE TABLE public.diarias_passagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  beneficiario_nome TEXT NOT NULL,
  beneficiario_cargo TEXT,
  beneficiario_matricula TEXT,
  secretaria TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('diaria', 'passagem', 'diaria_passagem')),
  destino TEXT NOT NULL,
  finalidade TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  quantidade_dias INTEGER,
  valor_unitario NUMERIC(12, 2),
  valor_total NUMERIC(12, 2) NOT NULL,
  numero_portaria TEXT,
  link_sistema_oficial TEXT,
  observacoes TEXT,
  mes_referencia INTEGER NOT NULL,
  ano_referencia INTEGER NOT NULL,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.diarias_passagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published diarias" ON public.diarias_passagens
  FOR SELECT USING (publicado = true);

CREATE POLICY "Admins can view all diarias" ON public.diarias_passagens
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert diarias" ON public.diarias_passagens
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update diarias" ON public.diarias_passagens
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete diarias" ON public.diarias_passagens
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- MÓDULO 4: PATRIMÔNIO PÚBLICO
-- ============================================
CREATE TYPE tipo_bem_publico AS ENUM ('imovel', 'veiculo', 'equipamento', 'mobiliario', 'outros');
CREATE TYPE situacao_bem AS ENUM ('bom', 'regular', 'ruim', 'inservivel', 'alienado');

CREATE TABLE public.patrimonio_publico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo tipo_bem_publico NOT NULL,
  descricao TEXT NOT NULL,
  numero_patrimonio TEXT,
  -- Campos específicos para imóveis
  endereco TEXT,
  area_m2 NUMERIC(12, 2),
  matricula_cartorio TEXT,
  -- Campos específicos para veículos
  placa TEXT,
  marca_modelo TEXT,
  ano_fabricacao INTEGER,
  chassi TEXT,
  renavam TEXT,
  -- Campos gerais
  valor_aquisicao NUMERIC(15, 2),
  data_aquisicao DATE,
  valor_atual NUMERIC(15, 2),
  situacao situacao_bem DEFAULT 'bom',
  secretaria_responsavel TEXT,
  localizacao_atual TEXT,
  observacoes TEXT,
  foto_url TEXT,
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.patrimonio_publico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published patrimonio" ON public.patrimonio_publico
  FOR SELECT USING (publicado = true);

CREATE POLICY "Admins can view all patrimonio" ON public.patrimonio_publico
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert patrimonio" ON public.patrimonio_publico
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update patrimonio" ON public.patrimonio_publico
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete patrimonio" ON public.patrimonio_publico
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- MÓDULO 5: DADOS ABERTOS
-- ============================================
CREATE TYPE categoria_dados_abertos AS ENUM ('receitas', 'despesas', 'licitacoes', 'contratos', 'servidores', 'obras', 'patrimonio', 'outros');
CREATE TYPE formato_arquivo AS ENUM ('csv', 'xls', 'xlsx', 'pdf', 'json', 'xml', 'outros');

CREATE TABLE public.dados_abertos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria categoria_dados_abertos NOT NULL,
  formato formato_arquivo NOT NULL,
  arquivo_url TEXT NOT NULL,
  arquivo_nome TEXT NOT NULL,
  tamanho_bytes BIGINT,
  data_referencia DATE,
  periodicidade TEXT,
  fonte TEXT,
  ultima_atualizacao DATE NOT NULL DEFAULT CURRENT_DATE,
  quantidade_registros INTEGER,
  link_sistema_origem TEXT,
  observacoes TEXT,
  publicado BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.dados_abertos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published dados_abertos" ON public.dados_abertos
  FOR SELECT USING (publicado = true);

CREATE POLICY "Admins can view all dados_abertos" ON public.dados_abertos
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert dados_abertos" ON public.dados_abertos
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update dados_abertos" ON public.dados_abertos
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete dados_abertos" ON public.dados_abertos
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Índices para melhor performance
CREATE INDEX idx_obras_status ON public.obras_publicas(status);
CREATE INDEX idx_obras_fonte_recurso ON public.obras_publicas(fonte_recurso);
CREATE INDEX idx_remuneracao_ano_mes ON public.remuneracao_agentes(ano_referencia, mes_referencia);
CREATE INDEX idx_diarias_ano_mes ON public.diarias_passagens(ano_referencia, mes_referencia);
CREATE INDEX idx_patrimonio_tipo ON public.patrimonio_publico(tipo);
CREATE INDEX idx_dados_abertos_categoria ON public.dados_abertos(categoria);