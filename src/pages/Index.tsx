import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { AccessibilityTools } from "@/components/AccessibilityTools";
import { RelatedPages } from "@/components/RelatedPages";
import SeoHead from "@/components/SeoHead";

import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Index = () => {
  const { t, isLoaded } = useI18n();
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SeoHead 
        title="Kostenlose Bewerbungshilfe & Lebenslauf Service - Marcel CV Boost"
        description="Professionelle Bewerbungshilfe kostenlos. 100% gratis Lebenslauf erstellen mit AI-Unterstützung für Menschen mit psychischen Belastungen oder Behinderungen. 5 kostenlose Plätze pro Monat."
        keywords="kostenlose bewerbungshilfe, gratis lebenslauf, CV erstellen, bewerbung hilfe, marcel welk, AI bewerbung"
        canonicalUrl="https://marcel-cv-boost.lovable.app/"
        ogTitle="Kostenlose Bewerbungshilfe & Lebenslauf Service - Marcel CV Boost"
        ogDescription="Professionelle Bewerbungshilfe kostenlos. 100% gratis Lebenslauf erstellen mit AI-Unterstützung für Menschen mit psychischen Belastungen oder Behinderungen."
      />
      
      <Navigation />
      <main className="pt-16" role="main">
        <Hero />
        
        {/* CTA Section with internal links */}
        {isLoaded && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
              <p className="text-xl text-muted-foreground mb-8">{t('home.cta.subtitle')}</p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                <Button 
                  asChild
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 text-center"
                >
                  <a 
                    href="/bewerbungshilfe#anfrage"
                    aria-label={t('home.cta.booking.aria')}
                  >
                    <Calendar className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">{t('home.cta.booking.text')}</span>
                  </a>
                </Button>
                
                <Button 
                  asChild
                  variant="secondary"
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 text-center"
                >
                  <a 
                    href="#contact"
                    aria-label={t('home.cta.contact.aria')}
                  >
                    <Mail className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">{t('home.cta.contact.text')}</span>
                  </a>
                </Button>
              </div>
              
              {/* Internal navigation links */}
              <div className="text-sm text-muted-foreground space-x-4">
                <a href="/faq" className="hover:text-primary underline">Häufige Fragen</a>
                <span>•</span>
                <a href="/datenschutz" className="hover:text-primary underline">Datenschutz</a>
                <span>•</span>
                <a href="/impressum" className="hover:text-primary underline">Impressum</a>
                <span>•</span>
                <a href="/barrierefreiheit" className="hover:text-primary underline">Barrierefreiheit</a>
              </div>
            </div>
          </div>
        </section>
        )}
        
        {/* Four info boxes completely removed */}
        
        <About />
        <Services />
        <ProcessSection />
        <Contact />
        <RelatedPages currentPage="home" />
        
      </main>
      <Footer />
      <AccessibilityTools />
    </div>
  );
};

export default Index;