-- Criar tabela de categorias de FAQ
CREATE TABLE public.faq_categorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  icone TEXT NOT NULL DEFAULT 'HelpCircle',
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de perguntas frequentes
CREATE TABLE public.faq_perguntas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID NOT NULL REFERENCES public.faq_categorias(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faq_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_perguntas ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias
CREATE POLICY "Public can view active faq_categorias" 
ON public.faq_categorias FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins can view all faq_categorias" 
ON public.faq_categorias FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert faq_categorias" 
ON public.faq_categorias FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update faq_categorias" 
ON public.faq_categorias FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete faq_categorias" 
ON public.faq_categorias FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para perguntas
CREATE POLICY "Public can view active faq_perguntas" 
ON public.faq_perguntas FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins can view all faq_perguntas" 
ON public.faq_perguntas FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert faq_perguntas" 
ON public.faq_perguntas FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update faq_perguntas" 
ON public.faq_perguntas FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete faq_perguntas" 
ON public.faq_perguntas FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers para updated_at
CREATE TRIGGER update_faq_categorias_updated_at
BEFORE UPDATE ON public.faq_categorias
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faq_perguntas_updated_at
BEFORE UPDATE ON public.faq_perguntas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();