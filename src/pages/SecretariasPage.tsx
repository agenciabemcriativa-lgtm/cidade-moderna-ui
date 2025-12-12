import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { 
  Building2, 
  Shield, 
  Palette, 
  Tractor, 
  Users, 
  GraduationCap, 
  Dumbbell, 
  Wallet,
  HardHat,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const secretarias = [
  { icon: Building2, name: "Administração", slug: "administracao" },
  { icon: Shield, name: "Controle Interno", slug: "controle-interno" },
  { icon: Palette, name: "Cultura", slug: "cultura" },
  { icon: Tractor, name: "Desenvolvimento Rural", slug: "desenvolvimento-rural" },
  { icon: Users, name: "Desenvolvimento Social", slug: "desenvolvimento-social" },
  { icon: GraduationCap, name: "Educação", slug: "educacao" },
  { icon: Dumbbell, name: "Esporte", slug: "esporte" },
  { icon: Wallet, name: "Finanças", slug: "financas" },
  { icon: HardHat, name: "Obras e Urbanismo", slug: "obras-e-urbanismo" },
  { icon: Heart, name: "Saúde", slug: "saude" },
];

export default function SecretariasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Secretarias Municipais
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Conheça as secretarias e seus serviços disponíveis à população
            </p>
          </div>
        </section>

        {/* Secretarias Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                ESTRUTURA ADMINISTRATIVA
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {secretarias.map((secretaria) => {
                const IconComponent = secretaria.icon;
                return (
                  <div
                    key={secretaria.slug}
                    className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-4">{secretaria.name}</h3>
                    <Button variant="outline" asChild className="w-full">
                      <Link to={`/secretaria/${secretaria.slug}`}>
                        ACESSAR SECRETARIA
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
