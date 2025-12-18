-- Adicionar valor 'outros' ao enum tipo_publicacao
ALTER TYPE public.tipo_publicacao ADD VALUE IF NOT EXISTS 'outros';