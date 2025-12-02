import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { HeroBanner } from "@/components/portal/HeroBanner";
import { ServicesGrid } from "@/components/portal/ServicesGrid";
import { NewsSection } from "@/components/portal/NewsSection";
import { SecretariasSection } from "@/components/portal/SecretariasSection";
import { QuickServices } from "@/components/portal/QuickServices";
import { Footer } from "@/components/portal/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <ServicesGrid />
        <NewsSection />
        <SecretariasSection />
        <QuickServices />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
