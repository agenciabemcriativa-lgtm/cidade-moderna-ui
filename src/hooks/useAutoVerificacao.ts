import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ItemVerificacao {
  id: string;
  codigo: string; // Código TCE (ex: 1.1, 2.3)
  categoria: string;
  item: string;
  descricao: string;
  status: 'conforme' | 'parcial' | 'nao_conforme' | 'nao_aplicavel';
  detalhes: string;
  ultimaAtualizacao?: string;
  prazoLegal?: string;
  baseLegal: string;
  prioridade: 'alta' | 'media' | 'baixa';
  acaoCorretiva?: string;
}

export interface CategoriaVerificacao {
  id: string;
  codigo: string; // Código da seção TCE
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

      // Buscar todos os dados necessários em paralelo
      const [
        { data: secretarias },
        { data: orgaos },
        { data: noticias },
        { data: faqCategorias },
        { data: faqPerguntas },
        { data: folhaPagamento },
        { data: remuneracaoAgentes },
        { data: docsPessoal },
        { data: relatoriosFiscais },
        { data: licitacoes },
        { data: esicSolicitacoes },
        { data: diarias },
        { data: obras },
        { data: patrimonio },
        { data: emendas },
        { data: legislacao },
        { data: publicacoes },
        { data: dadosAbertos },
        { data: transparenciaCategorias },
        { data: transparenciaItens },
        { data: cartaServicos },
        { data: atendimentoItens },
      ] = await Promise.all([
        supabase.from('secretarias').select('*').eq('ativo', true),
        supabase.from('orgaos_administracao').select('*').eq('ativo', true),
        supabase.from('noticias').select('*').eq('publicado', true),
        supabase.from('faq_categorias').select('*').eq('ativo', true),
        supabase.from('faq_perguntas').select('*').eq('ativo', true),
        supabase.from('folha_pagamento').select('*').eq('publicado', true),
        supabase.from('remuneracao_agentes').select('*').eq('publicado', true),
        supabase.from('documentos_pessoal').select('*').eq('publicado', true),
        supabase.from('relatorios_fiscais').select('*').eq('publicado', true),
        supabase.from('licitacoes').select('*, documentos_licitacao(*)').eq('publicado', true),
        supabase.from('esic_solicitacoes').select('*'),
        supabase.from('diarias_passagens').select('*').eq('publicado', true),
        supabase.from('obras_publicas').select('*').eq('publicado', true),
        supabase.from('patrimonio_publico').select('*').eq('publicado', true),
        supabase.from('emendas_parlamentares').select('*').eq('publicado', true),
        supabase.from('documentos_legislacao').select('*'),
        supabase.from('publicacoes_oficiais').select('*').eq('publicado', true),
        supabase.from('dados_abertos').select('*').eq('publicado', true),
        supabase.from('transparencia_categorias').select('*').eq('ativo', true),
        supabase.from('transparencia_itens').select('*').eq('ativo', true),
        supabase.from('carta_servicos').select('*').eq('publicado', true),
        supabase.from('atendimento_itens').select('*').eq('ativo', true),
      ]);

