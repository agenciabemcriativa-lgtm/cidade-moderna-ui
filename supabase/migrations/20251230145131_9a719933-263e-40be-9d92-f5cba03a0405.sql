-- Adicionar campo categoria aos cardápios escolares
ALTER TABLE public.cardapios_escolares 
ADD COLUMN categoria TEXT NOT NULL DEFAULT 'Cardápios e Recomendações';

-- Criar índice para melhorar performance na ordenação por categoria
CREATE INDEX idx_cardapios_categoria ON public.cardapios_escolares(categoria);