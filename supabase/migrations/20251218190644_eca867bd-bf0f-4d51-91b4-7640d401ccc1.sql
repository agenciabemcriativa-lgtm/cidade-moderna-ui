-- =============================================
-- SISTEMA E-SIC COMPLETO - Lei nº 12.527/2011
-- =============================================

-- Enum para status da solicitação
CREATE TYPE public.status_esic AS ENUM (
  'pendente',           -- Aguardando análise
  'em_andamento',       -- Em análise pelo setor responsável
  'respondida',         -- Resposta enviada
  'prorrogada',         -- Prazo prorrogado (+10 dias)
  'recurso',            -- Em fase de recurso
  'arquivada',          -- Arquivada (finalizada)
  'cancelada'           -- Cancelada pelo solicitante
);

-- Enum para tipo de resposta
CREATE TYPE public.tipo_resposta_esic AS ENUM (
  'deferido',           -- Informação concedida
  'deferido_parcial',   -- Informação parcialmente concedida
  'indeferido',         -- Acesso negado
  'nao_possui',         -- Órgão não possui a informação
  'encaminhado',        -- Encaminhado a outro órgão
  'prorrogacao'         -- Notificação de prorrogação
);

-- Enum para instância de recurso
CREATE TYPE public.instancia_recurso_esic AS ENUM (
  'primeira',           -- Autoridade superior
  'segunda',            -- Autoridade máxima (Prefeito)
  'terceira'            -- CGM/Controladoria
);

-- Tabela principal de solicitações e-SIC
CREATE TABLE public.esic_solicitacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocolo TEXT NOT NULL UNIQUE,
  
  -- Dados do solicitante
  solicitante_nome TEXT NOT NULL,
  solicitante_email TEXT NOT NULL,
  solicitante_telefone TEXT,
  solicitante_documento TEXT, -- CPF/CNPJ (opcional conforme LAI)
  solicitante_user_id UUID REFERENCES auth.users(id), -- Se logado
  
  -- Dados da solicitação
  assunto TEXT NOT NULL,
  descricao TEXT NOT NULL,
  forma_recebimento TEXT DEFAULT 'email', -- email, presencial, correio
  
  -- Controle de prazos
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_limite TIMESTAMP WITH TIME ZONE NOT NULL, -- 20 dias úteis
  data_prorrogacao TIMESTAMP WITH TIME ZONE, -- +10 dias se prorrogado
  data_resposta TIMESTAMP WITH TIME ZONE,
  
  -- Gestão interna
  setor_responsavel TEXT,
  responsavel_id UUID REFERENCES auth.users(id),
  status status_esic NOT NULL DEFAULT 'pendente',
  prioridade INTEGER DEFAULT 0,
  
  -- Metadados
  ip_solicitante TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de respostas
CREATE TABLE public.esic_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID NOT NULL REFERENCES public.esic_solicitacoes(id) ON DELETE CASCADE,
  
  tipo tipo_resposta_esic NOT NULL,
  conteudo TEXT NOT NULL,
  fundamentacao_legal TEXT, -- Fundamentação para negativas
  
  respondido_por UUID REFERENCES auth.users(id),
  respondido_por_nome TEXT,
  data_resposta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de recursos
CREATE TABLE public.esic_recursos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID NOT NULL REFERENCES public.esic_solicitacoes(id) ON DELETE CASCADE,
  
  instancia instancia_recurso_esic NOT NULL,
  motivo TEXT NOT NULL,
  
  -- Dados do recurso
  data_recurso TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_limite TIMESTAMP WITH TIME ZONE NOT NULL, -- 5 dias para decidir
  data_decisao TIMESTAMP WITH TIME ZONE,
  
  -- Decisão
  decisao TEXT, -- provido, improvido, parcialmente provido
  fundamentacao TEXT,
  decidido_por UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de anexos
CREATE TABLE public.esic_anexos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID REFERENCES public.esic_solicitacoes(id) ON DELETE CASCADE,
  resposta_id UUID REFERENCES public.esic_respostas(id) ON DELETE CASCADE,
  recurso_id UUID REFERENCES public.esic_recursos(id) ON DELETE CASCADE,
  
  nome_arquivo TEXT NOT NULL,
  url TEXT NOT NULL,
  tamanho_bytes BIGINT,
  tipo_mime TEXT,
  
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Pelo menos uma referência deve existir
  CONSTRAINT anexo_referencia_check CHECK (
    solicitacao_id IS NOT NULL OR resposta_id IS NOT NULL OR recurso_id IS NOT NULL
  )
);

