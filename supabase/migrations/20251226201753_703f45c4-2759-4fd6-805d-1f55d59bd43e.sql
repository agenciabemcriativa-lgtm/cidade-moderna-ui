-- Adicionar novos tipos ao enum tipo_relatorio_fiscal
ALTER TYPE tipo_relatorio_fiscal ADD VALUE IF NOT EXISTS 'balancos';
ALTER TYPE tipo_relatorio_fiscal ADD VALUE IF NOT EXISTS 'execucao_orcamentaria';
ALTER TYPE tipo_relatorio_fiscal ADD VALUE IF NOT EXISTS 'execucao_publicidade';