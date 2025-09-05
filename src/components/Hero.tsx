import { Button } from "@/components/ui/button";
import { Heart, Users, FileText } from "lucide-react";
// Using uploaded portrait directly

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Kostenlose Bewerbungshilfe
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Ich helfe dir bei deinem{" "}
              <span className="gradient-text">perfekten Lebenslauf</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Menschen mit psychischen Problemen oder Schwierigkeiten im Bewerbungsprozess 
              erhalten von mir kostenlose Unterstützung beim Erstellen professioneller CVs. 
              <strong className="text-foreground"> 5 kostenlose Slots pro Monat verfügbar.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="btn-accent text-lg px-8 py-3" asChild>
                <a href="#contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Kostenlose Hilfe anfragen
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                <a href="#about">Mehr über mich</a>
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span>100% kostenlos</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <span>Persönliche Betreuung</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="relative z-10">
              <img
                src="/lovable-uploads/b88262de-c305-473a-a997-7014c75c09ae.png"
                alt="Porträt von Marcel, Bewerbungshelfer"
                className="rounded-2xl shadow-large w-full h-auto"
                loading="eager"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;