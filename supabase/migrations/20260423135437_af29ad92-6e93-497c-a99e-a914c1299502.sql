CREATE TABLE public.dpo_encarregado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  email TEXT NOT NULL,
  telefone TEXT,
  portaria_nomeacao TEXT,
  data_nomeacao DATE,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dpo_encarregado ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active dpo"
ON public.dpo_encarregado
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins can view all dpo"
ON public.dpo_encarregado
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert dpo"
ON public.dpo_encarregado
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update dpo"
ON public.dpo_encarregado
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete dpo"
ON public.dpo_encarregado
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_dpo_encarregado_updated_at
BEFORE UPDATE ON public.dpo_encarregado
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();