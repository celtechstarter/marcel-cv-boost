import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, ExternalLink } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "Wer kann meine Bewerbungsunterlagen kostenlos prüfen oder erstellen?",
      answer: "Ich biete jeden Monat fünf kostenlose Slots an, um Menschen beim Erstellen von Lebensläufen und Bewerbungsunterlagen zu unterstützen. Diese Hilfe ist komplett kostenfrei und richtet sich besonders an Menschen, die Unterstützung beim Bewerbungsprozess benötigen."
    },
    {
      question: "Kannst du mir auch helfen, wenn ich psychische Belastungen oder eine Schwerbehinderung habe?",
      answer: "Ja, genau darauf habe ich mich spezialisiert. Ich weiß aus eigener Erfahrung, wie schwer Bewerbungen sein können, wenn man zusätzliche persönliche Hürden hat. Ich helfe dir dabei, deinen Lebenslauf klar und professionell aufzubauen und unterstütze dich dabei, deine Stärken optimal zu präsentieren."
    },
    {
      question: "Nutzt du KI, um Bewerbungen zu verbessern?",
      answer: "Ja, ich setze moderne KI-Tools ein, um Bewerbungsprozesse einfacher und übersichtlicher zu machen. So können Lebensläufe schneller erstellt und verbessert werden. Dabei bleibt der persönliche Touch erhalten - die KI hilft uns nur dabei, effizienter zu arbeiten."
    },
    {
      question: "Wie läuft die Unterstützung ab?",
      answer: "Wir kommunizieren über Discord. Du brauchst lediglich einen PC oder Laptop, eine stabile Internetverbindung, ein Headset und optional eine Kamera. Dann können wir Schritt für Schritt an deinem Lebenslauf arbeiten und gemeinsam ein professionelles Ergebnis erstellen."
    },
    {
      question: "Wie kann ich dich am besten erreichen?",
      answer: "Am einfachsten per E-Mail an marcel.welk87@gmail.com oder über meinen Discord-Server, den du direkt über den Link auf der Webseite betreten kannst. Ich antworte normalerweise innerhalb von 24 Stunden."
    },
    {
      question: "Wie lange dauert es, einen Lebenslauf zu erstellen?",
      answer: "Je nach Komplexität und deinen Wünschen dauert es zwischen 2-5 Tagen. Wir arbeiten gemeinsam daran, bis du mit dem Ergebnis vollständig zufrieden bist."
    },
    {
      question: "Welche Unterlagen benötigst du von mir?",
      answer: "Deine aktuellen Daten, Zeugnisse, bisherige Arbeitserfahrungen und deine Wunschvorstellungen für die Bewerbung. Alles andere besprechen wir dann gemeinsam."
    },
    {
      question: "Kann ich auch Hilfe bei Anschreiben und anderen Bewerbungsunterlagen bekommen?",
      answer: "Ja, neben dem Lebenslauf helfe ich auch bei Anschreiben, Bewerbungsfotos, Google Sheets Bewerbungstrackern und der gesamten Bewerbungsstrategie."
    }
  ];

  return (
    <Layout>
      <main className="section-padding"
        style={{ marginTop: '4rem' }}>
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Häufig gestellte <span className="gradient-text">Fragen</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alles was du über meine kostenlose Bewerbungshilfe wissen musst
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid gap-6 mb-12">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-soft">
                <CardHeader>
                  <CardTitle className="text-left text-lg font-semibold text-primary">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="card-soft bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Deine Frage war nicht dabei?
              </h3>
              <p className="text-muted-foreground mb-6">
                Schreib mir einfach eine Nachricht – ich helfe dir gerne weiter!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="btn-primary"
                  onClick={() => window.location.href = 'mailto:marcel.welk87@gmail.com'}
                  aria-label="E-Mail an Marcel senden"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  E-Mail schreiben
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open("https://discord.gg/your-server-link", "_blank")}
                  aria-label="Discord Server beitreten"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discord beitreten
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default FAQ;