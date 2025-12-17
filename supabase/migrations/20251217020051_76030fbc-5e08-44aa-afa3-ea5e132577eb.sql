-- Adicionar campos para páginas de autoridades (Prefeito/Vice-prefeito)
ALTER TABLE public.governo_itens
ADD COLUMN conteudo TEXT,
ADD COLUMN foto_url TEXT,
ADD COLUMN nome_autoridade TEXT,
ADD COLUMN cargo TEXT,
ADD COLUMN telefone TEXT,
ADD COLUMN email TEXT,
ADD COLUMN endereco TEXT;