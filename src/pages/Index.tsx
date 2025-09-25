import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { AccessibilityTools } from "@/components/AccessibilityTools";
import { RelatedPages } from "@/components/RelatedPages";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Index = () => {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Kostenlose Bewerbungshilfe & Lebenslauf Service - Marcel CV Boost</title>
        <meta name="description" content="Professionelle Bewerbungshilfe kostenlos. 100% gratis Lebenslauf erstellen mit AI-Unterstützung für Menschen mit psychischen Belastungen oder Behinderungen. 5 kostenlose Plätze pro Monat." />
        <meta name="keywords" content="kostenlose bewerbungshilfe, gratis lebenslauf, CV erstellen, bewerbung hilfe, marcel welk, AI bewerbung" />
        <link rel="canonical" href="https://marcel-cv-boost.lovable.app/" />
        <link rel="alternate" hrefLang="de" href="https://marcel-cv-boost.lovable.app/" />
        <link rel="alternate" hrefLang="en" href="https://marcel-cv-boost.lovable.app/?lang=en" />
        <link rel="alternate" hrefLang="tr" href="https://marcel-cv-boost.lovable.app/?lang=tr" />
        <link rel="alternate" hrefLang="ru" href="https://marcel-cv-boost.lovable.app/?lang=ru" />
        <link rel="alternate" hrefLang="uk" href="https://marcel-cv-boost.lovable.app/?lang=uk" />
        <link rel="alternate" hrefLang="pl" href="https://marcel-cv-boost.lovable.app/?lang=pl" />
        <link rel="alternate" hrefLang="ar" href="https://marcel-cv-boost.lovable.app/?lang=ar" />
        <link rel="alternate" hrefLang="x-default" href="https://marcel-cv-boost.lovable.app/" />
        <meta property="og:title" content="Kostenlose Bewerbungshilfe & Lebenslauf Service - Marcel CV Boost" />
        <meta property="og:description" content="Professionelle Bewerbungshilfe kostenlos. 100% gratis Lebenslauf erstellen mit AI-Unterstützung für Menschen mit psychischen Belastungen oder Behinderungen." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://marcel-cv-boost.lovable.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="apple-mobile-web-app-title" content="Marcel CV Boost" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </Helmet>
      
      <Navigation />
      <main className="pt-16" role="main">
        <Hero />
        
        {/* CTA Section with internal links */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">{t('home:cta.title')}</h2>
              <p className="text-xl text-muted-foreground mb-8">{t('home:cta.subtitle')}</p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                <Button 
                  asChild
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 text-center"
                >
                  <a 
                    href="/bewerbungshilfe#anfrage"
                    aria-label={t('home:cta.booking.aria')}
                  >
                    <Calendar className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">{t('home:cta.booking.text')}</span>
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
                    aria-label={t('home:cta.contact.aria')}
                  >
                    <Mail className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">{t('home:cta.contact.text')}</span>
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