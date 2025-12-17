-- Adicionar coluna data_abertura_processo para a data de abertura do processo
ALTER TABLE public.licitacoes
ADD COLUMN data_abertura_processo date DEFAULT NULL;