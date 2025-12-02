import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { secretariasData } from "@/data/secretarias";

export default function SecretariaPage() {
  const { slug } = useParams<{ slug: string }>();
  const secretaria = secretariasData.find((s) => s.slug === slug);

  if (!secretaria) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Secretaria não encontrada</h1>
          <Link to="/">
            <Button variant="outline">Voltar ao Início</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-12 md:py-20">
          <div className="container">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Portal
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground">
              {secretaria.nome}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Secretário Info */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow">
                  <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
                    Secretário(a) Responsável
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="shrink-0">
                      <img
                        src={secretaria.secretario.foto}
                        alt={secretaria.secretario.nome}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-primary mb-3">
                        {secretaria.secretario.nome}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {secretaria.secretario.biografia}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow h-full">
                  <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
                    Informações de Contato
                  </h2>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                          Endereço
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {secretaria.contato.endereco}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                          Telefone
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {secretaria.contato.telefone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                          E-mail
                        </p>
                        <p className="text-muted-foreground text-sm break-all">
                          {secretaria.contato.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-highlight" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                          Horário de Atendimento
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {secretaria.contato.horario}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
