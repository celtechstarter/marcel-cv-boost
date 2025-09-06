import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SlotsBadge } from "@/components/SlotsBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <SlotsBadge />
          </div>
        </div>
        
        {/* CTA Section replacing duplicate form */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Bereit loszulegen?</h2>
              <p className="text-xl text-muted-foreground mb-8">Wähle deinen bevorzugten Weg:</p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Button 
                  asChild
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 text-left"
                >
                  <a 
                    href="/bewerbungshilfe#termin"
                    aria-label="Direkt zur Terminbuchung springen"
                  >
                    <Calendar className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">Hier geht's direkt zur Terminbuchung</span>
                    <span className="text-sm opacity-90">(Lade deinen CV hoch, falls du einen hast)</span>
                  </a>
                </Button>
                
                <Button 
                  asChild
                  variant="secondary"
                  size="lg"
                  className="h-auto p-6 flex-col gap-3 text-left"
                >
                  <a 
                    href="/bewerbungshilfe#anfrage"
                    aria-label="Zum Anfrageformular springen"
                  >
                    <Mail className="h-8 w-8 mb-2" />
                    <span className="font-semibold text-base">Falls du erstmal Fragen hast,</span>
                    <span className="text-sm opacity-90">kannst du mir gerne erstmal schreiben!</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <About />
        <Services />
        <ProcessSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;