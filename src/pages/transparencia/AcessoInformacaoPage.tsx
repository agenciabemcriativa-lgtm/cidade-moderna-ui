import { ExternalLink, AlertCircle, MessageSquare, Search, HelpCircle, Phone, Mail, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const faqItems = [
  {
    question: 'O que é o Portal da Transparência?',
    answer: 'O Portal da Transparência é um canal de acesso público às informações sobre a gestão dos recursos públicos municipais, permitindo o acompanhamento e fiscalização pela população. É uma obrigação legal prevista na Lei de Acesso à Informação (Lei nº 12.527/2011) e na Lei Complementar nº 131/2009.'
  },
  {
    question: 'O que é o e-SIC?',
    answer: 'O e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) é o sistema que permite ao cidadão solicitar informações públicas que não estejam disponíveis no Portal da Transparência. Através dele, você pode fazer pedidos de informação e acompanhar o andamento das solicitações.'
  },
  {
    question: 'Qual o prazo para resposta às solicitações de informação?',
    answer: 'Conforme a Lei de Acesso à Informação, o órgão público tem até 20 dias corridos para responder, prorrogável por mais 10 dias mediante justificativa expressa. O prazo começa a contar a partir do registro do pedido no sistema.'
  },
  {
    question: 'Preciso me identificar para acessar as informações?',
    answer: 'Não. O acesso às informações públicas disponibilizadas neste portal é livre e não requer identificação ou cadastro. A identificação só é necessária para fazer solicitações através do e-SIC.'
  },
  {
    question: 'Como faço para solicitar informações que não encontrei no Portal?',
    answer: 'Você pode utilizar o e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) para fazer sua solicitação. Acesse o link do e-SIC disponível nesta página e preencha o formulário com sua pergunta. Você receberá um número de protocolo para acompanhamento.'
  },
  {
    question: 'Posso fazer denúncias ou reclamações pelo Portal da Transparência?',
    answer: 'O Portal da Transparência é voltado para consulta de informações. Para denúncias, reclamações ou sugestões, utilize a Ouvidoria Municipal, que possui canais específicos para esse tipo de manifestação.'
  },
  {
    question: 'Os dados do Portal são atualizados em tempo real?',
    answer: 'Conforme determina a Lei Complementar nº 131/2009, as informações sobre execução orçamentária e financeira devem ser disponibilizadas em tempo real. Os sistemas oficiais do município são alimentados pelos setores responsáveis seguindo essa determinação legal.'
  },
  {
    question: 'Onde encontro informações sobre licitações?',
    answer: 'As informações sobre licitações estão disponíveis na seção específica do Portal da Transparência. Você encontrará editais, resultados, contratos e demais documentos relacionados aos processos licitatórios do município.'
  },
];

export default function AcessoInformacaoPage() {
  return (
    <TransparenciaLayout 
      title="Acesso à Informação"
      description="e-SIC, Ouvidoria e informações sobre a Lei de Acesso à Informação"
    >
      {/* Destaque e-SIC */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <Badge className="mb-3 bg-primary/20 text-primary">
              <Shield className="w-3 h-3 mr-1" />
              Lei nº 12.527/2011
            </Badge>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Serviço de Informação ao Cidadão (e-SIC)
            </h2>
            <p className="text-muted-foreground mb-4">
              Solicite informações públicas. Acesso gratuito, sem necessidade de justificativa. Resposta em até 20 dias.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/transparencia/esic">
                <Button className="gap-2">
                  <Search className="w-4 h-4" />
                  Acessar Módulo e-SIC
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a 
                href="https://www.ipubi.pe.gov.br/esic/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  Sistema e-SIC
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/transparencia/esic">
          <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-all cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary rounded-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">e-SIC Completo</CardTitle>
                  <CardDescription>Sistema Eletrônico do Serviço de Informação ao Cidadão</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Saiba como solicitar informações, prazos legais, recursos administrativos, 
                FAQ completo e todas as orientações sobre a Lei de Acesso à Informação.
              </p>
              <Button className="w-full gap-2">
                Ver Módulo Completo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/contato">
          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-all cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ouvidoria Municipal</CardTitle>
                  <CardDescription>Canal para sugestões, elogios, reclamações e denúncias</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A Ouvidoria é o canal de comunicação entre o cidadão e a administração pública. 
                Registre manifestações, acompanhe respostas e contribua para a melhoria dos serviços.
              </p>
              <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-100">
                Acessar Ouvidoria
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Lei de Acesso à Informação */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Lei de Acesso à Informação (LAI)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            A Lei nº 12.527/2011 regulamenta o direito constitucional de acesso às informações públicas. 
            Esta norma entrou em vigor em 16 de maio de 2012 e criou mecanismos que possibilitam a qualquer 
            pessoa, física ou jurídica, sem necessidade de apresentar motivo, o recebimento de informações 
            públicas dos órgãos e entidades.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Transparência Ativa</h4>
              <p className="text-sm text-gray-600">
                É a divulgação espontânea de informações de interesse público, independentemente de solicitação.
                O Portal da Transparência é um exemplo de transparência ativa.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Transparência Passiva</h4>
              <p className="text-sm text-gray-600">
                É a divulgação de informações mediante solicitação do cidadão através do e-SIC 
                (Sistema Eletrônico do Serviço de Informação ao Cidadão).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <a 
              href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Lei nº 12.527/2011 <ExternalLink className="w-3 h-3" />
            </a>
            <Link 
              to="/legislacao/lei-acesso-informacao"
              className="text-sm text-primary hover:underline"
            >
              Regulamentação Municipal
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contato do SIC */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Serviço de Informação ao Cidadão (SIC)</CardTitle>
          <CardDescription className="text-blue-700">
            Atendimento presencial para solicitações de informação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Telefone</p>
                <p className="text-blue-700">(87) 3881-1156</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">E-mail</p>
                <p className="text-blue-700">contato@ipubi.pe.gov.br</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Endereço:</strong> Praça Prof. Agamenon Magalhães, S/N - Centro - Ipubi/PE<br />
              <strong>Horário:</strong> Segunda a Sexta, das 8h às 14h
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </TransparenciaLayout>
  );
}
