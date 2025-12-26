import { Helmet } from "react-helmet";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  FileText, 
  Users, 
  Building2, 
  Scale, 
  Shield,
  Search,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "portal",
    title: "Sobre o Portal",
    icon: HelpCircle,
    questions: [
      {
        question: "O que é o Portal da Prefeitura de Ipubi?",
        answer: "O Portal da Prefeitura de Ipubi é o canal oficial de comunicação digital do município, oferecendo acesso a informações sobre a administração pública, serviços ao cidadão, notícias, licitações, transparência e muito mais. Foi desenvolvido para facilitar o acesso da população às informações e serviços públicos."
      },
      {
        question: "Como navegar no portal?",
        answer: "O portal possui uma estrutura organizada em seções principais: Governo (informações sobre a gestão), Município (dados sobre a cidade), Secretarias (informações de cada secretaria), Transparência (dados públicos), Legislação (leis e decretos) e Notícias (atualizações). Você também pode usar a barra de busca no topo da página para encontrar conteúdos específicos."
      },
      {
        question: "O portal funciona em dispositivos móveis?",
        answer: "Sim, o portal foi desenvolvido com design responsivo, adaptando-se automaticamente a diferentes tamanhos de tela, como smartphones, tablets e computadores. Você pode acessar todas as funcionalidades de qualquer dispositivo com acesso à internet."
      },
      {
        question: "Como utilizar os recursos de acessibilidade?",
        answer: "O portal oferece recursos de acessibilidade na barra superior, incluindo: ajuste do tamanho da fonte (A- e A+), modo de alto contraste para melhor visualização, e atalhos de navegação. Esses recursos foram implementados seguindo as diretrizes de acessibilidade web (WCAG)."
      },
      {
        question: "Onde encontro o Mapa do Site?",
        answer: "O Mapa do Site está disponível no rodapé do portal e também pode ser acessado diretamente pelo link /mapa-do-site. Ele apresenta a estrutura completa do portal, facilitando a localização de conteúdos específicos."
      }
    ]
  },
  {
    id: "transparencia",
    title: "Transparência Pública",
    icon: Shield,
    questions: [
      {
        question: "O que é o Portal da Transparência?",
        answer: "O Portal da Transparência é uma ferramenta de controle social que permite ao cidadão acompanhar a gestão dos recursos públicos. Nele você encontra informações sobre receitas, despesas, licitações, contratos, servidores, obras públicas, patrimônio e muito mais, conforme determina a Lei Complementar nº 131/2009 (Lei da Transparência) e a Lei nº 12.527/2011 (Lei de Acesso à Informação)."
      },
      {
        question: "Como consultar as despesas do município?",
        answer: "No Portal da Transparência, acesse a seção 'Despesas' onde você encontrará informações detalhadas sobre os gastos públicos, incluindo empenhos, liquidações e pagamentos, organizados por período, órgão, credor e elemento de despesa."
      },
      {
        question: "Como consultar as receitas do município?",
        answer: "Na seção 'Receitas' do Portal da Transparência, você encontra informações sobre a arrecadação municipal, incluindo receitas tributárias, transferências governamentais e outras fontes, organizadas por categoria e período."
      },
      {
        question: "O que são Dados Abertos?",
        answer: "Dados Abertos são informações públicas disponibilizadas em formatos que podem ser lidos e processados por máquinas (como CSV, JSON e XML), permitindo que cidadãos, pesquisadores e desenvolvedores analisem e reutilizem esses dados. É uma iniciativa de transparência e governo digital."
      },
      {
        question: "Como baixar dados em formatos abertos?",
        answer: "Na maioria das páginas de listagem do portal, você encontrará botões de exportação que permitem baixar os dados nos formatos CSV, JSON, XML e PDF. Além disso, a seção 'Dados Abertos' no Portal da Transparência oferece conjuntos de dados específicos para download."
      },
      {
        question: "O que são os Relatórios de Gestão Fiscal (RGF)?",
        answer: "Os Relatórios de Gestão Fiscal são documentos que demonstram o cumprimento dos limites estabelecidos pela Lei de Responsabilidade Fiscal, incluindo despesas com pessoal, dívida consolidada, garantias e operações de crédito. São publicados quadrimestralmente."
      },
      {
        question: "O que são os Relatórios Resumidos de Execução Orçamentária (RREO)?",
        answer: "Os RREO são relatórios bimestrais que apresentam o balanço orçamentário, demonstrativo da execução das despesas e receitas, e outros demonstrativos exigidos pela Lei de Responsabilidade Fiscal."
      }
    ]
  },
  {
    id: "esic",
    title: "e-SIC e Acesso à Informação",
    icon: MessageSquare,
    questions: [
      {
        question: "O que é o e-SIC?",
        answer: "O e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) é o canal oficial para solicitar informações públicas ao município, conforme garantido pela Lei de Acesso à Informação (Lei nº 12.527/2011). Através dele, qualquer pessoa pode solicitar dados e documentos que não estejam disponíveis no portal."
      },
      {
        question: "Como fazer uma solicitação pelo e-SIC?",
        answer: "Acesse a seção 'e-SIC' no Portal da Transparência, clique em 'Nova Solicitação', preencha o formulário com seus dados e descreva claramente a informação desejada. Você receberá um número de protocolo para acompanhamento."
      },
      {
        question: "Qual o prazo para resposta do e-SIC?",
        answer: "O órgão público tem até 20 dias corridos para responder, podendo prorrogar por mais 10 dias mediante justificativa. Em caso de indeferimento ou resposta insatisfatória, o cidadão pode apresentar recurso em até 10 dias."
      },
      {
        question: "Como acompanhar minha solicitação?",
        answer: "Acesse a opção 'Consultar Solicitação' no e-SIC e informe o número do protocolo e o e-mail cadastrado. Você poderá ver o status da solicitação, respostas e anexos disponíveis."
      },
      {
        question: "Posso solicitar qualquer informação?",
        answer: "A Lei de Acesso à Informação garante o direito de acesso a informações públicas, com exceções previstas em lei, como informações pessoais, sigilosas por lei específica, ou que comprometam a segurança da sociedade e do Estado."
      },
      {
        question: "Preciso justificar o motivo da solicitação?",
        answer: "Não. A Lei de Acesso à Informação garante que o cidadão não precisa justificar os motivos do pedido. Basta identificar-se e especificar a informação desejada."
      }
    ]
  },
  {
    id: "licitacoes",
    title: "Licitações e Contratos",
    icon: FileText,
    questions: [
      {
        question: "Como consultar as licitações em andamento?",
        answer: "Na página de Licitações do portal, você encontra todas as licitações do município, podendo filtrar por modalidade, status, ano e secretaria. Cada licitação possui página própria com todos os documentos disponíveis para download."
      },
      {
        question: "Como participar de uma licitação?",
        answer: "Consulte o edital da licitação de interesse para verificar os requisitos de participação, documentação necessária e prazos. Os editais podem ser baixados diretamente do portal. Em caso de dúvidas, utilize o e-mail de contato indicado no edital."
      },
      {
        question: "O que é Pregão Eletrônico?",
        answer: "Pregão Eletrônico é uma modalidade de licitação realizada pela internet, utilizada para aquisição de bens e serviços comuns. As sessões são realizadas em plataformas específicas indicadas nos editais."
      },
      {
        question: "Como obter certidões para participar de licitações?",
        answer: "As certidões necessárias variam conforme o edital. Certidões federais podem ser obtidas no site da Receita Federal, certidões estaduais no site da Secretaria da Fazenda do estado, e certidões municipais nos canais de atendimento da prefeitura."
      },
      {
        question: "Como consultar contratos firmados?",
        answer: "Os contratos firmados estão disponíveis no Portal da Transparência, onde você pode consultar dados como partes contratantes, objeto, valor, vigência e aditivos."
      }
    ]
  },
  {
    id: "servidores",
    title: "Servidores Públicos",
    icon: Users,
    questions: [
      {
        question: "Como consultar a folha de pagamento?",
        answer: "No Portal da Transparência, acesse a seção 'Servidores' onde estão disponíveis informações sobre a remuneração dos servidores públicos municipais, conforme determina a Lei de Acesso à Informação."
      },
      {
        question: "O que é a remuneração de agentes políticos?",
        answer: "A seção 'Remuneração de Agentes Políticos' apresenta os valores recebidos pelo Prefeito, Vice-Prefeito e Secretários Municipais, incluindo subsídio mensal, verbas de representação e outros valores."
      },
      {
        question: "Como acessar meu contracheque online?",
        answer: "O acesso ao contracheque online está disponível para servidores ativos através do link no rodapé do portal ou no sistema de recursos humanos. É necessário login e senha cadastrados."
      },
      {
        question: "Como consultar diárias e passagens?",
        answer: "Na seção 'Diárias e Passagens' do Portal da Transparência, você encontra informações sobre deslocamentos de servidores, incluindo beneficiário, destino, período, finalidade e valores."
      }
    ]
  },
  {
    id: "secretarias",
    title: "Secretarias e Atendimento",
    icon: Building2,
    questions: [
      {
        question: "Como encontrar informações de uma secretaria?",
        answer: "No menu 'Secretarias' você encontra a lista completa das secretarias municipais. Cada página de secretaria contém informações sobre o secretário responsável, endereço, telefone, e-mail e horário de funcionamento."
      },
      {
        question: "Qual o horário de funcionamento da prefeitura?",
        answer: "O horário de atendimento da Prefeitura de Ipubi é de segunda a sexta-feira, das 8h às 12h e das 14h às 17h. Algumas secretarias podem ter horários diferenciados, consulte a página específica de cada uma."
      },
      {
        question: "Como entrar em contato com a prefeitura?",
        answer: "Você pode entrar em contato pelo telefone (87) 3881-1156, pelo formulário de contato no portal, pelo e-SIC para solicitações de informação, ou presencialmente na Praça Professor Agamanon Magalhães, 56, Centro."
      },
      {
        question: "Como agendar atendimento?",
        answer: "Para alguns serviços é possível agendar atendimento. Consulte a seção 'Atendimento' do portal para verificar os serviços disponíveis e os canais de agendamento de cada secretaria."
      }
    ]
  },
  {
    id: "legislacao",
    title: "Legislação Municipal",
    icon: Scale,
    questions: [
      {
        question: "Onde encontro a Lei Orgânica do Município?",
        answer: "A Lei Orgânica do Município está disponível na seção 'Legislação', subseção 'Lei Orgânica'. É a lei maior do município, que estabelece sua organização política e administrativa."
      },
      {
        question: "Como consultar leis e decretos?",
        answer: "Na seção 'Legislação' você encontra as leis, decretos, portarias e outros atos normativos do município. Utilize os filtros de busca para encontrar documentos específicos por tipo, ano ou palavras-chave."
      },
      {
        question: "O que são PPA, LDO e LOA?",
        answer: "São instrumentos de planejamento orçamentário: o PPA (Plano Plurianual) define diretrizes para 4 anos; a LDO (Lei de Diretrizes Orçamentárias) estabelece metas anuais; e a LOA (Lei Orçamentária Anual) detalha receitas e despesas do ano."
      },
      {
        question: "Como acessar as Publicações Oficiais?",
        answer: "Na seção 'Publicações Oficiais' você encontra todos os atos publicados pelo município, incluindo leis, decretos, portarias, editais e comunicados, com filtros por tipo e período."
      },
      {
        question: "O que é a Lei de Acesso à Informação?",
        answer: "A Lei nº 12.527/2011 regulamenta o direito constitucional de acesso às informações públicas. Estabelece procedimentos para garantir que qualquer pessoa possa solicitar e receber informações dos órgãos públicos."
      }
    ]
  }
];

