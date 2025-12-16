-- Criar enum para modalidades de licitação
CREATE TYPE public.modalidade_licitacao AS ENUM (
  'pregao_eletronico',
  'pregao_presencial',
  'concorrencia',
  'tomada_de_precos',
  'convite',
  'concurso',
  'leilao',
  'dialogo_competitivo',
  'dispensa',
  'inexigibilidade'
);

-- Criar enum para status da licitação
CREATE TYPE public.status_licitacao AS ENUM (
  'aberta',
  'em_andamento',
  'encerrada',
  'cancelada',
  'suspensa',
  'deserta',
  'fracassada'
);

-- Criar enum para tipos de documento
CREATE TYPE public.tipo_documento_licitacao AS ENUM (
  'edital',
  'termo_referencia',
  'projeto_basico',
  'aviso',
  'ata',
  'resultado',
  'homologacao',
  'contrato',
  'aditivo',
  'impugnacao',
  'esclarecimento',
  'outros'
);

-- Criar tabela de licitações
CREATE TABLE public.licitacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_processo TEXT NOT NULL,
  modalidade modalidade_licitacao NOT NULL,
  objeto TEXT NOT NULL,
  secretaria_id UUID REFERENCES public.secretarias(id) ON DELETE SET NULL,
  secretaria_nome TEXT, -- Nome da secretaria para histórico
  data_abertura DATE NOT NULL,
  data_encerramento DATE,
  ano INTEGER NOT NULL,
  status status_licitacao NOT NULL DEFAULT 'aberta',
  valor_estimado DECIMAL(15,2),
  observacoes TEXT,
  link_sistema_oficial TEXT, -- Link para sistema oficial do município
  publicado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Criar tabela de documentos das licitações
CREATE TABLE public.documentos_licitacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  licitacao_id UUID NOT NULL REFERENCES public.licitacoes(id) ON DELETE CASCADE,
  tipo tipo_documento_licitacao NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  url TEXT NOT NULL, -- URL do documento (pode ser externo ou interno)
  data_publicacao DATE NOT NULL DEFAULT CURRENT_DATE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_licitacoes_ano ON public.licitacoes(ano);
CREATE INDEX idx_licitacoes_status ON public.licitacoes(status);
CREATE INDEX idx_licitacoes_modalidade ON public.licitacoes(modalidade);
CREATE INDEX idx_licitacoes_numero ON public.licitacoes(numero_processo);
CREATE INDEX idx_documentos_licitacao_id ON public.documentos_licitacao(licitacao_id);

-- Habilitar RLS
ALTER TABLE public.licitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_licitacao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para licitações (público pode ver publicadas)
CREATE POLICY "Public can view published licitacoes"
ON public.licitacoes FOR SELECT
USING (publicado = true);

CREATE POLICY "Admins can view all licitacoes"
ON public.licitacoes FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert licitacoes"
ON public.licitacoes FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update licitacoes"
ON public.licitacoes FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete licitacoes"
ON public.licitacoes FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Políticas RLS para documentos (público pode ver documentos de licitações publicadas)
CREATE POLICY "Public can view documents of published licitacoes"
ON public.documentos_licitacao FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.licitacoes 
    WHERE id = licitacao_id AND publicado = true
  )
);

CREATE POLICY "Admins can view all documents"
ON public.documentos_licitacao FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert documents"
ON public.documentos_licitacao FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
ON public.documentos_licitacao FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents"
ON public.documentos_licitacao FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_licitacoes_updated_at
BEFORE UPDATE ON public.licitacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentos_licitacao_updated_at
BEFORE UPDATE ON public.documentos_licitacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();