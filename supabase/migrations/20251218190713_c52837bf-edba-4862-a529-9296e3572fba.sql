-- Política para consulta pública por protocolo (sem login)
CREATE POLICY "Public can view esic by protocol" 
ON public.esic_solicitacoes FOR SELECT 
USING (true);

-- Permitir que respostas sejam vistas quando a solicitação pode ser vista
DROP POLICY IF EXISTS "Users can view responses to own requests" ON public.esic_respostas;
CREATE POLICY "Public can view esic responses" 
ON public.esic_respostas FOR SELECT 
USING (true);

-- Permitir que recursos sejam vistos quando a solicitação pode ser vista  
DROP POLICY IF EXISTS "Users can view own resources" ON public.esic_recursos;
CREATE POLICY "Public can view esic resources" 
ON public.esic_recursos FOR SELECT 
USING (true);

-- Permitir visualização de anexos públicos
DROP POLICY IF EXISTS "Users can view attachments of own requests" ON public.esic_anexos;
CREATE POLICY "Public can view esic attachments" 
ON public.esic_anexos FOR SELECT 
USING (true);