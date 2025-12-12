import { Link } from "react-router-dom";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { noticiasData } from "@/data/noticias";
import { Calendar } from "lucide-react";

export default function NoticiasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Notícias
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Acompanhe as últimas notícias e eventos do município
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticiasData.map((noticia) => (
                <Link
                  key={noticia.id}
                  to={`/noticia/${noticia.slug}`}
                  className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={noticia.image}
                      alt={noticia.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full text-primary-foreground"
                        style={{ backgroundColor: noticia.categoryColor }}
                      >
                        {noticia.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {noticia.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {noticia.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {noticia.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
