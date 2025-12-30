import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ItemVerificacao {
  id: string;
  categoria: string;
  item: string;
  descricao: string;
  status: 'conforme' | 'parcial' | 'nao_conforme' | 'nao_aplicavel';
  detalhes: string;
  ultimaAtualizacao?: string;
  prazoLegal?: string;
  baseLegal: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface CategoriaVerificacao {
  id: string;
  nome: string;
  icone: string;
  totalItens: number;
  conformes: number;
  parciais: number;
  naoConformes: number;
  naoAplicaveis: number;
  percentualConformidade: number;
  itens: ItemVerificacao[];
}

export interface ResultadoVerificacao {
  dataVerificacao: string;
  scoreGeral: number;
  totalItens: number;
  conformes: number;
  parciais: number;
  naoConformes: number;
  categorias: CategoriaVerificacao[];
}

const getMesAtual = () => new Date().getMonth() + 1;
const getAnoAtual = () => new Date().getFullYear();
const getBimestreAtual = () => Math.ceil(getMesAtual() / 2);
const getQuadrimestreAtual = () => Math.ceil(getMesAtual() / 4);

// Verifica se há dados para o período atual
const verificarPeriodo = (
  dados: any[],
  tipo: 'mensal' | 'bimestral' | 'quadrimestral' | 'anual',
  campoMes = 'mes_referencia',
  campoAno = 'ano_referencia'
): { existe: boolean; ultimaData?: string } => {
  const anoAtual = getAnoAtual();
  const mesAtual = getMesAtual();

  let dadosFiltrados: any[] = [];

  switch (tipo) {
    case 'mensal':
      // Considera até 2 meses de atraso como parcial
      dadosFiltrados = dados.filter(d => 
        d[campoAno] === anoAtual && d[campoMes] >= mesAtual - 1
      );
      break;
    case 'bimestral':
      const bimestreAtual = getBimestreAtual();
      dadosFiltrados = dados.filter(d => {
        if (d[campoAno] !== anoAtual) return false;
        const bimestreDado = d.bimestre || Math.ceil(d[campoMes] / 2);
        return bimestreDado >= bimestreAtual - 1;
      });
      break;
    case 'quadrimestral':
      const quadrimestreAtual = getQuadrimestreAtual();
      dadosFiltrados = dados.filter(d => {
        if (d[campoAno] !== anoAtual) return false;
        const quadDado = d.quadrimestre || Math.ceil(d[campoMes] / 4);
        return quadDado >= quadrimestreAtual - 1;
      });
      break;
    case 'anual':
      dadosFiltrados = dados.filter(d => d[campoAno] === anoAtual);
      break;
  }

  const ultimoDado = dados.sort((a, b) => {
    const dataA = new Date(a[campoAno], (a[campoMes] || 1) - 1);
    const dataB = new Date(b[campoAno], (b[campoMes] || 1) - 1);
    return dataB.getTime() - dataA.getTime();
  })[0];

  return {
    existe: dadosFiltrados.length > 0,
    ultimaData: ultimoDado ? `${ultimoDado[campoMes] || 1}/${ultimoDado[campoAno]}` : undefined
  };
};

export function useAutoVerificacao() {
  return useQuery({
    queryKey: ['auto-verificacao'],
    queryFn: async (): Promise<ResultadoVerificacao> => {
      const categorias: CategoriaVerificacao[] = [];

      // 1. Folha de Pagamento (mensal)
      const { data: folhaPagamento } = await supabase
        .from('folha_pagamento')
        .select('*')
        .eq('publicado', true);

      const folhaCheck = verificarPeriodo(folhaPagamento || [], 'mensal');
      const itensFolha: ItemVerificacao[] = [{
        id: 'folha-pagamento',
        categoria: 'Pessoal',
        item: 'Folha de Pagamento',
        descricao: 'Publicação mensal da folha de pagamento dos servidores',
        status: folhaCheck.existe ? 'conforme' : 
          (folhaPagamento && folhaPagamento.length > 0) ? 'parcial' : 'nao_conforme',
        detalhes: folhaCheck.existe 
          ? `Última publicação: ${folhaCheck.ultimaData}` 
          : 'Folha do mês atual não publicada',
        ultimaAtualizacao: folhaCheck.ultimaData,
        prazoLegal: 'Até o 5º dia útil do mês subsequente',
        baseLegal: 'Art. 48-A, I da LC 101/2000 (LRF)',
        prioridade: 'alta'
      }];

      // 2. Remuneração de Agentes Políticos (mensal)
      const { data: remuneracaoAgentes } = await supabase
        .from('remuneracao_agentes')
        .select('*')
        .eq('publicado', true);

      const remuneracaoCheck = verificarPeriodo(remuneracaoAgentes || [], 'mensal');
      itensFolha.push({
        id: 'remuneracao-agentes',
        categoria: 'Pessoal',
        item: 'Remuneração de Agentes Políticos',
        descricao: 'Publicação mensal da remuneração de agentes políticos',
        status: remuneracaoCheck.existe ? 'conforme' : 
          (remuneracaoAgentes && remuneracaoAgentes.length > 0) ? 'parcial' : 'nao_conforme',
        detalhes: remuneracaoCheck.existe 
          ? `Última publicação: ${remuneracaoCheck.ultimaData}` 
          : 'Remuneração do mês atual não publicada',
        ultimaAtualizacao: remuneracaoCheck.ultimaData,
        prazoLegal: 'Atualização mensal',
        baseLegal: 'Art. 48-A, I da LC 101/2000 + LAI',
        prioridade: 'alta'
      });

      // Documentos de Pessoal
      const { data: docsPessoal } = await supabase
        .from('documentos_pessoal')
        .select('*')
        .eq('publicado', true);

      const docsPessoalCheck = verificarPeriodo(docsPessoal || [], 'mensal');
      itensFolha.push({
        id: 'docs-pessoal',
        categoria: 'Pessoal',
        item: 'Documentos de Pessoal',
        descricao: 'Atos de admissão, exoneração, aposentadoria, etc.',
        status: docsPessoalCheck.existe ? 'conforme' : 
          (docsPessoal && docsPessoal.length > 0) ? 'parcial' : 'nao_conforme',
        detalhes: docsPessoalCheck.existe 
          ? `Última publicação: ${docsPessoalCheck.ultimaData}` 
          : 'Sem documentos recentes',
        ultimaAtualizacao: docsPessoalCheck.ultimaData,
        prazoLegal: 'Publicação imediata após ato',
        baseLegal: 'Art. 37, II CF/88',
        prioridade: 'media'
      });

      categorias.push(calcularCategoriaStats('pessoal', 'Pessoal e Remuneração', 'Users', itensFolha));

      // 3. Relatórios Fiscais (RREO bimestral, RGF quadrimestral)
      const { data: relatoriosFiscais } = await supabase
        .from('relatorios_fiscais')
        .select('*')
        .eq('publicado', true);

      const rreoData = (relatoriosFiscais || []).filter(r => r.tipo === 'rreo');
      const rgfData = (relatoriosFiscais || []).filter(r => r.tipo === 'rgf');

      const rreoCheck = verificarPeriodo(rreoData, 'bimestral');
      const rgfCheck = verificarPeriodo(rgfData, 'quadrimestral');

      const itensRelatorios: ItemVerificacao[] = [
        {
          id: 'rreo',
          categoria: 'Relatórios Fiscais',
          item: 'RREO - Relatório Resumido da Execução Orçamentária',
          descricao: 'Publicação bimestral do RREO',
          status: rreoCheck.existe ? 'conforme' : 
            rreoData.length > 0 ? 'parcial' : 'nao_conforme',
          detalhes: rreoCheck.existe 
            ? `Bimestre atual publicado` 
            : `Último: ${rreoCheck.ultimaData || 'Nenhum'}`,
          ultimaAtualizacao: rreoCheck.ultimaData,
          prazoLegal: 'Até 30 dias após encerramento do bimestre',
          baseLegal: 'Art. 52 e 53 da LC 101/2000 (LRF)',
          prioridade: 'alta'
        },
        {
          id: 'rgf',
          categoria: 'Relatórios Fiscais',
          item: 'RGF - Relatório de Gestão Fiscal',
          descricao: 'Publicação quadrimestral do RGF',
          status: rgfCheck.existe ? 'conforme' : 
            rgfData.length > 0 ? 'parcial' : 'nao_conforme',
          detalhes: rgfCheck.existe 
            ? `Quadrimestre atual publicado` 
            : `Último: ${rgfCheck.ultimaData || 'Nenhum'}`,
          ultimaAtualizacao: rgfCheck.ultimaData,
          prazoLegal: 'Até 30 dias após encerramento do quadrimestre',
          baseLegal: 'Art. 54 e 55 da LC 101/2000 (LRF)',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('relatorios', 'Relatórios Fiscais', 'FileText', itensRelatorios));

      // 4. Licitações
      const { data: licitacoes } = await supabase
        .from('licitacoes')
        .select('*, documentos_licitacao(*)')
        .eq('publicado', true);

      const licitacoesAbertas = (licitacoes || []).filter(l => l.status === 'aberta' || l.status === 'em_andamento');
      const licitacoesSemDocs = licitacoesAbertas.filter(l => 
        !l.documentos_licitacao || l.documentos_licitacao.length === 0
      );

      const itensLicitacoes: ItemVerificacao[] = [
        {
          id: 'licitacoes-publicadas',
          categoria: 'Licitações',
          item: 'Licitações Publicadas',
          descricao: 'Divulgação das licitações em andamento',
          status: licitacoesAbertas.length > 0 || (licitacoes && licitacoes.length > 0) 
            ? 'conforme' : 'parcial',
          detalhes: `${licitacoesAbertas.length} licitações abertas, ${(licitacoes || []).length} total`,
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        },
        {
          id: 'licitacoes-docs',
          categoria: 'Licitações',
          item: 'Documentos de Licitações',
          descricao: 'Editais, atas e resultados anexados',
          status: licitacoesSemDocs.length === 0 && licitacoesAbertas.length > 0 
            ? 'conforme' 
            : licitacoesSemDocs.length > 0 ? 'parcial' : 'nao_aplicavel',
          detalhes: licitacoesSemDocs.length > 0 
            ? `${licitacoesSemDocs.length} licitações sem documentos anexados` 
            : 'Todos os documentos anexados',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('licitacoes', 'Licitações e Contratos', 'Gavel', itensLicitacoes));

      // 5. e-SIC
      const { data: esicSolicitacoes } = await supabase
        .from('esic_solicitacoes')
        .select('*');

      const esicPendentes = (esicSolicitacoes || []).filter(s => s.status === 'pendente');
      const esicAtrasadas = esicPendentes.filter(s => {
        const dataLimite = new Date(s.data_limite);
        return dataLimite < new Date();
      });
      const esicProximasVencer = esicPendentes.filter(s => {
        const dataLimite = new Date(s.data_limite);
        const diasRestantes = Math.ceil((dataLimite.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes > 0 && diasRestantes <= 5;
      });

      const itensEsic: ItemVerificacao[] = [
        {
          id: 'esic-sistema',
          categoria: 'e-SIC',
          item: 'Sistema e-SIC Operacional',
          descricao: 'Disponibilização de sistema para pedidos de informação',
          status: 'conforme',
          detalhes: 'Sistema e-SIC disponível e funcional',
          baseLegal: 'Art. 10 da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        },
        {
          id: 'esic-respostas',
          categoria: 'e-SIC',
          item: 'Respostas dentro do Prazo',
          descricao: 'Atendimento ao prazo de 20 dias (prorrogável por +10)',
          status: esicAtrasadas.length === 0 ? 'conforme' : 'nao_conforme',
          detalhes: esicAtrasadas.length > 0 
            ? `${esicAtrasadas.length} solicitações em atraso!` 
            : `${esicPendentes.length} pendentes dentro do prazo`,
          prazoLegal: '20 dias, prorrogável por mais 10 dias',
          baseLegal: 'Art. 11, §1º e §2º da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        },
        {
          id: 'esic-proximas',
          categoria: 'e-SIC',
          item: 'Solicitações Próximas do Prazo',
          descricao: 'Monitoramento de solicitações a vencer em 5 dias',
          status: esicProximasVencer.length === 0 ? 'conforme' : 'parcial',
          detalhes: esicProximasVencer.length > 0 
            ? `${esicProximasVencer.length} vencendo nos próximos 5 dias` 
            : 'Nenhuma solicitação próxima do prazo',
          baseLegal: 'Art. 11 da Lei 12.527/2011 (LAI)',
          prioridade: 'media'
        }
      ];

      categorias.push(calcularCategoriaStats('esic', 'e-SIC e Acesso à Informação', 'MessageSquare', itensEsic));

      // 6. Diárias e Passagens
      const { data: diarias } = await supabase
        .from('diarias_passagens')
        .select('*')
        .eq('publicado', true);

      const diariasCheck = verificarPeriodo(diarias || [], 'mensal');

      const itensDiarias: ItemVerificacao[] = [{
        id: 'diarias-passagens',
        categoria: 'Diárias',
        item: 'Diárias e Passagens',
        descricao: 'Publicação de diárias e passagens concedidas',
        status: diariasCheck.existe ? 'conforme' : 
          (diarias && diarias.length > 0) ? 'parcial' : 'nao_conforme',
        detalhes: diariasCheck.existe 
          ? `Última publicação: ${diariasCheck.ultimaData}` 
          : 'Sem publicações recentes',
        ultimaAtualizacao: diariasCheck.ultimaData,
        prazoLegal: 'Atualização contínua',
        baseLegal: 'Art. 8º, §1º, III da Lei 12.527/2011 (LAI)',
        prioridade: 'media'
      }];

      categorias.push(calcularCategoriaStats('diarias', 'Diárias e Passagens', 'Plane', itensDiarias));

      // 7. Obras Públicas
      const { data: obras } = await supabase
        .from('obras_publicas')
        .select('*')
        .eq('publicado', true);

      const obrasEmAndamento = (obras || []).filter(o => o.status === 'em_andamento');
      const obrasSemAtualizacao = obrasEmAndamento.filter(o => {
        if (!o.updated_at) return true;
        const diasDesdeAtualizacao = Math.ceil(
          (new Date().getTime() - new Date(o.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return diasDesdeAtualizacao > 30;
      });

      const itensObras: ItemVerificacao[] = [
        {
          id: 'obras-cadastradas',
          categoria: 'Obras',
          item: 'Obras Cadastradas',
          descricao: 'Registro de obras públicas',
          status: (obras && obras.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: `${(obras || []).length} obras cadastradas, ${obrasEmAndamento.length} em andamento`,
          baseLegal: 'Art. 8º, §1º, V da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        },
        {
          id: 'obras-atualizacao',
          categoria: 'Obras',
          item: 'Atualização de Andamento',
          descricao: 'Obras em andamento atualizadas nos últimos 30 dias',
          status: obrasSemAtualizacao.length === 0 && obrasEmAndamento.length > 0 
            ? 'conforme' 
            : obrasSemAtualizacao.length > 0 ? 'parcial' : 'nao_aplicavel',
          detalhes: obrasSemAtualizacao.length > 0 
            ? `${obrasSemAtualizacao.length} obras sem atualização há mais de 30 dias` 
            : 'Todas as obras atualizadas',
          prazoLegal: 'Atualização mensal recomendada',
          baseLegal: 'Art. 8º, §1º, V da Lei 12.527/2011 (LAI)',
          prioridade: 'media'
        }
      ];

      categorias.push(calcularCategoriaStats('obras', 'Obras Públicas', 'HardHat', itensObras));

      // 8. Patrimônio Público
      const { data: patrimonio } = await supabase
        .from('patrimonio_publico')
        .select('*')
        .eq('publicado', true);

      const itensPatrimonio: ItemVerificacao[] = [{
        id: 'patrimonio-inventario',
        categoria: 'Patrimônio',
        item: 'Inventário de Bens',
        descricao: 'Publicação do inventário de bens móveis e imóveis',
        status: (patrimonio && patrimonio.length > 0) ? 'conforme' : 'nao_conforme',
        detalhes: `${(patrimonio || []).length} bens cadastrados`,
        prazoLegal: 'Atualização anual',
        baseLegal: 'Art. 48, parágrafo único, II da LC 101/2000 (LRF)',
        prioridade: 'media'
      }];

      categorias.push(calcularCategoriaStats('patrimonio', 'Patrimônio Público', 'Building', itensPatrimonio));

      // 9. Emendas Parlamentares
      const { data: emendas } = await supabase
        .from('emendas_parlamentares')
        .select('*')
        .eq('publicado', true);

      const emendasCheck = verificarPeriodo(emendas || [], 'anual');

      const itensEmendas: ItemVerificacao[] = [{
        id: 'emendas-parlamentares',
        categoria: 'Emendas',
        item: 'Emendas Parlamentares',
        descricao: 'Publicação de emendas parlamentares recebidas',
        status: emendasCheck.existe ? 'conforme' : 
          (emendas && emendas.length > 0) ? 'parcial' : 'nao_conforme',
        detalhes: `${(emendas || []).length} emendas publicadas`,
        ultimaAtualizacao: emendasCheck.ultimaData,
        prazoLegal: 'Atualização quando houver recebimento',
        baseLegal: 'Art. 48-A, II da LC 101/2000 (LRF)',
        prioridade: 'media'
      }];

      categorias.push(calcularCategoriaStats('emendas', 'Emendas Parlamentares', 'Landmark', itensEmendas));

      // 10. Legislação
      const { data: legislacao } = await supabase
        .from('documentos_legislacao')
        .select('*');

      const temLeiOrganica = (legislacao || []).some(l => l.tipo === 'lei_organica');
      const temLDO = (legislacao || []).some(l => l.tipo === 'ldo');
      const temLOA = (legislacao || []).some(l => l.tipo === 'loa');
      const temPPA = (legislacao || []).some(l => l.tipo === 'ppa');

      const itensLegislacao: ItemVerificacao[] = [
        {
          id: 'lei-organica',
          categoria: 'Legislação',
          item: 'Lei Orgânica Municipal',
          descricao: 'Disponibilização da Lei Orgânica',
          status: temLeiOrganica ? 'conforme' : 'nao_conforme',
          detalhes: temLeiOrganica ? 'Documento disponível' : 'Documento não encontrado',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        },
        {
          id: 'ppa',
          categoria: 'Legislação',
          item: 'PPA - Plano Plurianual',
          descricao: 'Disponibilização do PPA vigente',
          status: temPPA ? 'conforme' : 'nao_conforme',
          detalhes: temPPA ? 'Documento disponível' : 'Documento não encontrado',
          baseLegal: 'Art. 48, caput da LC 101/2000 (LRF)',
          prioridade: 'alta'
        },
        {
          id: 'ldo',
          categoria: 'Legislação',
          item: 'LDO - Lei de Diretrizes Orçamentárias',
          descricao: 'Disponibilização da LDO vigente',
          status: temLDO ? 'conforme' : 'nao_conforme',
          detalhes: temLDO ? 'Documento disponível' : 'Documento não encontrado',
          baseLegal: 'Art. 48, caput da LC 101/2000 (LRF)',
          prioridade: 'alta'
        },
        {
          id: 'loa',
          categoria: 'Legislação',
          item: 'LOA - Lei Orçamentária Anual',
          descricao: 'Disponibilização da LOA vigente',
          status: temLOA ? 'conforme' : 'nao_conforme',
          detalhes: temLOA ? 'Documento disponível' : 'Documento não encontrado',
          baseLegal: 'Art. 48, caput da LC 101/2000 (LRF)',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('legislacao', 'Legislação e Planejamento', 'Scale', itensLegislacao));

      // 11. Estrutura Organizacional
      const { data: secretarias } = await supabase
        .from('secretarias')
        .select('*')
        .eq('ativo', true);

      const { data: orgaos } = await supabase
        .from('orgaos_administracao')
        .select('*')
        .eq('ativo', true);

      const itensEstrutura: ItemVerificacao[] = [
        {
          id: 'secretarias',
          categoria: 'Estrutura',
          item: 'Secretarias Cadastradas',
          descricao: 'Registro das secretarias municipais',
          status: (secretarias && secretarias.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: `${(secretarias || []).length} secretarias cadastradas`,
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011 (LAI)',
          prioridade: 'alta'
        },
        {
          id: 'orgaos',
          categoria: 'Estrutura',
          item: 'Órgãos da Administração',
          descricao: 'Registro dos órgãos da administração direta e indireta',
          status: (orgaos && orgaos.length > 0) ? 'conforme' : 'parcial',
          detalhes: `${(orgaos || []).length} órgãos cadastrados`,
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011 (LAI)',
          prioridade: 'media'
        }
      ];

      categorias.push(calcularCategoriaStats('estrutura', 'Estrutura Organizacional', 'Network', itensEstrutura));

      // 12. Publicações Oficiais
      const { data: publicacoes } = await supabase
        .from('publicacoes_oficiais')
        .select('*')
        .eq('publicado', true);

      const mesAtual = getMesAtual();
      const anoAtual = getAnoAtual();
      const publicacoesRecentes = (publicacoes || []).filter(p => {
        const dataPub = new Date(p.data_publicacao);
        return dataPub.getMonth() + 1 >= mesAtual - 1 && dataPub.getFullYear() === anoAtual;
      });

      const itensPublicacoes: ItemVerificacao[] = [{
        id: 'publicacoes-oficiais',
        categoria: 'Publicações',
        item: 'Publicações Oficiais',
        descricao: 'Leis, decretos, portarias e outros atos oficiais',
        status: publicacoesRecentes.length > 0 ? 'conforme' : 
          (publicacoes && publicacoes.length > 0) ? 'parcial' : 'nao_conforme',
        detalhes: `${(publicacoes || []).length} publicações totais, ${publicacoesRecentes.length} recentes`,
        prazoLegal: 'Publicação imediata após assinatura',
        baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011 (LAI)',
        prioridade: 'alta'
      }];

      categorias.push(calcularCategoriaStats('publicacoes', 'Publicações Oficiais', 'FileCheck', itensPublicacoes));

      // 13. Dados Abertos
      const { data: dadosAbertos } = await supabase
        .from('dados_abertos')
        .select('*')
        .eq('publicado', true);

      const itensDadosAbertos: ItemVerificacao[] = [{
        id: 'dados-abertos',
        categoria: 'Dados Abertos',
        item: 'Catálogo de Dados Abertos',
        descricao: 'Disponibilização de dados em formato aberto',
        status: (dadosAbertos && dadosAbertos.length > 0) ? 'conforme' : 'parcial',
        detalhes: `${(dadosAbertos || []).length} datasets disponíveis`,
        prazoLegal: 'Disponibilização contínua',
        baseLegal: 'Art. 8º, §3º da Lei 12.527/2011 (LAI)',
        prioridade: 'media'
      }];

      categorias.push(calcularCategoriaStats('dados-abertos', 'Dados Abertos', 'Database', itensDadosAbertos));

      // Calcular totais
      const totalItens = categorias.reduce((acc, cat) => acc + cat.totalItens, 0);
      const conformes = categorias.reduce((acc, cat) => acc + cat.conformes, 0);
      const parciais = categorias.reduce((acc, cat) => acc + cat.parciais, 0);
      const naoConformes = categorias.reduce((acc, cat) => acc + cat.naoConformes, 0);

      const itensValidos = totalItens - categorias.reduce((acc, cat) => acc + cat.naoAplicaveis, 0);
      const scoreGeral = itensValidos > 0 
        ? Math.round(((conformes + (parciais * 0.5)) / itensValidos) * 100)
        : 0;

      return {
        dataVerificacao: new Date().toISOString(),
        scoreGeral,
        totalItens,
        conformes,
        parciais,
        naoConformes,
        categorias
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

function calcularCategoriaStats(
  id: string,
  nome: string,
  icone: string,
  itens: ItemVerificacao[]
): CategoriaVerificacao {
  const conformes = itens.filter(i => i.status === 'conforme').length;
  const parciais = itens.filter(i => i.status === 'parcial').length;
  const naoConformes = itens.filter(i => i.status === 'nao_conforme').length;
  const naoAplicaveis = itens.filter(i => i.status === 'nao_aplicavel').length;
  const totalValidos = itens.length - naoAplicaveis;

  return {
    id,
    nome,
    icone,
    totalItens: itens.length,
    conformes,
    parciais,
    naoConformes,
    naoAplicaveis,
    percentualConformidade: totalValidos > 0 
      ? Math.round(((conformes + (parciais * 0.5)) / totalValidos) * 100)
      : 0,
    itens
  };
}
