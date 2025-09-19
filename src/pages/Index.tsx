import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { AccessibilityTools } from "@/components/AccessibilityTools";
import { RelatedPages } from "@/components/RelatedPages";

import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Index = () => {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      <main className="pt-16" role="main">
        {/* H1 is in Hero component */}
        <Hero />
        
        {/* CTA Section replacing duplicate form */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
              <p className="text-xl text-muted-foreground mb-8">{t('cta.subtitle')}</p>
              
              <div className="flex justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 text-center"
                >
                  <a 
                    href="/bewerbungshilfe#anfrage"
                    aria-label="Jetzt kostenlose Bewerbungshilfe anfragen"
                  >
                    <Mail className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">Jetzt Anfrage senden</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Four info boxes completely removed */}
        
        <About />
        <Services />
        <ProcessSection />
        <RelatedPages currentPage="home" />
        
      </main>
      <Footer />
      <AccessibilityTools />
    </div>
  );
};

export default Index;