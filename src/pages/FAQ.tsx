import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, ExternalLink, HelpCircle, Briefcase, Clock, Settings } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const FAQ = () => {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "FAQ - Häufige Fragen zur kostenlosen Bewerbungshilfe | Marcel Welk";
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Antworten auf häufige Fragen zur kostenlosen Bewerbungshilfe. KI-gestützte Lebenslauf-Erstellung, Discord-Beratung und Unterstützung bei psychischen Belastungen.');
    
    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'FAQ - Häufige Fragen zur kostenlosen Bewerbungshilfe' },
      { property: 'og:description', content: 'Antworten auf häufige Fragen zur kostenlosen Bewerbungshilfe. KI-gestützte Lebenslauf-Erstellung und Discord-Beratung.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://marcel-cv-boost.lovable.dev/faq' }
    ];
    
    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // FAQ Schema structured data
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    let script = document.querySelector('script[type="application/ld+json"][data-faq]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-faq', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);
  }, []);

  const faqCategories = [
    {
      title: "Allgemeine Fragen",
      icon: <HelpCircle className="h-5 w-5" />,
      faqs: [
        {
          question: "Wer kann meine Bewerbungsunterlagen kostenlos prüfen oder erstellen?",
          answer: "Ich biete jeden Monat fünf kostenlose Plätze an, um Menschen beim Erstellen von Lebensläufen und Bewerbungsunterlagen zu unterstützen. Diese Hilfe ist komplett kostenfrei und richtet sich besonders an Menschen, die Unterstützung beim Bewerbungsprozess benötigen."
        },
        {
          question: "Wie kann ich dich am besten erreichen?",
          answer: "Am einfachsten per E-Mail an marcel.welk87@gmail.com oder über meinen Discord-Server, den du direkt über den Link auf der Webseite betreten kannst. Ich antworte normalerweise innerhalb von 24 Stunden."
        },
        {
          question: "Welche Unterlagen benötigst du von mir?",
          answer: "Deine aktuellen Daten, Zeugnisse, bisherige Arbeitserfahrungen und deine Wunschvorstellungen für die Bewerbung. Alles andere besprechen wir dann gemeinsam."
        }
      ]
    },
    {
      title: "Spezialisierung & Support",
      icon: <Briefcase className="h-5 w-5" />,
      faqs: [
        {
          question: "Kannst du mir auch helfen, wenn ich psychische Belastungen oder eine Schwerbehinderung habe?",
          answer: "Ja, genau darauf habe ich mich spezialisiert. Ich weiß aus eigener Erfahrung, wie schwer Bewerbungen sein können, wenn man zusätzliche persönliche Hürden hat. Ich helfe dir dabei, deinen Lebenslauf klar und professionell aufzubauen und unterstütze dich dabei, deine Stärken optimal zu präsentieren."
        },
        {
          question: "Kann ich auch Hilfe bei Anschreiben und anderen Bewerbungsunterlagen bekommen?",
          answer: "Ja, neben dem Lebenslauf helfe ich auch bei Anschreiben, Bewerbungsfotos, Google Sheets Bewerbungstrackern und der gesamten Bewerbungsstrategie. Für Menschen mit besonderen Bedürfnissen entwickle ich auch barrierefreie Bewerbungsunterlagen."
        },
        {
          question: "Hilfst du auch bei branchenspezifischen Bewerbungen?",
          answer: "Absolut! Ob IT, Handwerk, Pflege, Verwaltung oder kreative Bereiche - ich passe die Bewerbungsunterlagen an die spezifischen Anforderungen deiner Branche an und kenne die wichtigsten Keywords und Trends."
        }
      ]
    },
    {
      title: "Prozess & Technik",
      icon: <Settings className="h-5 w-5" />,
      faqs: [
        {
          question: "Nutzt du KI, um Bewerbungen zu verbessern?",
          answer: "Ja, ich setze moderne KI-Tools ein, um Bewerbungsprozesse einfacher und übersichtlicher zu machen. So können Lebensläufe schneller erstellt und verbessert werden. Dabei bleibt der persönliche Touch erhalten - die KI hilft uns nur dabei, effizienter zu arbeiten und ATS-optimierte Lebensläufe zu erstellen."
        },
        {
          question: "Wie läuft die Unterstützung ab?",
          answer: "Wir kommunizieren über Discord. Du brauchst lediglich einen PC oder Laptop, eine stabile Internetverbindung, ein Headset und optional eine Kamera. Dann können wir Schritt für Schritt an deinem Lebenslauf arbeiten und gemeinsam ein professionelles Ergebnis erstellen."
        },
        {
          question: "Welche technischen Voraussetzungen brauche ich?",
          answer: "Du benötigst einen Computer oder Laptop mit Internetverbindung, ein Mikrofon (Headset empfohlen) und optional eine Webcam. Discord läuft in jedem Browser, eine Installation ist nicht zwingend erforderlich."
        }
      ]
    },
    {
      title: "Zeitplanung & Ergebnisse",
      icon: <Clock className="h-5 w-5" />,
      faqs: [
        {
          question: "Wie lange dauert es, einen Lebenslauf zu erstellen?",
          answer: "Je nach Komplexität und deinen Wünschen dauert es zwischen 2-5 Tagen. Wir arbeiten gemeinsam daran, bis du mit dem Ergebnis vollständig zufrieden bist. Bei komplexeren Bewerbungsstrategien kann es auch länger dauern."
        },
        {
          question: "Was passiert nach der Erstellung meiner Bewerbungsunterlagen?",
          answer: "Du erhältst alle Dateien in verschiedenen Formaten (PDF, Word) und einen personalisierten Bewerbungstracker. Zusätzlich bekommst du Tipps für die Bewerbungsstrategie und kannst mich bei Fragen jederzeit kontaktieren."
        },
        {
          question: "Bietest du auch Follow-up Unterstützung?",
          answer: "Ja! Nach der Erstellung stehe ich dir für Anpassungen, Fragen zu Bewerbungsgesprächen oder Updates bei neuen Stellen zur Verfügung. Der Support ist Teil meiner kostenlosen Hilfe."
        }
      ]
    }
  ];
  
  // Flatten all FAQs for schema
  const faqs = faqCategories.flatMap(category => category.faqs);

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

          {/* FAQ Categories */}
          <div className="space-y-8 mb-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-primary">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                <div className="grid gap-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <Card key={faqIndex} className="card-soft">
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
              </div>
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