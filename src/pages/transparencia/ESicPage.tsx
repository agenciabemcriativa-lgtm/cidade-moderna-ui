import { ExternalLink, FileText, Clock, AlertTriangle, Phone, Mail, MapPin, HelpCircle, CheckCircle, ArrowRight, Shield, Users, Search, MessageSquare, Calendar, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// URL do sistema externo de e-SIC
const ESIC_URL = 'https://www.ipubi.pe.gov.br/esic/';

const passoASolicitacao = [
  {
    numero: 1,
    titulo: 'Acesse o sistema',
    descricao: 'Clique no botão "Acessar e-SIC" para entrar no sistema eletrônico oficial de solicitação de informações.'
  },
  {
    numero: 2,
    titulo: 'Faça seu cadastro ou login',
    descricao: 'Se for seu primeiro acesso, faça um cadastro simples informando nome, e-mail e telefone. Se já possui cadastro, faça login.'
  },
  {
    numero: 3,
    titulo: 'Registre sua solicitação',
    descricao: 'Descreva de forma clara e objetiva a informação que deseja. NÃO é necessário justificar o motivo do pedido.'
  },
  {
    numero: 4,
    titulo: 'Receba o protocolo',
    descricao: 'Após enviar, você receberá um número de protocolo para acompanhar sua solicitação.'
  },
  {
    numero: 5,
    titulo: 'Acompanhe e receba a resposta',
    descricao: 'A resposta será enviada em até 20 dias (prorrogável por mais 10). Acompanhe pelo sistema.'
  }
];

const faqESic = [
  {
    question: 'O que é o e-SIC?',
    answer: 'O e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) é uma ferramenta que permite a qualquer pessoa, física ou jurídica, solicitar acesso a informações públicas. É o canal oficial da Prefeitura de Ipubi para atendimento à Lei de Acesso à Informação (Lei nº 12.527/2011).'
  },
  {
    question: 'Quem pode solicitar informações?',
    answer: 'Qualquer pessoa, seja ela brasileira ou estrangeira, física ou jurídica, pode solicitar informações públicas. A Lei de Acesso à Informação garante esse direito a todos, sem distinção.'
  },
  {
    question: 'Preciso me identificar para fazer um pedido?',
    answer: 'Sim, é necessário se identificar com nome e um meio de contato (e-mail ou telefone) para que possamos enviar a resposta. Contudo, a Lei proíbe que seja exigida justificativa para o pedido de informação.'
  },
  {
    question: 'O pedido de informação é gratuito?',
    answer: 'Sim, o pedido de informação é totalmente gratuito. Só haverá cobrança nos casos de reprodução de documentos, sendo cobrado apenas o custo do material utilizado (papel, tinta, etc.).'
  },
  {
    question: 'Preciso justificar meu pedido de informação?',
    answer: 'NÃO. A Lei nº 12.527/2011 (art. 10, §3º) veda expressamente que seja exigida motivação para o pedido de acesso à informação. Você não precisa explicar por que deseja a informação.'
  },
  {
    question: 'Qual o prazo para receber resposta?',
    answer: 'O prazo legal é de até 20 dias corridos, podendo ser prorrogado por mais 10 dias mediante justificativa expressa. O prazo começa a contar a partir do registro do pedido no sistema.'
  },
  {
    question: 'O que fazer se o pedido não for respondido no prazo?',
    answer: 'Se não receber resposta dentro do prazo, você tem direito de interpor recurso administrativo. O recurso deve ser dirigido à autoridade hierarquicamente superior à que emitiu a decisão (ou deveria ter respondido).'
  },
  {
    question: 'Posso recorrer de uma resposta que considero insatisfatória?',
    answer: 'Sim. Caso discorde da resposta recebida, você pode interpor recurso no prazo de 10 dias a contar da ciência da decisão. O recurso será analisado por autoridade hierarquicamente superior.'
  },
  {
    question: 'Que tipo de informação NÃO pode ser solicitada?',
    answer: 'Informações classificadas como sigilosas (ultrassecreta, secreta ou reservada), dados pessoais de terceiros e informações protegidas por sigilo legal específico (fiscal, bancário, comercial, etc.).'
  },
  {
    question: 'O sistema e-SIC é oficial e seguro?',
    answer: 'Sim. O sistema é oficial, as solicitações são registradas, controladas e auditáveis. Todos os pedidos recebem número de protocolo e as respostas ficam documentadas para fins de fiscalização.'
  },
  {
    question: 'Qual a diferença entre o e-SIC e a Ouvidoria?',
    answer: 'O e-SIC é para solicitar informações públicas (transparência passiva). A Ouvidoria é para registrar manifestações como reclamações, sugestões, elogios ou denúncias sobre os serviços públicos.'
  },
  {
    question: 'Onde encontro informações sem precisar solicitar?',
    answer: 'Muitas informações já estão disponíveis no Portal da Transparência (transparência ativa). Antes de fazer uma solicitação, consulte as seções de despesas, receitas, licitações, servidores e outros dados já publicados.'
  }
];

const hipotesesNegativa = [
  {
    titulo: 'Informações Classificadas',
    descricao: 'Informações classificadas como ultrassecreta (25 anos), secreta (15 anos) ou reservada (5 anos), conforme art. 23 e 24 da LAI.'
  },
  {
    titulo: 'Dados Pessoais',
    descricao: 'Informações pessoais relativas à intimidade, vida privada, honra e imagem das pessoas, conforme art. 31 da LAI.'
  },
  {
    titulo: 'Sigilo Legal',
    descricao: 'Informações protegidas por sigilo legal específico: fiscal, bancário, comercial, industrial, processo judicial em segredo de justiça.'
  },
  {
    titulo: 'Segurança Nacional',
    descricao: 'Informações imprescindíveis à segurança da sociedade ou do Estado, conforme hipóteses do art. 23 da LAI.'
  }
];

export default function ESicPage() {
  return (
    <TransparenciaLayout 
      title="e-SIC - Serviço de Informação ao Cidadão"
      description="Solicite informações públicas garantidas pela Lei de Acesso à Informação"
    >
      {/* Hero Section - Acesso Principal */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Shield className="w-3 h-3 mr-1" />
                Lei nº 12.527/2011
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Serviço de Informação ao Cidadão (e-SIC)
            </h2>
            <p className="text-muted-foreground text-lg">
              O acesso à informação pública é um <strong>direito fundamental</strong> garantido pela Constituição Federal e regulamentado pela Lei de Acesso à Informação. 
              Qualquer cidadão pode solicitar informações aos órgãos públicos.
            </p>
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <a href={ESIC_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <Search className="w-5 h-5" />
                  Acessar e-SIC
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <span className="text-sm text-muted-foreground">
                Sistema oficial para solicitações de informação
              </span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-background/80 backdrop-blur rounded-lg p-6 border shadow-sm">
              <div className="flex items-center gap-3 text-primary mb-3">
                <FileText className="w-10 h-10" />
                <div>
                  <p className="font-semibold">Acesso Gratuito</p>
                  <p className="text-sm text-muted-foreground">Sem necessidade de justificativa</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-primary mb-3">
                <Clock className="w-10 h-10" />
                <div>
                  <p className="font-semibold">Resposta em até 20 dias</p>
                  <p className="text-sm text-muted-foreground">Prorrogável por mais 10 dias</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-primary">
                <Users className="w-10 h-10" />
                <div>
                  <p className="font-semibold">Para todos os cidadãos</p>
                  <p className="text-sm text-muted-foreground">Pessoas físicas ou jurídicas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta Importante */}
      <Alert className="mb-8 border-primary/30 bg-primary/5">
        <CheckCircle className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">Importante: Não é necessário justificar seu pedido!</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          A Lei nº 12.527/2011 (art. 10, §3º) proíbe expressamente a exigência de justificativa para solicitação de informações. 
          Você não precisa explicar por que deseja a informação. Basta identificar-se e descrever a informação solicitada.
        </AlertDescription>
      </Alert>

      {/* Grid de informações principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-lg text-green-800">Gratuito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              O pedido de informação é totalmente gratuito. Apenas reprodução de documentos pode ter custo.
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-800">Prazo: 20 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              Prazo legal de até 20 dias corridos, podendo ser prorrogado por mais 10 dias com justificativa.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg text-purple-800">Direito de Recurso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700">
              Em caso de negativa ou ausência de resposta, você pode interpor recurso administrativo.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Como Solicitar - Passo a Passo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Como Solicitar Informações
          </CardTitle>
          <CardDescription>
            Passo a passo simples para exercer seu direito de acesso à informação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {passoASolicitacao.map((passo, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {passo.numero}
                </div>
                <div className="flex-1 pb-4 border-b last:border-0 last:pb-0">
                  <h4 className="font-semibold text-foreground">{passo.titulo}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{passo.descricao}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <Alert className="bg-amber-50 border-amber-200">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Dados necessários para o pedido</AlertTitle>
              <AlertDescription className="text-amber-700">
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nome completo do solicitante</li>
                  <li>E-mail ou telefone para contato</li>
                  <li>Descrição clara da informação desejada</li>
                </ul>
                <p className="mt-2 font-medium">Lembre-se: NÃO é necessário informar o motivo do pedido!</p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Prazos Legais */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Prazos Legais
          </CardTitle>
          <CardDescription>
            Conforme estabelecido na Lei nº 12.527/2011
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Prazo de Resposta</h4>
                  <p className="text-2xl font-bold text-primary">20 dias</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                O órgão público tem até 20 dias corridos para responder ao pedido de informação, 
                contados a partir do registro da solicitação.
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Prorrogação</h4>
                  <p className="text-2xl font-bold text-amber-600">+10 dias</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                O prazo pode ser prorrogado por mais 10 dias mediante justificativa expressa, 
                da qual o cidadão deve ser comunicado.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-lg">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-primary" />
              Prazos para Recursos
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span><strong>10 dias</strong> para interpor recurso contra negativa de acesso</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span><strong>5 dias</strong> para a autoridade superior decidir sobre o recurso</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Acompanhamento do Pedido */}
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-transparent border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Search className="w-5 h-5" />
            Acompanhamento do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Após registrar sua solicitação no sistema e-SIC, você receberá um <strong>número de protocolo</strong> que 
            permite acompanhar o andamento do seu pedido.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/60 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-1">1. Protocolo</h4>
              <p className="text-sm text-blue-600">Guarde o número de protocolo recebido no momento do registro.</p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-1">2. Acesse o Sistema</h4>
              <p className="text-sm text-blue-600">Entre no e-SIC e faça login com seus dados cadastrados.</p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-1">3. Consulte</h4>
              <p className="text-sm text-blue-600">Visualize o status, mensagens e resposta do seu pedido.</p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <a href={ESIC_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 gap-2">
                <Search className="w-4 h-4" />
                Acompanhar Pedido no e-SIC
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recursos Administrativos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Recursos Administrativos
          </CardTitle>
          <CardDescription>
            Seu direito de recorrer em caso de negativa ou ausência de resposta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Caso o acesso à informação seja negado ou não haja resposta no prazo legal, 
            você tem direito de interpor recurso administrativo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Quando Recorrer</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Negativa de acesso à informação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Ausência de resposta no prazo legal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Resposta incompleta ou imprecisa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Classificação indevida como sigilosa</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Instâncias de Recurso</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">1ª</span>
                  <span>Autoridade hierarquicamente superior à que negou o acesso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">2ª</span>
                  <span>Autoridade máxima do órgão (Prefeito/Secretário)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">3ª</span>
                  <span>Controladoria-Geral do Município (se houver)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hipóteses de Negativa */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Hipóteses de Negativa de Acesso
          </CardTitle>
          <CardDescription>
            O acesso pode ser negado apenas nos casos previstos em lei
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              A negativa de acesso deve ser sempre fundamentada e por escrito. 
              Toda decisão de negativa pode ser objeto de recurso administrativo.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hipotesesNegativa.map((hipotese, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">{hipotese.titulo}</h4>
                <p className="text-sm text-muted-foreground">{hipotese.descricao}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Não pode haver sigilo que viole direitos fundamentais, 
              encubra atos ilegais ou prejudique processos de investigação. A classificação de 
              informações é sempre temporária e deve ser reavaliada periodicamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contato do SIC */}
      <Card className="mb-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Contato do Serviço de Informação ao Cidadão (SIC)
          </CardTitle>
          <CardDescription>
            Atendimento presencial e canais de contato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Endereço</p>
                  <p className="text-muted-foreground">Praça Prof. Agamenon Magalhães, S/N</p>
                  <p className="text-muted-foreground">Centro - Ipubi/PE - CEP: 56250-000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Horário de Atendimento</p>
                  <p className="text-muted-foreground">Segunda a Sexta-feira</p>
                  <p className="text-muted-foreground">das 8h às 14h</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Telefone</p>
                  <p className="text-muted-foreground">(87) 3881-1156</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">E-mail</p>
                  <p className="text-muted-foreground">sic@ipubi.pe.gov.br</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap gap-4 justify-center">
            <a href={ESIC_URL} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <Search className="w-4 h-4" />
                Acessar e-SIC Online
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <Link to="/contato">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Ouvidoria Municipal
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Sistema Oficial */}
      <Alert className="mb-8 border-green-200 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Sistema Oficial e Auditável</AlertTitle>
        <AlertDescription className="text-green-700">
          O e-SIC utilizado pelo Município de Ipubi é um sistema oficial de registro de pedidos de informação. 
          Todas as solicitações são registradas, controladas e auditáveis, garantindo transparência e rastreabilidade 
          conforme exigido pela Lei de Acesso à Informação e pelos órgãos de controle (TCE/TCU/CGU).
        </AlertDescription>
      </Alert>

      {/* FAQ e-SIC */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Perguntas Frequentes sobre o e-SIC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqESic.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Fundamentação Legal */}
      <Card className="mt-8 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Fundamentação Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Lei nº 12.527/2011 (LAI) <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2012/Decreto/D7724.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Decreto nº 7.724/2012 <ExternalLink className="w-3 h-3" />
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
    </TransparenciaLayout>
  );
}
