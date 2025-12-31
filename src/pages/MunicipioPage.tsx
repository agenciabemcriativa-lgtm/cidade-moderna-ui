import { useParams, Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { PageHeader } from "@/components/portal/PageHeader";
import { useMunicipioItens } from "@/hooks/useMunicipioItens";
import { Loader2, Mail, Phone, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sanitizeHTML } from "@/lib/sanitize";

export default function MunicipioPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: municipioItens = [], isLoading } = useMunicipioItens();
  
  const item = municipioItens.find((m) => m.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <AccessibilityBar />
        <Header />
        <main className="container py-12">
          <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
          <p className="text-muted-foreground mt-2">O item solicitado não existe.</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Voltar para a página inicial
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const itemData = item as any;
  const hasContactInfo = itemData.telefone || itemData.email || itemData.endereco;
  const hasAutoridade = itemData.nome_autoridade || itemData.foto_url;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <AccessibilityBar />
      <Header />
      
      <main>
        <PageHeader
          title={item.titulo}
          breadcrumbItems={[
            { label: "Município" },
            { label: item.titulo }
          ]}
        />

        {/* Content */}
        <div className="container py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {item.titulo}
          </h1>
          
          {hasAutoridade ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Foto/Imagem */}
              <Card className="md:col-span-1">
                <CardContent className="p-6">
                  <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    {itemData.foto_url ? (
                      <img 
                        src={itemData.foto_url} 
                        alt={itemData.nome_autoridade || item.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-24 h-24 text-muted-foreground/50" />
                    )}
                  </div>
                  {itemData.nome_autoridade && (
                    <>
                      <h2 className="text-xl font-bold text-foreground">
                        {itemData.nome_autoridade}
                      </h2>
                      {itemData.cargo && (
                        <p className="text-primary font-medium">{itemData.cargo}</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Conteúdo e Contato */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Sobre</h3>
                    {itemData.conteudo ? (
                      <div 
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(itemData.conteudo) }}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        Informações em construção.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {hasContactInfo && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Informações de Contato</h3>
                      <div className="space-y-3">
                        {itemData.telefone && (
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Phone className="w-5 h-5 text-primary" />
                            <span>{itemData.telefone}</span>
                          </div>
                        )}
                        {itemData.email && (
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <Mail className="w-5 h-5 text-primary" />
                            <a href={`mailto:${itemData.email}`} className="hover:text-primary transition-colors">
                              {itemData.email}
                            </a>
                          </div>
                        )}
                        {itemData.endereco && (
                          <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{itemData.endereco}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                {itemData.conteudo ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(itemData.conteudo) }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Conteúdo da página "{item.titulo}" em construção.
                  </p>
                )}
                
                {hasContactInfo && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Informações de Contato</h3>
                    <div className="space-y-3">
                      {itemData.telefone && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Phone className="w-5 h-5 text-primary" />
                          <span>{itemData.telefone}</span>
                        </div>
                      )}
                      {itemData.email && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Mail className="w-5 h-5 text-primary" />
                          <a href={`mailto:${itemData.email}`} className="hover:text-primary transition-colors">
                            {itemData.email}
                          </a>
                        </div>
                      )}
                      {itemData.endereco && (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{itemData.endereco}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
