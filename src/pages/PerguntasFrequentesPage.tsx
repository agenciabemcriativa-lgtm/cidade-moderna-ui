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
  MessageSquare,
  Info,
  BookOpen,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Calendar,
  LucideIcon
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useFaqCategoriasWithPerguntas } from "@/hooks/useFaq";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, LucideIcon> = {
  HelpCircle,
  FileText,
  Users,
  Building2,
  Scale,
  Shield,
  Search,
  MessageSquare,
  Info,
  BookOpen,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Calendar
};

export default function PerguntasFrequentesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: categorias = [], isLoading } = useFaqCategoriasWithPerguntas();

  const filteredCategories = categorias.map(category => ({
    ...category,
    perguntas: category.perguntas.filter(
      q => 
        q.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.resposta.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.perguntas.length > 0);

  const totalQuestions = categorias.reduce((acc, cat) => acc + cat.perguntas.length, 0);

  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || HelpCircle;
  };

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
                {isLoading ? (
                  "Carregando..."
                ) : searchTerm ? (
                  `${filteredCategories.reduce((acc, cat) => acc + cat.perguntas.length, 0)} perguntas encontradas`
                ) : (
                  `${totalQuestions} perguntas em ${categorias.length} categorias`
                )}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container py-12">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border p-6">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : categorias.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhuma pergunta cadastrada</h2>
              <p className="text-muted-foreground">
                Em breve teremos perguntas frequentes disponíveis
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhuma pergunta encontrada</h2>
              <p className="text-muted-foreground">
                Tente buscar com outros termos
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => {
                const IconComponent = getIcon(category.icone);
                return (
                  <div key={category.id} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="bg-muted/50 px-6 py-4 border-b flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{category.titulo}</h2>
                        <p className="text-sm text-muted-foreground">
                          {category.perguntas.length} {category.perguntas.length === 1 ? 'pergunta' : 'perguntas'}
                        </p>
                      </div>
                    </div>
                    <Accordion type="single" collapsible className="px-6">
                      {category.perguntas.map((faq, index) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left hover:no-underline py-4">
                            <span className="font-medium pr-4">{faq.pergunta}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4 leading-relaxed whitespace-pre-wrap">
                            {faq.resposta}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
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
