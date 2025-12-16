import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter } from "lucide-react";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { getNoticiaBySlug, noticiasData } from "@/data/noticias";
import { sanitizeHTML } from "@/lib/sanitize";

export default function NoticiaPage() {
  const { slug } = useParams<{ slug: string }>();
  const noticia = slug ? getNoticiaBySlug(slug) : undefined;

  if (!noticia) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Notícia não encontrada</h1>
          <p className="text-muted-foreground mb-8">A notícia que você está procurando não existe ou foi removida.</p>
          <Link to="/">
            <Button variant="default">Voltar ao Início</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const outrasNoticias = noticiasData.filter(n => n.id !== noticia.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 border-b">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/#noticias" className="text-muted-foreground hover:text-primary transition-colors">
                Notícias
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{noticia.title}</span>
            </div>
          </div>
        </div>

        {/* Article */}
        <article className="container py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link 
              to="/#noticias" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar para Notícias</span>
            </Link>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${noticia.categoryColor}`}>
                  {noticia.category}
                </span>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{noticia.date}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4">
                {noticia.title}
              </h1>
              
              <p className="text-lg text-muted-foreground">
                {noticia.summary}
              </p>
            </header>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <img 
                src={noticia.image} 
                alt={noticia.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-4 pb-6 mb-8 border-b">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Compartilhar:
              </span>
              <button className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <Twitter className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(noticia.content) }}
            />

            {/* Tags */}
            <div className="flex items-center gap-2 mt-8 pt-8 border-t">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tags:</span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                {noticia.category}
              </span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                Ipubi
              </span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                Prefeitura
              </span>
            </div>
          </div>
        </article>

        {/* Related News */}
        {outrasNoticias.length > 0 && (
          <section className="bg-muted/30 py-12">
            <div className="container">
              <h2 className="text-2xl font-bold text-foreground mb-8">Outras Notícias</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {outrasNoticias.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/noticia/${item.slug}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.categoryColor}`}>
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
