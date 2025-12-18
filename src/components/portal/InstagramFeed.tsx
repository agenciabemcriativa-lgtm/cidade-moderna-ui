import { useEffect, useState } from "react";
import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramPost {
  id: string;
  url: string;
}

// Posts do Instagram da Prefeitura - adicione os URLs dos posts aqui
const instagramPosts: InstagramPost[] = [
  { id: "1", url: "https://www.instagram.com/p/EXEMPLO1/" },
  { id: "2", url: "https://www.instagram.com/p/EXEMPLO2/" },
  { id: "3", url: "https://www.instagram.com/p/EXEMPLO3/" },
];

// URL do perfil oficial do Instagram da Prefeitura
const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/prefeituradeipubi";

export function InstagramFeed() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Carrega o script do Instagram embed
    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        // @ts-ignore
        if (window.instgrm) {
          // @ts-ignore
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
      // @ts-ignore
      if (window.instgrm) {
        // @ts-ignore
        window.instgrm.Embeds.process();
      }
    }
  }, []);

  useEffect(() => {
    // Reprocessa embeds quando o script já está carregado
    if (isScriptLoaded) {
      // @ts-ignore
      if (window.instgrm) {
        // @ts-ignore
        window.instgrm.Embeds.process();
      }
    }
  }, [isScriptLoaded]);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 mb-4 shadow-lg">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Siga-nos no Instagram
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Acompanhe as últimas novidades e ações da Prefeitura de Ipubi
          </p>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {instagramPosts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={post.url}
                data-instgrm-version="14"
                style={{
                  background: "transparent",
                  border: 0,
                  borderRadius: "12px",
                  margin: 0,
                  maxWidth: "100%",
                  minWidth: "280px",
                  padding: 0,
                  width: "100%",
                }}
              >
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <div className="animate-pulse flex flex-col items-center gap-3">
                    <Instagram className="w-10 h-10" />
                    <span className="text-sm">Carregando post...</span>
                  </div>
                </div>
              </blockquote>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              Ver mais no Instagram
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
