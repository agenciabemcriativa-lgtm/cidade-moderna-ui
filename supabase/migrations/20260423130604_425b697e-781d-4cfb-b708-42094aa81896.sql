
CREATE TABLE public.esic_links_legais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'externo',
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.esic_links_legais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active esic_links_legais"
  ON public.esic_links_legais FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admins can view all esic_links_legais"
  ON public.esic_links_legais FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert esic_links_legais"
  ON public.esic_links_legais FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update esic_links_legais"
  ON public.esic_links_legais FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete esic_links_legais"
  ON public.esic_links_legais FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_esic_links_legais_updated_at
  BEFORE UPDATE ON public.esic_links_legais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.esic_links_legais (titulo, url, tipo, ordem) VALUES
  ('Lei nº 12.527/2011 (LAI)', 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm', 'externo', 1),
  ('Decreto nº 7.724/2012', 'https://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2012/Decreto/D7724.htm', 'externo', 2),
  ('Regulamentação Municipal', '/legislacao/lei-acesso-informacao', 'interno', 3);
