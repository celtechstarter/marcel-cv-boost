import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Palette, Bot, TableProperties, Camera, Star } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "CV Erstellung",
      description: "Professionelle Lebensläufe, die deine Stärken perfekt in Szene setzen und Personalern sofort ins Auge fallen.",
      features: ["Moderne Layouts", "ATS-optimiert", "Branchenspezifisch"],
      color: "text-primary"
    },
    {
      icon: Palette,
      title: "Bewerbungsdesign",
      description: "Ansprechende visuelle Gestaltung deiner kompletten Bewerbungsunterlagen für einen bleibenden Eindruck.",
      features: ["Corporate Design", "Einheitliches Layout", "Print & Digital"],
      color: "text-accent"
    },
    {
      icon: Bot,
      title: "KI-Unterstützung",
      description: "Moderne KI-Tools helfen beim Formulieren überzeugender Texte und beim Optimieren deiner Bewerbung.",
      features: ["Textoptimierung", "Keyword-Analyse", "Automatisierung"],
      color: "text-primary"
    },
    {
      icon: TableProperties,
      title: "Bewerbungstracker",
      description: "Google Sheets Tabellen, die automatisch dokumentieren, wann Bewerbungen verschickt wurden.",
      features: ["Automatische Verfolgung", "Terminerinnerungen", "Übersichtlich"],
      color: "text-accent"
    },
    {
      icon: Camera,
      title: "Bewerbungsfotos",
      description: "Beratung und Unterstützung beim Erstellen professioneller Bewerbungsfotos, die authentisch wirken.",
      features: ["Fotoauswahl", "Bildbearbeitung", "Formatanpassung"],
      color: "text-primary"
    },
    {
      icon: Star,
      title: "Stellensuche",
      description: "Hilfe beim Finden passender Stellenanzeigen und Strategien für eine erfolgreiche Bewerbung.",
      features: ["Stellenrecherche", "Bewerbungsstrategie", "Marktanalyse"],
      color: "text-accent"
    }
  ];

  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meine <span className="gradient-text">Leistungen</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Umfassende Unterstützung für deinen erfolgreichen Bewerbungsprozess – 
            von der CV-Erstellung bis zur modernen Stellensuche
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="card-soft hover:shadow-medium transition-all duration-300 group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <service.icon className={`h-6 w-6 ${service.color} group-hover:scale-110 transition-transform duration-300`} />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${service.color === 'text-primary' ? 'bg-primary' : 'bg-accent'}`}></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="card-soft max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                🎯 <span className="gradient-text">5 kostenlose Slots</span> pro Monat verfügbar
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Du erhältst eine persönliche Betreuung und professionelle Unterstützung – 
                komplett kostenfrei. Sichere dir jetzt einen der limitierten Plätze.
              </p>
              <Button size="lg" className="btn-accent text-lg px-8 py-3" asChild>
                <a href="#contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Jetzt kostenlosen Slot sichern
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;