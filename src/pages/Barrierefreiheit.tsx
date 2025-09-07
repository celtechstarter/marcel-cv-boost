import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";

const Barrierefreiheit = () => {
  return (
    <>
      <Helmet>
        <title>Barrierefreiheitserklärung - KI Bewerbungshelfer</title>
        <meta 
          name="description" 
          content="Erklärung zur Barrierefreiheit unserer Website gemäß BITV 2.0 und EU-Richtlinie 2016/2102." 
        />
        <link rel="canonical" href="https://ki-bewerbungshelfer.de/barrierefreiheit" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Barrierefreiheitserklärung",
            "description": "Erklärung zur Barrierefreiheit unserer Website gemäß BITV 2.0",
            "url": "https://ki-bewerbungshelfer.de/barrierefreiheit"
          })}
        </script>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            Erklärung zur Barrierefreiheit
          </h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Unser Engagement für Barrierefreiheit</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                KI Bewerbungshelfer ist bestrebt, seine Website für alle Menschen zugänglich zu machen, 
                unabhängig von ihren Fähigkeiten oder Beeinträchtigungen. Wir arbeiten kontinuierlich 
                daran, die Benutzerfreundlichkeit und Zugänglichkeit unserer Website zu verbessern.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Konformitätsstatus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Diese Website ist <strong>teilweise konform</strong> mit den 
                <a 
                  href="https://www.w3.org/WAI/WCAG21/quickref/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Web Content Accessibility Guidelines (WCAG) 2.1
                </a> 
                auf Level AA gemäß der Barrierefreie-Informationstechnik-Verordnung (BITV 2.0).
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Implementierte Maßnahmen:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Semantische HTML-Struktur mit korrekten Überschriftenhierarchien</li>
                <li>Vollständige Tastaturnavigation für alle interaktiven Elemente</li>
                <li>ARIA-Attribute und Landmarks für Screenreader</li>
                <li>Ausreichende Farbkontraste und fokussierbare Elemente</li>
                <li>Responsive Design für alle Gerätegrößen</li>
                <li>Alternative Texte für Bilder und Grafiken</li>
                <li>Barrierefreie Formulare mit Labels und Fehlermeldungen</li>
                <li>Respektierung der Nutzereinstellung "prefers-reduced-motion"</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bekannte Einschränkungen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Wir arbeiten kontinuierlich an der Verbesserung der Barrierefreiheit. 
                Zurzeit bekannte Bereiche für Verbesserungen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Einige dynamische Inhalte könnten für Screenreader optimiert werden</li>
                <li>Video-Inhalte (falls vorhanden) benötigen noch Untertitel</li>
                <li>Bestimmte komplexe Interaktionen werden weiter vereinfacht</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Feedback und Kontakt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Wir freuen uns über Ihr Feedback zur Barrierefreiheit unserer Website. 
                Falls Sie auf Barrieren stoßen oder Verbesserungsvorschläge haben, 
                kontaktieren Sie uns gerne:
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Kontakt für Barrierefreiheit:</h4>
                <p><strong>E-Mail:</strong> barrierefreiheit@ki-bewerbungshelfer.de</p>
                <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                <p><strong>Antwortzeit:</strong> Wir bemühen uns, innerhalb von 5 Werktagen zu antworten</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Durchsetzungsverfahren</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Bei nicht zufriedenstellenden Antworten können Sie sich an die 
                Durchsetzungsstelle wenden:
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Schlichtungsstelle nach dem BGG:</h4>
                <p>Schlichtungsstelle nach dem Behindertengleichstellungsgesetz</p>
                <p>bei dem Beauftragten der Bundesregierung für die Belange von Menschen mit Behinderungen</p>
                <p>Mauerstraße 53, 10117 Berlin</p>
                <p>
                  <a 
                    href="https://www.schlichtungsstelle-bgg.de" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.schlichtungsstelle-bgg.de
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diese Erklärung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Diese Erklärung wurde am <strong>7. September 2025</strong> erstellt und 
                entspricht den Anforderungen der BITV 2.0 sowie der EU-Richtlinie 2016/2102.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Letzte Überprüfung: September 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default Barrierefreiheit;