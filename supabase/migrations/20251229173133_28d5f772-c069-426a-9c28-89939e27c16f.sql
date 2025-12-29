-- Adicionar campo de data de postagem na folha de pagamento
ALTER TABLE public.folha_pagamento
ADD COLUMN data_postagem DATE NOT NULL DEFAULT CURRENT_DATE;