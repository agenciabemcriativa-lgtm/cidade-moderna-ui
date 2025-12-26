import { Helmet } from "react-helmet";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Shield, Lock, Eye, FileText, Users, Database, Bell, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Privacidade - Prefeitura Municipal de Ipubi</title>
        <meta name="description" content="Política de Privacidade da Prefeitura Municipal de Ipubi. Saiba como tratamos seus dados pessoais em conformidade com a LGPD." />
      </Helmet>
      
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container">
            <Breadcrumbs items={[{ label: "Política de Privacidade" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Conheça como a Prefeitura Municipal de Ipubi trata e protege seus dados pessoais
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Introdução */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Introdução
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    A Prefeitura Municipal de Ipubi está comprometida com a proteção da privacidade e dos dados pessoais de todos os cidadãos que utilizam nossos serviços e acessam nosso portal institucional. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
                  </p>
                  <p>
                    Ao utilizar nossos serviços e navegar em nosso site, você concorda com as práticas descritas nesta política. Recomendamos a leitura atenta deste documento.
                  </p>
                </CardContent>
              </Card>

              {/* Dados Coletados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Dados Pessoais Coletados
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>Podemos coletar os seguintes tipos de dados pessoais:</p>
                  <ul>
                    <li><strong>Dados de identificação:</strong> nome completo, CPF, RG, data de nascimento;</li>
                    <li><strong>Dados de contato:</strong> endereço, e-mail, telefone;</li>
                    <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas acessadas, tempo de permanência;</li>
                    <li><strong>Dados para prestação de serviços:</strong> informações necessárias para atender solicitações específicas através do e-SIC, ouvidoria ou outros canais de atendimento;</li>
                    <li><strong>Dados de servidores públicos:</strong> informações funcionais que são de interesse público conforme a Lei de Acesso à Informação.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Finalidade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Finalidade do Tratamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>Os dados pessoais coletados são utilizados para as seguintes finalidades:</p>
                  <ul>
                    <li>Prestação de serviços públicos e atendimento ao cidadão;</li>
                    <li>Cumprimento de obrigações legais e regulatórias;</li>
                    <li>Resposta a solicitações feitas através do e-SIC;</li>
                    <li>Comunicação institucional e informativa;</li>
                    <li>Melhoria da experiência de navegação no portal;</li>
                    <li>Elaboração de estatísticas e análises para políticas públicas;</li>
                    <li>Garantia da transparência pública, conforme determina a legislação.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Base Legal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Base Legal para o Tratamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>O tratamento de dados pessoais pela Prefeitura de Ipubi está fundamentado nas seguintes bases legais previstas na LGPD:</p>
                  <ul>
                    <li><strong>Cumprimento de obrigação legal ou regulatória</strong> (Art. 7º, II);</li>
                    <li><strong>Execução de políticas públicas</strong> (Art. 7º, III);</li>
                    <li><strong>Exercício regular de direitos em processos</strong> (Art. 7º, VI);</li>
                    <li><strong>Consentimento do titular</strong> (Art. 7º, I), quando aplicável;</li>
                    <li><strong>Interesse legítimo</strong> (Art. 7º, IX), quando não prevalecerem os direitos do titular.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Compartilhamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Compartilhamento de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    Os dados pessoais podem ser compartilhados com outros órgãos públicos quando necessário para o cumprimento de obrigações legais, execução de políticas públicas ou prestação de serviços interinstitucionais.
                  </p>
                  <p>
                    Não compartilhamos dados pessoais com terceiros privados, exceto quando expressamente autorizado pelo titular ou quando houver determinação legal ou judicial.
                  </p>
                  <p>
                    As informações de servidores públicos relativas ao exercício de suas funções são consideradas de interesse público e podem ser divulgadas conforme previsto na Lei de Acesso à Informação (Lei nº 12.527/2011).
                  </p>
                </CardContent>
              </Card>

              {/* Segurança */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Segurança dos Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    A Prefeitura de Ipubi adota medidas técnicas e administrativas adequadas para proteger os dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração ou qualquer forma de tratamento inadequado.
                  </p>
                  <p>Entre as medidas de segurança adotadas, destacam-se:</p>
                  <ul>
                    <li>Uso de conexões criptografadas (HTTPS);</li>
                    <li>Controle de acesso aos sistemas;</li>
                    <li>Capacitação dos servidores sobre proteção de dados;</li>
                    <li>Políticas internas de segurança da informação.</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Direitos do Titular */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Direitos do Titular dos Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>Conforme a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:</p>
                  <ul>
                    <li><strong>Confirmação e acesso:</strong> confirmar a existência de tratamento e acessar seus dados;</li>
                    <li><strong>Correção:</strong> solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
                    <li><strong>Anonimização, bloqueio ou eliminação:</strong> solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
                    <li><strong>Portabilidade:</strong> solicitar a portabilidade dos dados a outro fornecedor;</li>
                    <li><strong>Informação sobre compartilhamento:</strong> saber com quais entidades seus dados foram compartilhados;</li>
                    <li><strong>Revogação do consentimento:</strong> quando aplicável, revogar o consentimento dado anteriormente.</li>
                  </ul>
                  <p>
                    Para exercer seus direitos, entre em contato através do e-SIC ou dos canais de atendimento da Prefeitura.
                  </p>
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contato do Encarregado de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    Para dúvidas, solicitações ou reclamações relacionadas ao tratamento de dados pessoais, entre em contato com o Encarregado de Proteção de Dados (DPO) da Prefeitura Municipal de Ipubi:
                  </p>
                  <ul>
                    <li><strong>E-mail:</strong> dpo@ipubi.pe.gov.br</li>
                    <li><strong>Telefone:</strong> (87) 3881-1156</li>
                    <li><strong>Endereço:</strong> Praça Professor Agamanon Magalhães, 56, Centro, Ipubi-PE</li>
                  </ul>
                  <p>
                    Você também pode utilizar o <a href="/transparencia/esic" className="text-primary hover:underline">e-SIC</a> para fazer solicitações formais relacionadas aos seus dados pessoais.
                  </p>
                </CardContent>
              </Card>

              {/* Atualizações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Atualizações desta Política
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Recomendamos que você revise esta página regularmente para estar informado sobre como protegemos seus dados.
                  </p>
                  <p className="text-sm mt-4">
                    <strong>Última atualização:</strong> Dezembro de 2025
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
