import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lightbulb, Users, Target } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Heart,
      title: "Persönliche Erfahrung",
      description: "Ich weiß aus eigener Erfahrung, wie schwer Bewerbungen sein können"
    },
    {
      icon: Lightbulb,
      title: "Moderne Tools",
      description: "Nutzung von KI und Google Sheets für optimierte Bewerbungsprozesse"
    },
    {
      icon: Users,
      title: "Erfolgreiche Begleitung",
      description: "Ich unterstütze Menschen mit psychischen Belastungen oder Schwerbehinderungen erfolgreich."
    },
    {
      icon: Target,
      title: "Gemeinsamer Erfolg",
      description: "Ich gebe mein Bestes, damit wir gemeinsam erfolgreich sind."
    }
  ];

  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meine <span className="gradient-text">Geschichte</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Warum ich Menschen bei ihren Bewerbungen helfe und was mich antreibt
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="animate-fade-up">
          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              <strong className="text-foreground">Ich heiße Marcel</strong> und habe durch meine eigene Geschichte gelernt, 
              wie schwer es sein kann, Bewerbungen zu schreiben und den richtigen Weg zu finden. 
              In einer schwierigen Phase meines Lebens habe ich gemerkt, wie viel es mir bedeutet, 
              andere zu unterstützen, die vor ähnlichen Herausforderungen stehen.
            </p>
            
            <p>
              Während eines Kurses begann ich, für andere Lebensläufe zu erstellen – und merkte schnell, 
              dass mich das erfüllt. Seitdem unterstütze ich Menschen mit psychischen Belastungen oder Schwerbehinderungen 
              dabei, professionelle Bewerbungsunterlagen zu erstellen. Meine <a href="/bewerbungshilfe" className="text-primary hover:underline">kostenlose Bewerbungshilfe</a> 
              umfasst CV-Erstellung, Anschreiben und Bewerbungsstrategie.
            </p>
            
            <p className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
              <strong className="text-accent">Das Ergebnis hat mich jedes Mal stolz gemacht:</strong> 
              zum Beispiel eine Freundin, die nach meinem Lebenslauf sofort einen Job mit 
              Ausbildungszusage bekommen hat. Weitere Erfolgsgeschichten findest du in unseren <a href="/reviews" className="text-primary hover:underline">Bewertungen</a>.
            </p>
            
            <p>
              Neben meiner Begeisterung für IT nutze ich moderne Tools und auch KI, um Bewerbungsprozesse 
              einfacher und übersichtlicher zu gestalten. Was mich wirklich erfüllt, ist nicht die Technik allein, 
              sondern der Moment, wenn jemand mit meiner Hilfe neuen Mut fasst und merkt: 
              <em className="text-primary font-medium">"Es ist gar nicht so schwer, einen guten Lebenslauf zu haben."</em>
              Bei Fragen zur Bewerbung hilft auch unser umfangreicher <a href="/faq" className="text-primary hover:underline">FAQ-Bereich</a> weiter.
            </p>
            
            {/* Additional content for 250+ word requirement */}
            <p>
              Der Bewerbungsprozess kann besonders für Menschen mit besonderen Herausforderungen überwältigend sein. 
              Deshalb biete ich einen strukturierten, einfühlsamen Ansatz, der deine individuellen Bedürfnisse berücksichtigt. 
              Ob es um die Darstellung von Lücken im Lebenslauf geht, die Betonung deiner Stärken trotz Hindernissen 
              oder die Entwicklung einer authentischen beruflichen Identität – gemeinsam finden wir Lösungen.
            </p>
            
            <p>
              Meine Unterstützung beschränkt sich nicht nur auf die Erstellung der Dokumente. Ich begleite dich durch 
              den gesamten Prozess: von der ersten Bestandsaufnahme über die Entwicklung deiner Bewerbungsstrategie 
              bis hin zur Vorbereitung auf Vorstellungsgespräche. Jeder Mensch verdient eine faire Chance auf dem Arbeitsmarkt, 
              und ich bin hier, um sicherzustellen, dass deine Bewerbung diese Chance bestmöglich nutzt.
            </p>
          </div>
          </div>

          {/* Highlights Cards */}
          <div className="grid sm:grid-cols-2 gap-6 animate-scale-in">
            {highlights.map((highlight, index) => (
              <Card 
                key={index} 
                className="card-soft hover:shadow-medium transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <highlight.icon className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;