-- Tabela de histórico/auditoria
CREATE TABLE public.esic_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID NOT NULL REFERENCES public.esic_solicitacoes(id) ON DELETE CASCADE,
  
  acao TEXT NOT NULL, -- criado, atualizado, respondido, prorrogado, recurso, etc.
  descricao TEXT,
  dados_anteriores JSONB,
  dados_novos JSONB,
  
  usuario_id UUID REFERENCES auth.users(id),
  usuario_nome TEXT,
  ip_address TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_esic_solicitacoes_protocolo ON public.esic_solicitacoes(protocolo);
CREATE INDEX idx_esic_solicitacoes_email ON public.esic_solicitacoes(solicitante_email);
CREATE INDEX idx_esic_solicitacoes_status ON public.esic_solicitacoes(status);
CREATE INDEX idx_esic_solicitacoes_data ON public.esic_solicitacoes(data_solicitacao);
CREATE INDEX idx_esic_solicitacoes_user ON public.esic_solicitacoes(solicitante_user_id);
CREATE INDEX idx_esic_respostas_solicitacao ON public.esic_respostas(solicitacao_id);
CREATE INDEX idx_esic_recursos_solicitacao ON public.esic_recursos(solicitacao_id);
CREATE INDEX idx_esic_historico_solicitacao ON public.esic_historico(solicitacao_id);

-- RLS Policies
ALTER TABLE public.esic_solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esic_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esic_recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esic_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esic_historico ENABLE ROW LEVEL SECURITY;

-- Cidadãos podem ver suas próprias solicitações
CREATE POLICY "Users can view own esic requests" 
ON public.esic_solicitacoes FOR SELECT 
USING (solicitante_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Cidadãos podem criar solicitações
CREATE POLICY "Users can create esic requests" 
ON public.esic_solicitacoes FOR INSERT 
WITH CHECK (true); -- Qualquer um pode criar, mesmo sem login

-- Admins podem atualizar
CREATE POLICY "Admins can update esic requests" 
ON public.esic_solicitacoes FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Respostas - cidadãos veem respostas de suas solicitações
CREATE POLICY "Users can view responses to own requests" 
ON public.esic_respostas FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.esic_solicitacoes s 
    WHERE s.id = solicitacao_id 
    AND (s.solicitante_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Admins podem criar respostas
CREATE POLICY "Admins can insert esic responses" 
ON public.esic_respostas FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recursos - cidadãos podem ver e criar recursos
CREATE POLICY "Users can view own resources" 
ON public.esic_recursos FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.esic_solicitacoes s 
    WHERE s.id = solicitacao_id 
    AND (s.solicitante_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can create resources for own requests" 
ON public.esic_recursos FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.esic_solicitacoes s 
    WHERE s.id = solicitacao_id 
    AND s.solicitante_user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update resources" 
ON public.esic_recursos FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anexos
CREATE POLICY "Users can view attachments of own requests" 
ON public.esic_anexos FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.esic_solicitacoes s 
    WHERE s.id = solicitacao_id 
    AND (s.solicitante_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can upload attachments" 
ON public.esic_anexos FOR INSERT 
WITH CHECK (true);

-- Histórico - apenas admins
CREATE POLICY "Admins can view esic history" 
ON public.esic_historico FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert esic history" 
ON public.esic_historico FOR INSERT 
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_esic_solicitacoes_updated_at
  BEFORE UPDATE ON public.esic_solicitacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar protocolo único
CREATE OR REPLACE FUNCTION public.gerar_protocolo_esic()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ano TEXT;
  sequencia INT;
  protocolo TEXT;
BEGIN
  ano := EXTRACT(YEAR FROM now())::TEXT;
  
  -- Conta quantas solicitações existem no ano
  SELECT COUNT(*) + 1 INTO sequencia
  FROM esic_solicitacoes
  WHERE EXTRACT(YEAR FROM data_solicitacao) = EXTRACT(YEAR FROM now());
  
  -- Formato: ESIC-AAAA-NNNNNN
  protocolo := 'ESIC-' || ano || '-' || LPAD(sequencia::TEXT, 6, '0');
  
  RETURN protocolo;
END;
$$;

-- Storage bucket para anexos do e-SIC
INSERT INTO storage.buckets (id, name, public) 
VALUES ('esic', 'esic', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para o bucket esic
CREATE POLICY "Users can upload esic attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'esic');

CREATE POLICY "Users can view own esic attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'esic');