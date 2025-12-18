-- Enum para tipos de documentos de legislação
CREATE TYPE public.tipo_documento_legislacao AS ENUM (
  'lei_organica',
  'ppa',
  'ldo',
  'loa',
  'emenda_lei_organica',
  'outro'
);

-- Tabela para documentos de legislação
CREATE TABLE public.documentos_legislacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo tipo_documento_legislacao NOT NULL,
  ano INTEGER NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  arquivo_nome TEXT NOT NULL,
  vigente BOOLEAN DEFAULT true,
  data_publicacao DATE NOT NULL,
  observacoes TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documentos_legislacao ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view documentos_legislacao"
ON public.documentos_legislacao
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert documentos_legislacao"
ON public.documentos_legislacao
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update documentos_legislacao"
ON public.documentos_legislacao
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete documentos_legislacao"
ON public.documentos_legislacao
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_documentos_legislacao_updated_at
BEFORE UPDATE ON public.documentos_legislacao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for legislation documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('legislacao', 'legislacao', true);

-- Storage policies
CREATE POLICY "Anyone can view legislacao files"
ON storage.objects FOR SELECT
USING (bucket_id = 'legislacao');

CREATE POLICY "Admins can upload legislacao files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'legislacao' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update legislacao files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'legislacao' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete legislacao files"
ON storage.objects FOR DELETE
USING (bucket_id = 'legislacao' AND has_role(auth.uid(), 'admin'::app_role));