export default function PerguntasFrequentesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const totalQuestions = faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <>
      <Helmet>
        <title>Perguntas Frequentes - Prefeitura de Ipubi</title>
        <meta 
          name="description" 
          content="Encontre respostas para as perguntas mais frequentes sobre o Portal da Prefeitura de Ipubi, serviços públicos, transparência, licitações e muito mais." 
        />
      </Helmet>

      <AccessibilityBar />
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-12">
          <div className="container">
            <Breadcrumbs
              items={[{ label: "Perguntas Frequentes" }]}
              className="mb-6 text-primary-foreground/80"
            />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Perguntas Frequentes</h1>
                <p className="text-primary-foreground/80 mt-1">
                  Encontre respostas para as dúvidas mais comuns sobre o portal e serviços municipais
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-muted/50 border-b">
          <div className="container py-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar perguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-3">
                {searchTerm 
                  ? `${filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)} perguntas encontradas`
                  : `${totalQuestions} perguntas em ${faqCategories.length} categorias`
                }
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container py-12">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhuma pergunta encontrada</h2>
              <p className="text-muted-foreground">
                Tente buscar com outros termos ou navegue pelas categorias abaixo
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{category.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {category.questions.length} {category.questions.length === 1 ? 'pergunta' : 'perguntas'}
                      </p>
                    </div>
                  </div>
                  <Accordion type="single" collapsible className="px-6">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <span className="font-medium pr-4">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 border-t">
          <div className="container py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-3">Não encontrou o que procurava?</h2>
              <p className="text-muted-foreground mb-6">
                Utilize o e-SIC para solicitar informações ou entre em contato conosco
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/transparencia/esic" 
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Acessar e-SIC
                </a>
                <a 
                  href="/contato" 
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
