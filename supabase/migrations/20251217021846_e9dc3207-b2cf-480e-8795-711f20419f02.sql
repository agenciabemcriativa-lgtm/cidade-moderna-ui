-- Create table for citizen services pages
CREATE TABLE public.atendimento_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  categoria TEXT NOT NULL, -- Saúde, Assistência Social, Educação, Programas e Serviços
  subcategoria TEXT, -- UBS, CAPS, Hospital, CRAS, CREAS, etc.
  conteudo TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  horario TEXT DEFAULT 'Segunda a Sexta: 08h às 14h',
  responsavel_nome TEXT,
  responsavel_cargo TEXT,
  foto_url TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.atendimento_itens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view active atendimento_itens" 
ON public.atendimento_itens 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins can view all atendimento_itens" 
ON public.atendimento_itens 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert atendimento_itens" 
ON public.atendimento_itens 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update atendimento_itens" 
ON public.atendimento_itens 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete atendimento_itens" 
ON public.atendimento_itens 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_atendimento_itens_updated_at
BEFORE UPDATE ON public.atendimento_itens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for the service categories
INSERT INTO public.atendimento_itens (titulo, slug, categoria, subcategoria, conteudo) VALUES
('UBS - Unidade Básica de Saúde', 'ubs', 'Saúde', 'UBS', '<p>As Unidades Básicas de Saúde (UBS) são a porta de entrada preferencial do Sistema Único de Saúde (SUS). O objetivo é atender até 80% dos problemas de saúde da população, sem que haja a necessidade de encaminhamento para hospitais.</p><h3>Serviços Oferecidos</h3><ul><li>Consultas médicas</li><li>Vacinação</li><li>Curativos</li><li>Acompanhamento de gestantes</li><li>Acompanhamento de hipertensos e diabéticos</li></ul>'),
('CAPS - Centro de Atenção Psicossocial', 'caps', 'Saúde', 'CAPS', '<p>O CAPS oferece atendimento à população com transtornos mentais graves e persistentes, procurando integrar os usuários a um ambiente social e cultural concreto.</p><h3>Serviços Oferecidos</h3><ul><li>Atendimento individual</li><li>Atendimento em grupo</li><li>Oficinas terapêuticas</li><li>Visitas domiciliares</li></ul>'),
('Hospital Municipal', 'hospital', 'Saúde', 'Hospital', '<p>O Hospital Municipal de Ipubi oferece atendimento de urgência e emergência 24 horas, além de internações e procedimentos médicos.</p><h3>Serviços Oferecidos</h3><ul><li>Pronto-Socorro 24h</li><li>Internação</li><li>Exames laboratoriais</li><li>Raio-X</li></ul>'),
('CRAS - Centro de Referência de Assistência Social', 'cras', 'Assistência Social', 'CRAS', '<p>O CRAS é a porta de entrada da Assistência Social. É um local público, localizado prioritariamente em áreas de maior vulnerabilidade social.</p><h3>Serviços Oferecidos</h3><ul><li>Cadastro Único</li><li>Bolsa Família</li><li>BPC - Benefício de Prestação Continuada</li><li>Orientação e apoio às famílias</li></ul>'),
('CREAS - Centro de Referência Especializado de Assistência Social', 'creas', 'Assistência Social', 'CREAS', '<p>O CREAS oferece apoio e orientação especializados a famílias e indivíduos em situação de ameaça ou violação de direitos.</p><h3>Serviços Oferecidos</h3><ul><li>Atendimento a vítimas de violência</li><li>Acompanhamento de adolescentes em cumprimento de medidas socioeducativas</li><li>Apoio a pessoas em situação de rua</li></ul>'),
('Educação Municipal', 'educacao', 'Educação', NULL, '<p>A Secretaria de Educação de Ipubi é responsável pela gestão da rede municipal de ensino, abrangendo a educação infantil e o ensino fundamental.</p><h3>Áreas de Atuação</h3><ul><li>Educação Infantil (Creches e Pré-escolas)</li><li>Ensino Fundamental</li><li>EJA - Educação de Jovens e Adultos</li><li>Transporte Escolar</li><li>Merenda Escolar</li></ul>'),
('Programas e Serviços Sociais', 'programas-servicos', 'Programas e Serviços', NULL, '<p>Conheça os principais programas e serviços sociais oferecidos pela Prefeitura de Ipubi para a população.</p><h3>Programas Disponíveis</h3><ul><li>Bolsa Família</li><li>Programa Criança Feliz</li><li>Auxílio Brasil</li><li>Tarifa Social de Energia</li><li>ID Jovem</li></ul>');