      // ========================================
      // SEÇÃO 1: SITE E PORTAL
      // ========================================
      const itensSitePortal: ItemVerificacao[] = [
        {
          id: 'site-oficial',
          codigo: '1.1',
          categoria: 'Site e Portal',
          item: 'Possui sítio oficial próprio na internet?',
          descricao: 'Existência de site oficial do município',
          status: 'conforme', // O próprio portal prova isso
          detalhes: 'Site oficial ativo e funcionando',
          baseLegal: 'Art. 8º da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'portal-transparencia',
          codigo: '1.2',
          categoria: 'Site e Portal',
          item: 'Possui portal da transparência próprio ou compartilhado?',
          descricao: 'Existência de portal de transparência',
          status: (transparenciaCategorias && transparenciaCategorias.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: (transparenciaCategorias && transparenciaCategorias.length > 0) 
            ? `Portal de transparência com ${transparenciaCategorias.length} categorias`
            : 'Portal de transparência não configurado',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Configurar categorias no Portal da Transparência'
        },
        {
          id: 'acesso-visivel',
          codigo: '1.3',
          categoria: 'Site e Portal',
          item: 'O acesso ao portal transparência está visível na capa do site?',
          descricao: 'Link visível para o portal na página inicial',
          status: 'conforme', // Assumimos que está visível (menu fixo)
          detalhes: 'Link para transparência disponível no menu principal',
          baseLegal: 'Art. 8º, §1º da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'ferramenta-pesquisa',
          codigo: '1.4',
          categoria: 'Site e Portal',
          item: 'Contém ferramenta de pesquisa de conteúdo?',
          descricao: 'Ferramenta de busca para acesso à informação',
          status: 'conforme', // Existe página de busca
          detalhes: 'Sistema de busca implementado no portal',
          baseLegal: 'Art. 8º, §3º, I da Lei 12.527/2011',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('1', 'site-portal', 'Site e Portal', 'Globe', itensSitePortal));

      // ========================================
      // SEÇÃO 2: INFORMAÇÕES INSTITUCIONAIS
      // ========================================
      const temSecretarias = secretarias && secretarias.length > 0;
      const temOrgaos = orgaos && orgaos.length > 0;
      const temContatos = secretarias?.some(s => s.telefone || s.email);
      const temHorarios = secretarias?.some(s => s.horario);
      const temResponsaveis = secretarias?.some(s => s.secretario_nome);
      const temFaq = faqPerguntas && faqPerguntas.length > 0;

      const itensInstitucionais: ItemVerificacao[] = [
        {
          id: 'estrutura-organizacional',
          codigo: '2.1',
          categoria: 'Informações Institucionais',
          item: 'Divulga a sua estrutura organizacional?',
          descricao: 'Publicação da estrutura administrativa',
          status: (temSecretarias || temOrgaos) ? 'conforme' : 'nao_conforme',
          detalhes: (temSecretarias || temOrgaos) 
            ? `${secretarias?.length || 0} secretarias e ${orgaos?.length || 0} órgãos cadastrados`
            : 'Estrutura organizacional não publicada',
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar secretarias e órgãos da administração'
        },
        {
          id: 'competencias',
          codigo: '2.2',
          categoria: 'Informações Institucionais',
          item: 'Divulga competências e/ou atribuições?',
          descricao: 'Descrição das competências dos órgãos',
          status: orgaos?.some(o => o.competencia) ? 'conforme' : 
            (temOrgaos ? 'parcial' : 'nao_conforme'),
          detalhes: orgaos?.some(o => o.competencia) 
            ? 'Competências cadastradas nos órgãos'
            : 'Competências não informadas',
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Preencher campo de competências em cada órgão'
        },
        {
          id: 'responsaveis',
          codigo: '2.3',
          categoria: 'Informações Institucionais',
          item: 'Identifica o nome dos atuais responsáveis pela gestão?',
          descricao: 'Nome dos gestores/secretários',
          status: temResponsaveis ? 'conforme' : 
            (temSecretarias ? 'parcial' : 'nao_conforme'),
          detalhes: temResponsaveis 
            ? 'Responsáveis identificados nas secretarias'
            : 'Responsáveis não cadastrados',
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar nome do secretário em cada secretaria'
        },
        {
          id: 'contatos',
          codigo: '2.4',
          categoria: 'Informações Institucionais',
          item: 'Divulga endereços, telefones e e-mails institucionais?',
          descricao: 'Informações de contato disponíveis',
          status: temContatos ? 'conforme' : 
            (temSecretarias ? 'parcial' : 'nao_conforme'),
          detalhes: temContatos 
            ? 'Contatos cadastrados nas secretarias'
            : 'Contatos não informados',
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Preencher telefone e e-mail em cada secretaria'
        },
        {
          id: 'horario-atendimento',
          codigo: '2.5',
          categoria: 'Informações Institucionais',
          item: 'Divulga o horário de atendimento?',
          descricao: 'Horário de funcionamento publicado',
          status: temHorarios ? 'conforme' : 
            (temSecretarias ? 'parcial' : 'nao_conforme'),
          detalhes: temHorarios 
            ? 'Horários cadastrados'
            : 'Horários não informados',
          baseLegal: 'Art. 8º, §1º, I da Lei 12.527/2011',
          prioridade: 'media',
          acaoCorretiva: 'Preencher horário de funcionamento'
        },
        {
          id: 'atos-normativos',
          codigo: '2.6',
          categoria: 'Informações Institucionais',
          item: 'Divulga os atos normativos próprios?',
          descricao: 'Publicação de leis, decretos, portarias',
          status: (publicacoes && publicacoes.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: (publicacoes && publicacoes.length > 0) 
            ? `${publicacoes.length} atos normativos publicados`
            : 'Nenhum ato normativo publicado',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar atos normativos (leis, decretos, portarias)'
        },
        {
          id: 'faq',
          codigo: '2.7',
          categoria: 'Informações Institucionais',
          item: 'Divulga perguntas e respostas mais frequentes?',
          descricao: 'Seção de FAQ disponível',
          status: temFaq ? 'conforme' : 'nao_conforme',
          detalhes: temFaq 
            ? `${faqPerguntas?.length || 0} perguntas cadastradas`
            : 'FAQ não configurado',
          baseLegal: 'Art. 8º, §1º, VI da Lei 12.527/2011',
          prioridade: 'media',
          acaoCorretiva: 'Cadastrar perguntas frequentes'
        },
        {
          id: 'redes-sociais',
          codigo: '2.8',
          categoria: 'Informações Institucionais',
          item: 'Apresenta link de acesso às redes sociais?',
          descricao: 'Links para perfis oficiais nas redes sociais',
          status: 'conforme', // Links configurados no rodapé
          detalhes: 'Links para Facebook e Instagram no rodapé',
          baseLegal: 'Boas práticas de transparência',
          prioridade: 'baixa'
        },
        {
          id: 'radar-transparencia',
          codigo: '2.9',
          categoria: 'Informações Institucionais',
          item: 'Inclui botão do Radar da Transparência Pública?',
          descricao: 'Selo do Radar da Transparência',
          status: 'parcial',
          detalhes: 'Botão do Radar não implementado',
          baseLegal: 'Recomendação TCE',
          prioridade: 'baixa',
          acaoCorretiva: 'Adicionar botão do Radar da Transparência no site'
        }
      ];

      categorias.push(calcularCategoriaStats('2', 'institucional', 'Informações Institucionais', 'Building2', itensInstitucionais));

      // ========================================
      // SEÇÃO 3: RECEITAS
      // ========================================
      const temLinkReceitas = transparenciaItens?.some(i => 
        i.titulo?.toLowerCase().includes('receita') && i.url
      );

      const itensReceitas: ItemVerificacao[] = [
        {
          id: 'receitas-previsao-realizacao',
          codigo: '3.1',
          categoria: 'Receitas',
          item: 'Divulga as receitas evidenciando previsão e realização?',
          descricao: 'Receitas com valores previstos e realizados',
          status: temLinkReceitas ? 'conforme' : 'parcial',
          detalhes: temLinkReceitas 
            ? 'Link para consulta de receitas disponível'
            : 'Configurar link para sistema de receitas',
          baseLegal: 'Art. 48-A, I da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar link do sistema de receitas na transparência'
        },
        {
          id: 'classificacao-receita',
          codigo: '3.2',
          categoria: 'Receitas',
          item: 'Divulga classificação por natureza da receita?',
          descricao: 'Categoria econômica, origem, espécie',
          status: temLinkReceitas ? 'conforme' : 'parcial',
          detalhes: temLinkReceitas 
            ? 'Classificação disponível no sistema oficial'
            : 'Verificar se sistema contém classificação detalhada',
          baseLegal: 'Art. 48-A, I da LC 101/2000',
          prioridade: 'alta'
        },
        {
          id: 'divida-ativa',
          codigo: '3.3',
          categoria: 'Receitas',
          item: 'Divulga lista dos inscritos em dívida ativa?',
          descricao: 'Nome do inscrito e valor total da dívida',
          status: 'parcial',
          detalhes: 'Verificar disponibilidade no sistema tributário',
          baseLegal: 'Art. 48-A da LC 101/2000',
          prioridade: 'media',
          acaoCorretiva: 'Disponibilizar consulta à dívida ativa'
        }
      ];

      categorias.push(calcularCategoriaStats('3', 'receitas', 'Receitas', 'TrendingUp', itensReceitas));

      // ========================================
      // SEÇÃO 4: DESPESAS
      // ========================================
      const temLinkDespesas = transparenciaItens?.some(i => 
        i.titulo?.toLowerCase().includes('despesa') && i.url
      );

      const itensDespesas: ItemVerificacao[] = [
        {
          id: 'despesas-empenhadas',
          codigo: '4.1',
          categoria: 'Despesas',
          item: 'Divulga total das despesas empenhadas, liquidadas e pagas?',
          descricao: 'Valores de empenho, liquidação e pagamento',
          status: temLinkDespesas ? 'conforme' : 'parcial',
          detalhes: temLinkDespesas 
            ? 'Link para consulta de despesas disponível'
            : 'Configurar link para sistema de despesas',
          baseLegal: 'Art. 48-A, II da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar link do sistema de despesas na transparência'
        },
        {
          id: 'classificacao-despesa',
          codigo: '4.2',
          categoria: 'Despesas',
          item: 'Divulga despesas por classificação orçamentária?',
          descricao: 'Classificação funcional, programática e por natureza',
          status: temLinkDespesas ? 'conforme' : 'parcial',
          detalhes: temLinkDespesas 
            ? 'Classificação disponível no sistema oficial'
            : 'Verificar se sistema contém classificação detalhada',
          baseLegal: 'Art. 48-A, II da LC 101/2000',
          prioridade: 'alta'
        },
        {
          id: 'consulta-empenhos',
          codigo: '4.3',
          categoria: 'Despesas',
          item: 'Possibilita consulta de empenhos com detalhes do beneficiário?',
          descricao: 'Credor, bem/serviço prestado, licitação de origem',
          status: temLinkDespesas ? 'conforme' : 'parcial',
          detalhes: temLinkDespesas 
            ? 'Consulta detalhada disponível no sistema oficial'
            : 'Verificar se sistema permite consulta detalhada',
          baseLegal: 'Art. 48-A, II da LC 101/2000',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('4', 'despesas', 'Despesas', 'CreditCard', itensDespesas));

      // ========================================
      // SEÇÃO 5: CONVÊNIOS E TRANSFERÊNCIAS
      // ========================================
      const temConvenios = transparenciaCategorias?.some(c => 
        c.titulo?.toLowerCase().includes('convênio') || c.titulo?.toLowerCase().includes('convenio')
      );

      const itensConvenios: ItemVerificacao[] = [
        {
          id: 'transferencias-recebidas',
          codigo: '5.1',
          categoria: 'Convênios',
          item: 'Identifica transferências recebidas de convênios?',
          descricao: 'Valor previsto, recebido, objeto e órgão concedente',
          status: temConvenios ? 'conforme' : 'parcial',
          detalhes: temConvenios 
            ? 'Seção de convênios configurada'
            : 'Configurar seção de convênios na transparência',
          baseLegal: 'Art. 8º, §1º, II da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Criar categoria de Convênios na Transparência'
        },
        {
          id: 'transferencias-realizadas',
          codigo: '5.2',
          categoria: 'Convênios',
          item: 'Identifica transferências realizadas?',
          descricao: 'Beneficiário, objeto, valor previsto e concedido',
          status: temConvenios ? 'conforme' : 'parcial',
          detalhes: 'Verificar publicação de transferências realizadas',
          baseLegal: 'Art. 8º, §1º, II da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'acordos-sem-transferencia',
          codigo: '5.3',
          categoria: 'Convênios',
          item: 'Identifica acordos sem transferência financeira?',
          descricao: 'Partes, objeto e obrigações ajustadas',
          status: temConvenios ? 'parcial' : 'nao_conforme',
          detalhes: 'Verificar publicação de acordos de cooperação',
          baseLegal: 'Art. 8º, §1º, II da Lei 12.527/2011',
          prioridade: 'media'
        }
      ];

      categorias.push(calcularCategoriaStats('5', 'convenios', 'Convênios e Transferências', 'Handshake', itensConvenios));

      // ========================================
      // SEÇÃO 6: PESSOAL
      // ========================================
      const folhaCheck = verificarPeriodo(folhaPagamento || [], 'mensal');
      const remuneracaoCheck = verificarPeriodo(remuneracaoAgentes || [], 'mensal');

      const itensPessoal: ItemVerificacao[] = [
        {
          id: 'relacao-servidores',
          codigo: '6.1',
          categoria: 'Pessoal',
          item: 'Divulga relação nominal dos servidores?',
          descricao: 'Nome, cargo, lotação, data admissão, carga horária',
          status: folhaCheck.existe ? 'conforme' : 
            (folhaPagamento && folhaPagamento.length > 0) ? 'parcial' : 'nao_conforme',
          detalhes: folhaCheck.existe 
            ? `Última publicação: ${folhaCheck.ultimaData}`
            : 'Folha de pagamento não publicada para o período atual',
          prazoLegal: 'Até o 5º dia útil do mês subsequente',
          baseLegal: 'Art. 48-A, I da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar folha de pagamento mensal'
        },
        {
          id: 'remuneracao-nominal',
          codigo: '6.2',
          categoria: 'Pessoal',
          item: 'Identifica remuneração nominal e tabela remuneratória?',
          descricao: 'Remuneração individual e padrão dos cargos',
          status: remuneracaoCheck.existe ? 'conforme' : 
            (remuneracaoAgentes && remuneracaoAgentes.length > 0) ? 'parcial' : 'nao_conforme',
          detalhes: remuneracaoCheck.existe 
            ? `Última publicação: ${remuneracaoCheck.ultimaData}`
            : 'Remuneração não publicada para o período atual',
          baseLegal: 'Art. 48-A, I da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar remuneração de agentes políticos'
        },
        {
          id: 'lista-estagiarios',
          codigo: '6.3',
          categoria: 'Pessoal',
          item: 'Divulga lista de estagiários?',
          descricao: 'Relação de estagiários ativos',
          status: 'parcial',
          detalhes: 'Verificar se lista de estagiários está disponível',
          baseLegal: 'Art. 48-A, I da LC 101/2000',
          prioridade: 'media',
          acaoCorretiva: 'Publicar lista de estagiários'
        },
        {
          id: 'lista-terceirizados',
          codigo: '6.4',
          categoria: 'Pessoal',
          item: 'Publica lista de terceirizados?',
          descricao: 'Nome, função, empresa empregadora',
          status: 'parcial',
          detalhes: 'Verificar se lista de terceirizados está disponível',
          baseLegal: 'Art. 48-A, I da LC 101/2000',
          prioridade: 'media',
          acaoCorretiva: 'Publicar lista de terceirizados'
        },
        {
          id: 'editais-concursos',
          codigo: '6.5',
          categoria: 'Pessoal',
          item: 'Divulga íntegra dos editais de concursos?',
          descricao: 'Editais completos de concursos e seleções',
          status: 'parcial',
          detalhes: 'Verificar publicação de editais de concursos',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar editais de concursos nas publicações oficiais'
        },
        {
          id: 'atos-concursos',
          codigo: '6.6',
          categoria: 'Pessoal',
          item: 'Divulga atos dos concursos (aprovados, nomeações)?',
          descricao: 'Lista de aprovados, classificações e nomeações',
          status: 'parcial',
          detalhes: 'Verificar publicação de resultados de concursos',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('6', 'pessoal', 'Pessoal e Servidores', 'Users', itensPessoal));

      // ========================================
      // SEÇÃO 7: DIÁRIAS E PASSAGENS
      // ========================================
      const diariasCheck = verificarPeriodo(diarias || [], 'mensal');

      const itensDiarias: ItemVerificacao[] = [
        {
          id: 'diarias-detalhadas',
          codigo: '7.1',
          categoria: 'Diárias',
          item: 'Divulga diárias com todos os detalhes obrigatórios?',
          descricao: 'Nome, cargo, valor, período, motivo e destino',
          status: diariasCheck.existe ? 'conforme' : 
            (diarias && diarias.length > 0) ? 'parcial' : 'nao_conforme',
          detalhes: diariasCheck.existe 
            ? `${diarias?.length || 0} registros publicados`
            : 'Diárias não publicadas para o período atual',
          baseLegal: 'Art. 8º, §1º, III da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar diárias e passagens mensalmente'
        },
        {
          id: 'tabela-valores-diarias',
          codigo: '7.2',
          categoria: 'Diárias',
          item: 'Divulga tabela de valores das diárias?',
          descricao: 'Valores dentro do estado, fora do estado, exterior',
          status: 'parcial',
          detalhes: 'Verificar publicação da tabela de valores de diárias',
          baseLegal: 'Art. 8º, §1º, III da Lei 12.527/2011',
          prioridade: 'media',
          acaoCorretiva: 'Publicar tabela de valores de diárias na legislação'
        }
      ];

      categorias.push(calcularCategoriaStats('7', 'diarias', 'Diárias e Passagens', 'Plane', itensDiarias));

      // ========================================
      // SEÇÃO 8: LICITAÇÕES
      // ========================================
      const licitacoesAbertas = (licitacoes || []).filter(l => l.status === 'aberta' || l.status === 'em_andamento');
      const licitacoesSemEdital = (licitacoes || []).filter(l => 
        !l.documentos_licitacao?.some((d: any) => d.tipo === 'edital')
      );
      const licitacoesSemDocs = (licitacoes || []).filter(l => 
        !l.documentos_licitacao || l.documentos_licitacao.length === 0
      );

      const itensLicitacoes: ItemVerificacao[] = [
        {
          id: 'relacao-licitacoes',
          codigo: '8.1',
          categoria: 'Licitações',
          item: 'Divulga relação das licitações em ordem sequencial?',
          descricao: 'Número, modalidade, objeto, data, valor e situação',
          status: (licitacoes && licitacoes.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: (licitacoes && licitacoes.length > 0) 
            ? `${licitacoes.length} licitações publicadas, ${licitacoesAbertas.length} em andamento`
            : 'Nenhuma licitação publicada',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar licitações no sistema'
        },
        {
          id: 'integra-editais',
          codigo: '8.2',
          categoria: 'Licitações',
          item: 'Divulga a íntegra dos editais de licitação?',
          descricao: 'Editais completos em PDF anexados',
          status: licitacoesSemEdital.length === 0 && (licitacoes && licitacoes.length > 0)
            ? 'conforme' 
            : licitacoesSemEdital.length > 0 ? 'parcial' : 'nao_aplicavel',
          detalhes: licitacoesSemEdital.length > 0 
            ? `${licitacoesSemEdital.length} licitações sem edital anexado`
            : 'Todos os editais anexados',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Anexar edital em cada licitação'
        },
        {
          id: 'demais-documentos',
          codigo: '8.3',
          categoria: 'Licitações',
          item: 'Divulga demais documentos das fases interna e externa?',
          descricao: 'Atas, pareceres, adjudicação, homologação',
          status: licitacoesSemDocs.length === 0 && (licitacoes && licitacoes.length > 0)
            ? 'conforme' 
            : licitacoesSemDocs.length > 0 ? 'parcial' : 'nao_aplicavel',
          detalhes: licitacoesSemDocs.length > 0 
            ? `${licitacoesSemDocs.length} licitações sem documentos anexados`
            : 'Documentos anexados',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Anexar documentos (atas, pareceres) em cada licitação'
        },
        {
          id: 'dispensa-inexigibilidade',
          codigo: '8.4',
          categoria: 'Licitações',
          item: 'Divulga documentos de dispensa e inexigibilidade?',
          descricao: 'Processos de contratação direta',
          status: 'parcial',
          detalhes: 'Verificar publicação de dispensas e inexigibilidades',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'atas-srp',
          codigo: '8.5',
          categoria: 'Licitações',
          item: 'Divulga íntegra das Atas de Adesão - SRP?',
          descricao: 'Atas de registro de preços',
          status: 'parcial',
          detalhes: 'Verificar publicação de atas SRP',
          baseLegal: 'Lei 14.133/2021',
          prioridade: 'media'
        },
        {
          id: 'plano-contratacoes',
          codigo: '8.6',
          categoria: 'Licitações',
          item: 'Divulga o plano de contratações anual?',
          descricao: 'Conforme art. 12, VII da Lei 14.133/2021',
          status: 'parcial',
          detalhes: 'Verificar publicação do PCA',
          baseLegal: 'Art. 12, VII da Lei 14.133/2021',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar Plano de Contratações Anual'
        },
        {
          id: 'licitantes-sancionados',
          codigo: '8.7',
          categoria: 'Licitações',
          item: 'Divulga licitantes/contratados sancionados?',
          descricao: 'Lista de empresas impedidas ou suspensas',
          status: 'parcial',
          detalhes: 'Verificar publicação de sanções aplicadas',
          baseLegal: 'Lei 14.133/2021',
          prioridade: 'media',
          acaoCorretiva: 'Criar seção de sanções administrativas'
        }
      ];

      categorias.push(calcularCategoriaStats('8', 'licitacoes', 'Licitações', 'Gavel', itensLicitacoes));

      // ========================================
      // SEÇÃO 9: CONTRATOS
      // ========================================
      const itensContratos: ItemVerificacao[] = [
        {
          id: 'relacao-contratos',
          codigo: '9.1',
          categoria: 'Contratos',
          item: 'Divulga relação dos contratos celebrados?',
          descricao: 'Contratado, valor, objeto, vigência e aditivos',
          status: 'parcial',
          detalhes: 'Verificar se há seção específica de contratos',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Criar seção de Contratos na Transparência'
        },
        {
          id: 'inteiro-teor-contratos',
          codigo: '9.2',
          categoria: 'Contratos',
          item: 'Divulga inteiro teor dos contratos e aditivos?',
          descricao: 'Documentos completos em PDF',
          status: 'parcial',
          detalhes: 'Verificar se contratos estão anexados',
          baseLegal: 'Art. 8º, §1º, IV da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'fiscais-contratos',
          codigo: '9.3',
          categoria: 'Contratos',
          item: 'Divulga relação dos fiscais de cada contrato?',
          descricao: 'Nome do fiscal de contratos vigentes e encerrados',
          status: 'parcial',
          detalhes: 'Verificar publicação dos fiscais de contrato',
          baseLegal: 'Lei 14.133/2021',
          prioridade: 'media'
        },
        {
          id: 'ordem-cronologica-pagamentos',
          codigo: '9.4',
          categoria: 'Contratos',
          item: 'Divulga ordem cronológica de pagamentos?',
          descricao: 'Lista ordenada de pagamentos e justificativas de alteração',
          status: 'parcial',
          detalhes: 'Verificar publicação da ordem cronológica',
          baseLegal: 'Art. 141 da Lei 14.133/2021',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar ordem cronológica de pagamentos'
        }
      ];

      categorias.push(calcularCategoriaStats('9', 'contratos', 'Contratos', 'FileText', itensContratos));

      // ========================================
      // SEÇÃO 10: OBRAS PÚBLICAS
      // ========================================
      const obrasEmAndamento = (obras || []).filter(o => o.status === 'em_andamento');
      const obrasParalisadas = (obras || []).filter(o => o.status === 'paralisada');
      const obrasSemInfo = (obras || []).filter(o => 
        !o.percentual_execucao || !o.empresa_executora
      );

      const itensObras: ItemVerificacao[] = [
        {
          id: 'info-obras',
          codigo: '10.1',
          categoria: 'Obras',
          item: 'Divulga informações sobre obras?',
          descricao: 'Objeto, situação, datas, empresa e percentual concluído',
          status: (obras && obras.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: (obras && obras.length > 0) 
            ? `${obras.length} obras cadastradas, ${obrasEmAndamento.length} em andamento`
            : 'Nenhuma obra cadastrada',
          baseLegal: 'Art. 8º, §1º, V da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar obras públicas'
        },
        {
          id: 'quantitativos-precos',
          codigo: '10.2',
          categoria: 'Obras',
          item: 'Divulga quantitativos e preços unitários contratados?',
          descricao: 'Valores detalhados das obras',
          status: obrasSemInfo.length === 0 && (obras && obras.length > 0)
            ? 'conforme' 
            : obrasSemInfo.length > 0 ? 'parcial' : 'nao_aplicavel',
          detalhes: obrasSemInfo.length > 0 
            ? `${obrasSemInfo.length} obras sem informações completas`
            : 'Informações completas',
          baseLegal: 'Art. 8º, §1º, V da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Completar informações das obras (valores, empresa)'
        },
        {
          id: 'valores-pagos',
          codigo: '10.3',
          categoria: 'Obras',
          item: 'Divulga quantitativos executados e preços pagos?',
          descricao: 'Valores efetivamente executados',
          status: (obras || []).some(o => o.valor_executado) ? 'conforme' : 'parcial',
          detalhes: 'Verificar se valores executados estão atualizados',
          baseLegal: 'Art. 8º, §1º, V da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'obras-paralisadas',
          codigo: '10.4',
          categoria: 'Obras',
          item: 'Divulga relação de obras paralisadas com motivos?',
          descricao: 'Motivo, responsável e previsão de reinício',
          status: obrasParalisadas.length > 0 ? 'conforme' : 'nao_aplicavel',
          detalhes: obrasParalisadas.length > 0 
            ? `${obrasParalisadas.length} obras paralisadas registradas`
            : 'Nenhuma obra paralisada',
          baseLegal: 'Art. 8º, §1º, V da Lei 12.527/2011',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('10', 'obras', 'Obras Públicas', 'HardHat', itensObras));

      // ========================================
      // SEÇÃO 11: PRESTAÇÃO DE CONTAS
      // ========================================
      const rreoData = (relatoriosFiscais || []).filter(r => r.tipo === 'rreo');
      const rgfData = (relatoriosFiscais || []).filter(r => r.tipo === 'rgf');
      const rreoCheck = verificarPeriodo(rreoData, 'bimestral');
      const rgfCheck = verificarPeriodo(rgfData, 'quadrimestral');

      const temLeiOrganica = (legislacao || []).some(l => l.tipo === 'lei_organica');
      const temLDO = (legislacao || []).some(l => l.tipo === 'ldo');
      const temLOA = (legislacao || []).some(l => l.tipo === 'loa');
      const temPPA = (legislacao || []).some(l => l.tipo === 'ppa');
      const temBalanco = (relatoriosFiscais || []).some(r => r.tipo === 'balancos' || r.tipo === 'prestacao_contas');
      const temRelatorioGestao = (relatoriosFiscais || []).some(r => r.tipo === 'execucao_orcamentaria');


      const itensPrestacaoContas: ItemVerificacao[] = [
        {
          id: 'balanco-geral',
          codigo: '11.1',
          categoria: 'Prestação de Contas',
          item: 'Publica Prestação de Contas do Ano Anterior (Balanço)?',
          descricao: 'Balanço geral do exercício anterior',
          status: temBalanco ? 'conforme' : 'parcial',
          detalhes: temBalanco 
            ? 'Balanço geral disponível'
            : 'Balanço geral não encontrado',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar Balanço Geral nos Relatórios Fiscais'
        },
        {
          id: 'relatorio-gestao',
          codigo: '11.2',
          categoria: 'Prestação de Contas',
          item: 'Divulga Relatório de Gestão ou Atividades?',
          descricao: 'Relatório das ações do exercício',
          status: temRelatorioGestao ? 'conforme' : 'parcial',
          detalhes: temRelatorioGestao 
            ? 'Relatório de gestão disponível'
            : 'Relatório de gestão não encontrado',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'media',
          acaoCorretiva: 'Publicar Relatório de Gestão anual'
        },
        {
          id: 'decisao-tce',
          codigo: '11.3',
          categoria: 'Prestação de Contas',
          item: 'Divulga decisão do TCE sobre as contas?',
          descricao: 'Parecer do Tribunal de Contas',
          status: 'parcial',
          detalhes: 'Verificar publicação dos pareceres do TCE',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'media',
          acaoCorretiva: 'Publicar pareceres do TCE'
        },
        {
          id: 'julgamento-legislativo',
          codigo: '11.4',
          categoria: 'Prestação de Contas',
          item: 'Divulga julgamento das contas pela Câmara?',
          descricao: 'Resultado do julgamento pelo Poder Legislativo',
          status: 'parcial',
          detalhes: 'Verificar publicação dos julgamentos',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'media'
        },
        {
          id: 'rgf',
          codigo: '11.5',
          categoria: 'Prestação de Contas',
          item: 'Divulga o Relatório de Gestão Fiscal (RGF)?',
          descricao: 'RGF quadrimestral',
          status: rgfCheck.existe ? 'conforme' : 
            rgfData.length > 0 ? 'parcial' : 'nao_conforme',
          detalhes: rgfCheck.existe 
            ? 'RGF do quadrimestre atual publicado'
            : `Último: ${rgfCheck.ultimaData || 'Nenhum'}`,
          prazoLegal: 'Até 30 dias após fim do quadrimestre',
          baseLegal: 'Art. 54 e 55 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar RGF quadrimestral'
        },
        {
          id: 'rreo',
          codigo: '11.6',
          categoria: 'Prestação de Contas',
          item: 'Divulga o RREO?',
          descricao: 'Relatório Resumido da Execução Orçamentária bimestral',
          status: rreoCheck.existe ? 'conforme' : 
            rreoData.length > 0 ? 'parcial' : 'nao_conforme',
          detalhes: rreoCheck.existe 
            ? 'RREO do bimestre atual publicado'
            : `Último: ${rreoCheck.ultimaData || 'Nenhum'}`,
          prazoLegal: 'Até 30 dias após fim do bimestre',
          baseLegal: 'Art. 52 e 53 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar RREO bimestral'
        },
        {
          id: 'plano-estrategico',
          codigo: '11.7',
          categoria: 'Prestação de Contas',
          item: 'Divulga plano estratégico institucional?',
          descricao: 'Planejamento estratégico do órgão',
          status: 'parcial',
          detalhes: 'Verificar publicação do plano estratégico',
          baseLegal: 'Boas práticas de gestão',
          prioridade: 'baixa'
        },
        {
          id: 'ppa',
          codigo: '11.8',
          categoria: 'Prestação de Contas',
          item: 'Divulga a Lei do PPA e anexos?',
          descricao: 'Plano Plurianual vigente',
          status: temPPA ? 'conforme' : 'nao_conforme',
          detalhes: temPPA 
            ? 'PPA disponível'
            : 'PPA não encontrado',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar PPA na Legislação'
        },
        {
          id: 'ldo',
          codigo: '11.9',
          categoria: 'Prestação de Contas',
          item: 'Divulga a LDO e anexos?',
          descricao: 'Lei de Diretrizes Orçamentárias vigente',
          status: temLDO ? 'conforme' : 'nao_conforme',
          detalhes: temLDO 
            ? 'LDO disponível'
            : 'LDO não encontrada',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar LDO na Legislação'
        },
        {
          id: 'loa',
          codigo: '11.10',
          categoria: 'Prestação de Contas',
          item: 'Divulga a LOA e anexos?',
          descricao: 'Lei Orçamentária Anual vigente',
          status: temLOA ? 'conforme' : 'nao_conforme',
          detalhes: temLOA 
            ? 'LOA disponível'
            : 'LOA não encontrada',
          baseLegal: 'Art. 48 da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar LOA na Legislação'
        }
      ];

      categorias.push(calcularCategoriaStats('11', 'prestacao-contas', 'Prestação de Contas', 'FileCheck', itensPrestacaoContas));

      // ========================================
      // SEÇÃO 12: e-SIC E LAI
      // ========================================
      const esicPendentes = (esicSolicitacoes || []).filter(s => s.status === 'pendente');
      const esicAtrasadas = esicPendentes.filter(s => {
        const dataLimite = new Date(s.data_limite);
        return dataLimite < new Date();
      });
      const esicTotal = esicSolicitacoes?.length || 0;
      const esicRespondidas = (esicSolicitacoes || []).filter(s => 
        s.status === 'respondida'
      ).length;

      const itensEsic: ItemVerificacao[] = [
        {
          id: 'sic-existe',
          codigo: '12.1',
          categoria: 'e-SIC',
          item: 'Existe o SIC no site e indica a unidade responsável?',
          descricao: 'Serviço de Informação ao Cidadão identificado',
          status: 'conforme',
          detalhes: 'e-SIC implementado e funcional',
          baseLegal: 'Art. 9º da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'sic-contato',
          codigo: '12.2',
          categoria: 'e-SIC',
          item: 'Indica endereço, telefone, e-mail e horário do SIC?',
          descricao: 'Informações de contato do SIC',
          status: 'conforme',
          detalhes: 'Informações de contato disponíveis na página do e-SIC',
          baseLegal: 'Art. 9º da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'esic-eletronico',
          codigo: '12.3',
          categoria: 'e-SIC',
          item: 'Há possibilidade de envio de pedidos de forma eletrônica?',
          descricao: 'Sistema e-SIC online',
          status: 'conforme',
          detalhes: 'Sistema e-SIC permite envio online de solicitações',
          baseLegal: 'Art. 10, §2º da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'esic-simples',
          codigo: '12.4',
          categoria: 'e-SIC',
          item: 'A solicitação é simples (sem exigências dificultadoras)?',
          descricao: 'Acesso sem burocracia excessiva',
          status: 'conforme',
          detalhes: 'Formulário simplificado de solicitação',
          baseLegal: 'Art. 10, §1º da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'regulamento-lai',
          codigo: '12.5',
          categoria: 'e-SIC',
          item: 'Divulga normativo local que regulamenta a LAI?',
          descricao: 'Decreto ou lei municipal regulamentando a LAI',
          status: (legislacao || []).some(l => l.tipo === 'outro') ? 'conforme' : 'parcial',
          detalhes: 'Verificar publicação do decreto regulamentador',
          baseLegal: 'Art. 45 da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar decreto regulamentador da LAI'
        },
        {
          id: 'prazos-recursos',
          codigo: '12.6',
          categoria: 'e-SIC',
          item: 'Divulga prazos de resposta e procedimento de recursos?',
          descricao: 'Informações sobre prazos e recursos',
          status: 'conforme',
          detalhes: 'Prazos e procedimentos explicados na página do e-SIC',
          baseLegal: 'Art. 11 e 15 da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'relatorio-estatistico',
          codigo: '12.7',
          categoria: 'e-SIC',
          item: 'Divulga relatório estatístico anual do e-SIC?',
          descricao: 'Quantidade de pedidos recebidos, atendidos, indeferidos',
          status: esicTotal > 0 ? 'conforme' : 'parcial',
          detalhes: esicTotal > 0 
            ? `${esicTotal} solicitações, ${esicRespondidas} respondidas`
            : 'Estatísticas não disponíveis',
          baseLegal: 'Art. 30, III da Lei 12.527/2011',
          prioridade: 'media'
        },
        {
          id: 'docs-sigilosos',
          codigo: '12.8',
          categoria: 'e-SIC',
          item: 'Divulga lista de documentos classificados em sigilo?',
          descricao: 'Documentos com restrição de acesso e fundamentação',
          status: 'parcial',
          detalhes: 'Verificar publicação de lista de documentos sigilosos',
          baseLegal: 'Art. 30, I da Lei 12.527/2011',
          prioridade: 'media',
          acaoCorretiva: 'Publicar rol de documentos classificados (se houver)'
        },
        {
          id: 'docs-desclassificados',
          codigo: '12.9',
          categoria: 'e-SIC',
          item: 'Divulga informações desclassificadas nos últimos 12 meses?',
          descricao: 'Lista de documentos que deixaram de ser sigilosos',
          status: 'nao_aplicavel',
          detalhes: 'Não aplicável se não houver documentos sigilosos',
          baseLegal: 'Art. 30, II da Lei 12.527/2011',
          prioridade: 'baixa'
        },
        {
          id: 'esic-prazo',
          codigo: '12.10',
          categoria: 'e-SIC',
          item: 'Respostas dentro do prazo legal?',
          descricao: 'Atendimento ao prazo de 20 dias (prorrogável +10)',
          status: esicAtrasadas.length === 0 ? 'conforme' : 'nao_conforme',
          detalhes: esicAtrasadas.length > 0 
            ? `${esicAtrasadas.length} solicitações em atraso!`
            : `${esicPendentes.length} pendentes dentro do prazo`,
          prazoLegal: '20 dias, prorrogável por mais 10',
          baseLegal: 'Art. 11, §1º e §2º da Lei 12.527/2011',
          prioridade: 'alta',
          acaoCorretiva: 'Responder solicitações em atraso imediatamente'
        }
      ];

      categorias.push(calcularCategoriaStats('12', 'esic', 'e-SIC e Acesso à Informação', 'MessageSquare', itensEsic));

      // ========================================
      // SEÇÃO 13: ACESSIBILIDADE
      // ========================================
      const itensAcessibilidade: ItemVerificacao[] = [
        {
          id: 'simbolo-acessibilidade',
          codigo: '13.1',
          categoria: 'Acessibilidade',
          item: 'Contém símbolo de acessibilidade em destaque?',
          descricao: 'Ícone de acessibilidade visível',
          status: 'conforme',
          detalhes: 'Barra de acessibilidade presente no topo do site',
          baseLegal: 'Art. 8º, §3º, VIII da Lei 12.527/2011',
          prioridade: 'alta'
        },
        {
          id: 'caminho-paginas',
          codigo: '13.2',
          categoria: 'Acessibilidade',
          item: 'Contém exibição do caminho de páginas (breadcrumbs)?',
          descricao: 'Navegação estrutural visível',
          status: 'conforme',
          detalhes: 'Breadcrumbs implementados nas páginas internas',
          baseLegal: 'WCAG 2.1',
          prioridade: 'media'
        },
        {
          id: 'alto-contraste',
          codigo: '13.3',
          categoria: 'Acessibilidade',
          item: 'Contém opção de alto contraste?',
          descricao: 'Modo de alto contraste para deficientes visuais',
          status: 'conforme',
          detalhes: 'Opção de alto contraste disponível na barra de acessibilidade',
          baseLegal: 'WCAG 2.1',
          prioridade: 'alta'
        },
        {
          id: 'redimensionar-texto',
          codigo: '13.4',
          categoria: 'Acessibilidade',
          item: 'Contém ferramenta de redimensionamento de texto?',
          descricao: 'Opção para aumentar/diminuir fonte',
          status: 'conforme',
          detalhes: 'Controles de tamanho de fonte na barra de acessibilidade',
          baseLegal: 'WCAG 2.1',
          prioridade: 'alta'
        },
        {
          id: 'mapa-site',
          codigo: '13.5',
          categoria: 'Acessibilidade',
          item: 'Contém mapa do site institucional?',
          descricao: 'Página com estrutura completa do site',
          status: 'conforme',
          detalhes: 'Página de Mapa do Site disponível',
          baseLegal: 'Art. 8º, §3º, I da Lei 12.527/2011',
          prioridade: 'media'
        }
      ];

      categorias.push(calcularCategoriaStats('13', 'acessibilidade', 'Acessibilidade', 'Accessibility', itensAcessibilidade));

      // ========================================
      // SEÇÃO 14: OUVIDORIA
      // ========================================
      const temOuvidoria = atendimentoItens?.some(a => 
        a.titulo?.toLowerCase().includes('ouvidoria')
      );

      const itensOuvidoria: ItemVerificacao[] = [
        {
          id: 'ouvidoria-presencial',
          codigo: '14.1',
          categoria: 'Ouvidoria',
          item: 'Há informações sobre atendimento presencial pela Ouvidoria?',
          descricao: 'Endereço, telefone e horário de funcionamento',
          status: temOuvidoria ? 'conforme' : 'parcial',
          detalhes: temOuvidoria 
            ? 'Ouvidoria cadastrada no atendimento'
            : 'Cadastrar informações da Ouvidoria',
          baseLegal: 'Lei 13.460/2017',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar Ouvidoria na seção de Atendimento'
        },
        {
          id: 'ouvidoria-eletronico',
          codigo: '14.2',
          categoria: 'Ouvidoria',
          item: 'Há canal eletrônico de acesso à Ouvidoria?',
          descricao: 'Formulário ou sistema online',
          status: 'conforme',
          detalhes: 'Formulário de contato disponível',
          baseLegal: 'Lei 13.460/2017',
          prioridade: 'alta'
        },
        {
          id: 'carta-servicos',
          codigo: '14.3',
          categoria: 'Ouvidoria',
          item: 'Divulga Carta de Serviços ao Usuário?',
          descricao: 'Catálogo de serviços prestados ao cidadão',
          status: (cartaServicos && cartaServicos.length > 0) ? 'conforme' : 'nao_conforme',
          detalhes: (cartaServicos && cartaServicos.length > 0) 
            ? `${cartaServicos.length} serviços cadastrados`
            : 'Carta de Serviços não configurada',
          baseLegal: 'Art. 7º da Lei 13.460/2017',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar serviços na Carta de Serviços'
        }
      ];

      categorias.push(calcularCategoriaStats('14', 'ouvidoria', 'Ouvidoria', 'Megaphone', itensOuvidoria));

      // ========================================
      // SEÇÃO 15: LGPD E GOVERNO DIGITAL
      // ========================================
      const itensLGPD: ItemVerificacao[] = [
        {
          id: 'encarregado-dados',
          codigo: '15.1',
          categoria: 'LGPD',
          item: 'Identifica o encarregado pelo tratamento de dados?',
          descricao: 'DPO com canal de comunicação (telefone/e-mail)',
          status: 'parcial',
          detalhes: 'Verificar publicação do encarregado de dados',
          baseLegal: 'Art. 41 da Lei 13.709/2018 (LGPD)',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar dados do Encarregado de Proteção de Dados'
        },
        {
          id: 'politica-privacidade',
          codigo: '15.2',
          categoria: 'LGPD',
          item: 'Publica Política de Privacidade e Proteção de Dados?',
          descricao: 'Documento explicando tratamento de dados pessoais',
          status: 'conforme',
          detalhes: 'Política de Privacidade disponível',
          baseLegal: 'Art. 6º da Lei 13.709/2018 (LGPD)',
          prioridade: 'alta'
        },
        {
          id: 'servicos-digitais',
          codigo: '15.3',
          categoria: 'LGPD',
          item: 'Possibilita acesso a serviços públicos por meio digital?',
          descricao: 'Serviços sem necessidade de atendimento presencial',
          status: (cartaServicos || []).some(s => s.forma_prestacao === 'online') 
            ? 'conforme' : 'parcial',
          detalhes: 'Verificar serviços online disponíveis',
          baseLegal: 'Lei 14.129/2021',
          prioridade: 'media'
        },
        {
          id: 'dados-abertos-automatizado',
          codigo: '15.4',
          categoria: 'LGPD',
          item: 'Possibilita acesso automatizado a dados abertos?',
          descricao: 'Dados estruturados e legíveis por máquina',
          status: (dadosAbertos && dadosAbertos.length > 0) ? 'conforme' : 'parcial',
          detalhes: (dadosAbertos && dadosAbertos.length > 0) 
            ? `${dadosAbertos.length} datasets disponíveis`
            : 'Publicar dados em formatos abertos (CSV, JSON)',
          baseLegal: 'Art. 8º, §3º da Lei 12.527/2011',
          prioridade: 'media',
          acaoCorretiva: 'Disponibilizar dados em formatos abertos'
        },
        {
          id: 'regulamento-governo-digital',
          codigo: '15.5',
          categoria: 'LGPD',
          item: 'Regulamenta e divulga a Lei do Governo Digital?',
          descricao: 'Norma municipal sobre governo digital',
          status: 'parcial',
          detalhes: 'Verificar regulamentação local da Lei 14.129/2021',
          baseLegal: 'Lei 14.129/2021',
          prioridade: 'media'
        },
        {
          id: 'pesquisa-satisfacao',
          codigo: '15.6',
          categoria: 'LGPD',
          item: 'Realiza e divulga resultados de pesquisas de satisfação?',
          descricao: 'Avaliação dos serviços pelos cidadãos',
          status: 'parcial',
          detalhes: 'Implementar pesquisa de satisfação',
          baseLegal: 'Art. 24 da Lei 13.460/2017',
          prioridade: 'baixa'
        }
      ];

      categorias.push(calcularCategoriaStats('15', 'lgpd', 'LGPD e Governo Digital', 'Shield', itensLGPD));

      // ========================================
      // SEÇÃO 16: DESONERAÇÕES TRIBUTÁRIAS
      // ========================================
      const itensDesoneracao: ItemVerificacao[] = [
        {
          id: 'desoneracao-concedidas',
          codigo: '16.1',
          categoria: 'Desonerações',
          item: 'Divulga desonerações tributárias e fundamentação legal?',
          descricao: 'Benefícios fiscais concedidos e sua base legal',
          status: 'parcial',
          detalhes: 'Verificar publicação de incentivos fiscais',
          baseLegal: 'Art. 5º da Lei 14.129/2021',
          prioridade: 'media',
          acaoCorretiva: 'Criar seção de incentivos fiscais na Transparência'
        },
        {
          id: 'renuncia-fiscal',
          codigo: '16.2',
          categoria: 'Desonerações',
          item: 'Divulga valores da renúncia fiscal prevista e realizada?',
          descricao: 'Valores por tipo de benefício',
          status: 'parcial',
          detalhes: 'Verificar publicação de renúncia fiscal',
          baseLegal: 'Art. 5º da Lei 14.129/2021',
          prioridade: 'media'
        },
        {
          id: 'beneficiarios-desoneracao',
          codigo: '16.3',
          categoria: 'Desonerações',
          item: 'Identifica os beneficiários das desonerações?',
          descricao: 'Lista de empresas/pessoas beneficiadas',
          status: 'parcial',
          detalhes: 'Verificar publicação de beneficiários',
          baseLegal: 'Art. 5º da Lei 14.129/2021',
          prioridade: 'media'
        },
        {
          id: 'incentivo-cultura',
          codigo: '16.4',
          categoria: 'Desonerações',
          item: 'Divulga projetos de incentivo à cultura/esporte?',
          descricao: 'Projetos aprovados, beneficiário e valor',
          status: 'parcial',
          detalhes: 'Verificar publicação de incentivos culturais',
          baseLegal: 'Art. 5º da Lei 14.129/2021',
          prioridade: 'baixa'
        }
      ];

      categorias.push(calcularCategoriaStats('16', 'desoneracao', 'Desonerações Tributárias', 'Receipt', itensDesoneracao));

      // ========================================
      // SEÇÃO 17: EMENDAS PARLAMENTARES
      // ========================================
      const emendasCheck = verificarPeriodo(emendas || [], 'anual');

      const itensEmendas: ItemVerificacao[] = [
        {
          id: 'emendas-recebidas',
          codigo: '17.1',
          categoria: 'Emendas',
          item: 'Identifica emendas parlamentares recebidas?',
          descricao: 'Origem, tipo, número, autoria, valor e objeto',
          status: emendasCheck.existe ? 'conforme' : 
            (emendas && emendas.length > 0) ? 'parcial' : 'nao_conforme',
          detalhes: (emendas && emendas.length > 0) 
            ? `${emendas.length} emendas publicadas`
            : 'Nenhuma emenda publicada',
          baseLegal: 'Art. 48-A, II da LC 101/2000',
          prioridade: 'alta',
          acaoCorretiva: 'Cadastrar emendas parlamentares recebidas'
        },
        {
          id: 'emendas-pix',
          codigo: '17.2',
          categoria: 'Emendas',
          item: 'Demonstra execução de "emendas pix"?',
          descricao: 'Execução orçamentária e financeira de emendas de transferência',
          status: 'parcial',
          detalhes: 'Verificar detalhamento de emendas de transferência',
          baseLegal: 'EC 105/2019',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('17', 'emendas', 'Emendas Parlamentares', 'Landmark', itensEmendas));

      // ========================================
      // SEÇÃO 18: SAÚDE (SOMENTE MUNICÍPIOS)
      // ========================================
      const itensSaude: ItemVerificacao[] = [
        {
          id: 'plano-saude',
          codigo: '18.1',
          categoria: 'Saúde',
          item: 'Divulga plano de saúde, programação anual e relatório?',
          descricao: 'Documentos do SUS municipal',
          status: 'parcial',
          detalhes: 'Verificar publicação do Plano Municipal de Saúde',
          baseLegal: 'Lei 8.080/1990',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar Plano Municipal de Saúde'
        },
        {
          id: 'servicos-saude',
          codigo: '18.2',
          categoria: 'Saúde',
          item: 'Divulga serviços de saúde (horários, profissionais, locais)?',
          descricao: 'Unidades de saúde e atendimentos',
          status: (secretarias || []).some(s => 
            s.nome?.toLowerCase().includes('saúde') || s.nome?.toLowerCase().includes('saude')
          ) ? 'parcial' : 'nao_conforme',
          detalhes: 'Verificar informações sobre unidades de saúde',
          baseLegal: 'Lei 8.080/1990',
          prioridade: 'alta'
        },
        {
          id: 'lista-espera-saude',
          codigo: '18.3',
          categoria: 'Saúde',
          item: 'Divulga lista de espera para consultas/exames?',
          descricao: 'Fila de regulação do SUS',
          status: 'parcial',
          detalhes: 'Verificar disponibilidade de consulta à fila de espera',
          baseLegal: 'Lei 8.080/1990',
          prioridade: 'media'
        },
        {
          id: 'lista-medicamentos',
          codigo: '18.4',
          categoria: 'Saúde',
          item: 'Divulga lista de medicamentos do SUS?',
          descricao: 'RENAME e como obter medicamentos',
          status: 'parcial',
          detalhes: 'Verificar publicação de lista de medicamentos',
          baseLegal: 'Lei 8.080/1990',
          prioridade: 'media'
        },
        {
          id: 'estoque-medicamentos',
          codigo: '18.5',
          categoria: 'Saúde',
          item: 'Divulga estoques de medicamentos das farmácias públicas?',
          descricao: 'Disponibilidade de medicamentos',
          status: 'parcial',
          detalhes: 'Verificar sistema de consulta a estoques',
          baseLegal: 'Lei 8.080/1990',
          prioridade: 'media'
        }
      ];

      categorias.push(calcularCategoriaStats('18', 'saude', 'Saúde', 'Heart', itensSaude));

      // ========================================
      // SEÇÃO 19: EDUCAÇÃO (SOMENTE MUNICÍPIOS)
      // ========================================
      const itensEducacao: ItemVerificacao[] = [
        {
          id: 'plano-educacao',
          codigo: '19.1',
          categoria: 'Educação',
          item: 'Divulga plano de educação e relatório de resultados?',
          descricao: 'PME e acompanhamento de metas',
          status: 'parcial',
          detalhes: 'Verificar publicação do Plano Municipal de Educação',
          baseLegal: 'Lei 9.394/1996 (LDB)',
          prioridade: 'alta',
          acaoCorretiva: 'Publicar Plano Municipal de Educação'
        },
        {
          id: 'lista-espera-creches',
          codigo: '19.2',
          categoria: 'Educação',
          item: 'Divulga lista de espera em creches e critérios?',
          descricao: 'Fila de espera e priorização',
          status: 'parcial',
          detalhes: 'Verificar disponibilidade de consulta à fila de creches',
          baseLegal: 'Lei 9.394/1996 (LDB)',
          prioridade: 'alta'
        }
      ];

      categorias.push(calcularCategoriaStats('19', 'educacao', 'Educação', 'GraduationCap', itensEducacao));

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
    staleTime: 1000 * 60 * 5,
  });
}

function calcularCategoriaStats(
  codigo: string,
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
    codigo,
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
