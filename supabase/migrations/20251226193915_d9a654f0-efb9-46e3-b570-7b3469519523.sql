-- Tabela principal de serviços da Carta de Serviços (Lei 13.460/2017)
CREATE TABLE public.carta_servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  
  -- Requisitos e documentos
  requisitos TEXT,
  documentos_necessarios TEXT,
  
  -- Processo e prazos
  etapas_atendimento TEXT,
  prazo_maximo VARCHAR(100),
  prazo_medio VARCHAR(100),
  
  -- Forma de prestação
  forma_prestacao VARCHAR(50) NOT NULL DEFAULT 'presencial', -- presencial, online, hibrido
  canal_acesso TEXT,
  
  -- Local e horário
  local_atendimento TEXT,
  horario_atendimento VARCHAR(255),
  
  -- Contato e comunicação
  telefone VARCHAR(50),
  email VARCHAR(255),
  site_url VARCHAR(500),
  
  -- Custos
  gratuito BOOLEAN DEFAULT true,
  custos_taxas TEXT,
  
  -- Prioridades e tempo de espera
  prioridades_atendimento TEXT,
  tempo_espera_estimado VARCHAR(100),
  
  -- Consulta de andamento
  mecanismo_consulta TEXT,
  
  -- Manifestações
  procedimento_manifestacao TEXT,
  
  -- Legislação relacionada
  base_legal TEXT,
  
  -- Responsável
  orgao_responsavel VARCHAR(255),
  secretaria_id UUID REFERENCES public.secretarias(id),
  
  -- Controle
  publicado BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Índices
CREATE INDEX idx_carta_servicos_categoria ON public.carta_servicos(categoria);
CREATE INDEX idx_carta_servicos_slug ON public.carta_servicos(slug);
CREATE INDEX idx_carta_servicos_publicado ON public.carta_servicos(publicado);

-- Enable RLS
ALTER TABLE public.carta_servicos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Serviços publicados são públicos"
ON public.carta_servicos
FOR SELECT
USING (publicado = true);

CREATE POLICY "Admins podem gerenciar serviços"
ON public.carta_servicos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'editor')
  )
);

-- Trigger para updated_at
CREATE TRIGGER update_carta_servicos_updated_at
BEFORE UPDATE ON public.carta_servicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();