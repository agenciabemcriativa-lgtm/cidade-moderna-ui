-- Enum para tipo de publicação
CREATE TYPE public.tipo_publicacao AS ENUM (
  'lei',
  'decreto',
  'portaria',
  'resolucao',
  'instrucao_normativa',
  'ato_administrativo',
  'edital',
  'comunicado'
);

-- Enum para situação da publicação
CREATE TYPE public.situacao_publicacao AS ENUM (
  'vigente',
  'revogado',
  'alterado'
);

-- Tabela principal de publicações oficiais
CREATE TABLE public.publicacoes_oficiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo tipo_publicacao NOT NULL,
  numero TEXT NOT NULL,
  ano INTEGER NOT NULL,
  data_publicacao DATE NOT NULL,
  secretaria_id UUID REFERENCES public.secretarias(id) ON DELETE SET NULL,
  secretaria_nome TEXT,
  ementa TEXT NOT NULL,
  texto_completo_url TEXT,
  situacao situacao_publicacao NOT NULL DEFAULT 'vigente',
  publicacao_relacionada_id UUID REFERENCES public.publicacoes_oficiais(id) ON DELETE SET NULL,
  observacoes TEXT,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de alterações (para auditoria)
CREATE TABLE public.publicacoes_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  publicacao_id UUID NOT NULL REFERENCES public.publicacoes_oficiais(id) ON DELETE CASCADE,
  campo_alterado TEXT NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  alterado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  alterado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.publicacoes_oficiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicacoes_historico ENABLE ROW LEVEL SECURITY;

-- Políticas para publicações oficiais (acesso público)
CREATE POLICY "Public can view published publicacoes" 
ON public.publicacoes_oficiais 
FOR SELECT 
USING (publicado = true);

CREATE POLICY "Admins can view all publicacoes" 
ON public.publicacoes_oficiais 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert publicacoes" 
ON public.publicacoes_oficiais 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update publicacoes" 
ON public.publicacoes_oficiais 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para histórico
CREATE POLICY "Admins can view historico" 
ON public.publicacoes_historico 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert historico" 
ON public.publicacoes_historico 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_publicacoes_updated_at
BEFORE UPDATE ON public.publicacoes_oficiais
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para busca eficiente
CREATE INDEX idx_publicacoes_tipo ON public.publicacoes_oficiais(tipo);
CREATE INDEX idx_publicacoes_ano ON public.publicacoes_oficiais(ano);
CREATE INDEX idx_publicacoes_situacao ON public.publicacoes_oficiais(situacao);
CREATE INDEX idx_publicacoes_data ON public.publicacoes_oficiais(data_publicacao DESC);
CREATE INDEX idx_publicacoes_numero ON public.publicacoes_oficiais(numero);
CREATE INDEX idx_publicacoes_titulo_search ON public.publicacoes_oficiais USING gin(to_tsvector('portuguese', titulo || ' ' || ementa));