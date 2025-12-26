import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Building2, Users, Target, Eye, Award, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function InstitucionalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16">
          <div className="container">
            <div className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Institucional</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Conheça a história, missão e valores da Prefeitura Municipal de Ipubi
              </p>
            </div>
          </div>
        </section>

        {/* Sobre o Município */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Sobre Ipubi</h2>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Ipubi é um município brasileiro do estado de Pernambuco, localizado no sertão pernambucano. 
                  A cidade é conhecida por sua rica história e cultura, além de ser um importante polo da região.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Com uma população acolhedora e trabalhadora, Ipubi se destaca pelo desenvolvimento 
                  sustentável e pela qualidade de vida oferecida aos seus cidadãos.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A administração municipal trabalha incansavelmente para promover o bem-estar social, 
                  a educação de qualidade e o crescimento econômico da região.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <History className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Nossa História</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A história de Ipubi remonta aos tempos coloniais, quando a região começou a ser 
                  desbravada pelos primeiros colonizadores. Ao longo dos anos, a cidade cresceu e 
                  se desenvolveu, tornando-se um importante centro regional no sertão pernambucano.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Missão, Visão e Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Missão</h3>
                  <p className="text-muted-foreground">
                    Promover o desenvolvimento sustentável do município, garantindo qualidade de vida, 
                    serviços públicos eficientes e participação cidadã nas decisões governamentais.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Visão</h3>
                  <p className="text-muted-foreground">
                    Ser referência em gestão pública transparente e eficiente, tornando Ipubi 
                    um município modelo em qualidade de vida e desenvolvimento social.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Valores</h3>
                  <p className="text-muted-foreground">
                    Transparência, ética, compromisso com o cidadão, responsabilidade social, 
                    inovação e respeito ao meio ambiente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Administração */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Administração Municipal</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-2">Prefeito</h3>
                    <p className="text-primary-foreground/80 mb-4">Gestão 2025-2028</p>
                    <p className="text-sm text-primary-foreground/70">
                      Comprometido com o desenvolvimento e bem-estar da população ipubiense.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-2">Vice-Prefeito</h3>
                    <p className="text-primary-foreground/80 mb-4">Gestão 2025-2028</p>
                    <p className="text-sm text-primary-foreground/70">
                      Atuando em parceria para uma administração eficiente e transparente.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
