-- Adicionar 'terceirizados' ao enum tipo_documento_pessoal
ALTER TYPE tipo_documento_pessoal ADD VALUE IF NOT EXISTS 'terceirizados';