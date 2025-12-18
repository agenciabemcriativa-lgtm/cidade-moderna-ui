import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { HeroBanner } from "@/components/portal/HeroBanner";
import { SearchBar } from "@/components/portal/SearchBar";
import { ServicesGrid } from "@/components/portal/ServicesGrid";
import { NewsSection } from "@/components/portal/NewsSection";
import { PublicacoesCarousel } from "@/components/portal/PublicacoesCarousel";
import { InstagramFeed } from "@/components/portal/InstagramFeed";
import { Footer } from "@/components/portal/Footer";
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AccessibilityBar />
      <TopBar />
      <Header id="menu-principal" />
      <main className="flex-1">
        <HeroBanner />
        <SearchBar id="buscador" />
        <ServicesGrid />
        <NewsSection />
        <PublicacoesCarousel />
        <InstagramFeed />
      </main>
      <Footer id="rodape" />
    </div>
  );
};

export default Index;
