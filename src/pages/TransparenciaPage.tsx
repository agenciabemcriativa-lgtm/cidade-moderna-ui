import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users, 
  Calculator, 
  Handshake, 
  BarChart3, 
  MessageSquare,
  ExternalLink,
  Search,
  Shield,
  Scale,
  Clock,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import brasaoIpubi from '@/assets/brasao-ipubi.png';

const transparenciaCategories = [
  {
    id: 'despesas',
    title: 'Despesas Públicas',
    description: 'Execução orçamentária, pagamentos, empenhos e liquidações',
    icon: DollarSign,
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    iconColor: 'text-red-600',
    items: [
      { label: 'Execução Orçamentária', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Pagamentos', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Empenhos', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Liquidações', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
    ]
  },
  {
    id: 'receitas',
    title: 'Receitas Públicas',
    description: 'Arrecadação municipal, transferências e demonstrativos',
    icon: TrendingUp,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconColor: 'text-green-600',
    items: [
      { label: 'Arrecadação', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Transferências Recebidas', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Demonstrativos de Receita', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
    ]
  },
  {
    id: 'licitacoes',
    title: 'Licitações e Contratos',
    description: 'Processos licitatórios, contratos e aditivos',
    icon: FileText,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600',
    items: [
      { label: 'Licitações em Andamento', url: '/licitacoes', external: false },
      { label: 'Contratos Administrativos', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Aditivos Contratuais', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Atas de Registro de Preços', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
    ]
  },
  {
    id: 'pessoal',
    title: 'Servidores e Pessoal',
    description: 'Estrutura administrativa, cargos e folha de pagamento',
    icon: Users,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-600',
    items: [
      { label: 'Estrutura Administrativa', url: '/governo/estrutura-organizacional', external: false },
      { label: 'Cargos e Funções', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Folha de Pagamento', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Servidores Comissionados', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
    ]
  },
  {
    id: 'planejamento',
    title: 'Planejamento e Orçamento',
    description: 'PPA, LDO, LOA e instrumentos de planejamento',
    icon: Calculator,
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconColor: 'text-orange-600',
    items: [
      { label: 'Plano Plurianual (PPA)', url: '/legislacao/planejamento-orcamento', external: false },
      { label: 'Lei de Diretrizes Orçamentárias (LDO)', url: '/legislacao/planejamento-orcamento', external: false },
      { label: 'Lei Orçamentária Anual (LOA)', url: '/legislacao/planejamento-orcamento', external: false },
    ]
  },
  {
    id: 'convenios',
    title: 'Convênios e Parcerias',
    description: 'Convênios firmados, termos de colaboração e repasses',
    icon: Handshake,
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    iconColor: 'text-teal-600',
    items: [
      { label: 'Convênios Firmados', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Termos de Colaboração', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Repasses a Entidades', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
    ]
  },
  {
    id: 'relatorios',
    title: 'Relatórios Fiscais',
    description: 'RREO, RGF, pareceres e demonstrativos contábeis',
    icon: BarChart3,
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    iconColor: 'text-indigo-600',
    items: [
      { label: 'RREO - Relatório Resumido', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'RGF - Relatório de Gestão Fiscal', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Pareceres do TCE', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
      { label: 'Demonstrativos Contábeis', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', external: true },
    ]
  },
  {
    id: 'acesso',
    title: 'Acesso à Informação',
    description: 'e-SIC, Ouvidoria, LAI e perguntas frequentes',
    icon: MessageSquare,
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    iconColor: 'text-amber-600',
    items: [
      { label: 'e-SIC - Solicitação de Informação', url: 'https://www.ipubi.pe.gov.br/esic/', external: true },
      { label: 'Ouvidoria Municipal', url: '/contato', external: false },
      { label: 'Lei de Acesso à Informação', url: '/legislacao/lei-acesso-informacao', external: false },
      { label: 'Perguntas Frequentes', url: '#faq', external: false },
    ]
  },
];

const quickAccessLinks = [
  { label: 'Portal da Transparência (Sistema)', url: 'https://www.ipubi.pe.gov.br/portaldatransparencia/', icon: ExternalLink },
  { label: 'e-SIC', url: 'https://www.ipubi.pe.gov.br/esic/', icon: Search },
  { label: 'Licitações', url: '/licitacoes', icon: FileText },
  { label: 'Publicações Oficiais', url: '/publicacoes-oficiais', icon: FileText },
];

export default function TransparenciaPage() {
  useEffect(() => {
    document.title = 'Portal da Transparência | Prefeitura de Ipubi';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Diferenciado */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-2 text-xs text-gray-600 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <Link to="/" className="hover:text-primary transition-colors">
                  ← Voltar ao Portal Institucional
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Atualizado em: {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <img 
                  src={brasaoIpubi} 
                  alt="Brasão de Ipubi" 
                  className="h-16 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Portal da Transparência</h1>
                  <p className="text-sm text-gray-600">Prefeitura Municipal de Ipubi - PE</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                {quickAccessLinks.map((link) => (
                  link.url.startsWith('http') ? (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{link.label}</span>
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.url}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{link.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section - Clean and Informative */}
        <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6" />
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Transparência Ativa
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Acesso às Informações Públicas
                </h2>
                <p className="text-white/90 max-w-2xl">
                  Este portal centraliza o acesso às informações de transparência pública do Município de Ipubi, 
                  em conformidade com a Lei de Acesso à Informação (Lei nº 12.527/2011) e a Lei da Transparência 
                  (LC nº 131/2009).
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Acessar Sistema de Transparência
                </a>
                <a
                  href="https://www.ipubi.pe.gov.br/esic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/20 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                >
                  <Search className="w-5 h-5" />
                  Solicitar Informação (e-SIC)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Legal Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informação Importante</p>
                <p>
                  As informações detalhadas de natureza financeira, contábil e administrativa são disponibilizadas 
                  por meio dos sistemas oficiais de gestão utilizados pelo Município, alimentados pelos setores responsáveis.
                </p>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {transparenciaCategories.map((category) => (
              <Card 
                key={category.id} 
                className={`${category.color} border transition-all duration-200 hover:shadow-md`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {category.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-sm mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Separator className="mb-3 bg-gray-200" />
                  <ul className="space-y-2">
                    {category.items.map((item, index) => (
                      <li key={index}>
                        {item.external ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-sm text-gray-700 hover:text-primary transition-colors group"
                          >
                            <span>{item.label}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <Link
                            to={item.url}
                            className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors"
                          >
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legal Compliance Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Base Legal e Conformidade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Lei da Transparência</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Lei Complementar nº 131/2009 - Estabelece normas de transparência da gestão fiscal.
                </p>
                <a 
                  href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp131.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Consultar lei <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Lei de Acesso à Informação</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Lei nº 12.527/2011 - Regula o acesso a informações públicas.
                </p>
                <a 
                  href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Consultar lei <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Constituição Federal</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Art. 37 - Princípios da publicidade, eficiência e controle social.
                </p>
                <a 
                  href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Consultar <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">O que é o Portal da Transparência?</h4>
                <p className="text-sm text-gray-600">
                  É um canal de acesso público às informações sobre a gestão dos recursos públicos municipais, 
                  permitindo o acompanhamento e fiscalização pela população.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Como solicitar informações não disponíveis?</h4>
                <p className="text-sm text-gray-600">
                  Utilize o e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) para solicitar 
                  informações que não estejam disponíveis no portal.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Qual o prazo para resposta às solicitações?</h4>
                <p className="text-sm text-gray-600">
                  Conforme a LAI, o prazo é de até 20 dias corridos, prorrogável por mais 10 dias mediante justificativa.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">Preciso me identificar para acessar as informações?</h4>
                <p className="text-sm text-gray-600">
                  Não. O acesso às informações públicas disponibilizadas neste portal é livre e não requer identificação ou cadastro.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={brasaoIpubi} 
                    alt="Brasão de Ipubi" 
                    className="h-12 w-auto brightness-0 invert"
                  />
                  <div>
                    <h3 className="font-semibold">Portal da Transparência</h3>
                    <p className="text-sm text-gray-400">Prefeitura de Ipubi - PE</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Praça Prof. Agamenon Magalhães, S/N<br />
                  Centro - Ipubi/PE - CEP: 56260-000
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Links Úteis</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Portal Institucional
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Sistema de Transparência
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.ipubi.pe.gov.br/esic/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      e-SIC
                    </a>
                  </li>
                  <li>
                    <Link to="/contato" className="hover:text-white transition-colors">
                      Ouvidoria
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contato</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Telefone: (87) 3881-1156</li>
                  <li>E-mail: contato@ipubi.pe.gov.br</li>
                  <li>Horário: Segunda a Sexta, 8h às 14h</li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6 bg-gray-800" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <p>
                © {new Date().getFullYear()} Prefeitura Municipal de Ipubi. Todos os direitos reservados.
              </p>
              <p className="text-xs">
                As informações detalhadas são disponibilizadas pelos sistemas oficiais de gestão do Município.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}
