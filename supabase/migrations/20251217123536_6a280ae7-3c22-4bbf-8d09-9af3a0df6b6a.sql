-- Adicionar 'chamada_publica' ao enum modalidade_licitacao
ALTER TYPE modalidade_licitacao ADD VALUE IF NOT EXISTS 'chamada_publica';