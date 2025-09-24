import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Impressum = () => {
  return (
    <Layout>
      <Helmet>
        <title>Impressum - Rechtliche Angaben | Marcel CV Boost</title>
        <meta name="description" content="Impressum und rechtliche Angaben von Marcel Welk für kostenlose Bewerbungshilfe und Lebenslauf-Erstellung." />
        <link rel="canonical" href="https://marcel-cv-boost.lovable.app/impressum" />
        <link rel="alternate" hrefLang="de" href="https://marcel-cv-boost.lovable.app/impressum" />
        <link rel="alternate" hrefLang="x-default" href="https://marcel-cv-boost.lovable.app/impressum" />
      </Helmet>
      
      <main className="container mx-auto px-4 py-16" role="main">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold mb-2">Impressum - Rechtliche Angaben</h1>
              <p className="text-muted-foreground">
                Rechtliche Informationen gemäß § 5 TMG für Marcel CV Boost - Ihr kostenloser Bewerbungsservice
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
                <div className="space-y-2">
                  <p><strong>Name:</strong> Marcel Welk</p>
                  <p><strong>E-Mail:</strong> marcel.welk@bewerbungsmensch.de</p>
                  <p><strong>Adresse:</strong> Musterstraße 123<br />12345 Musterstadt<br />Deutschland</p>
                  <p><strong>Website:</strong> https://marcel-cv-boost.lovable.dev</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
                <p>E-Mail: marcel.welk@bewerbungsmensch.de</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p>Marcel Welk<br />
                E-Mail: marcel.welk@bewerbungsmensch.de</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Haftung für Inhalte</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                  unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Haftung für Links</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                  Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
                  verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Urheberrecht</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                  Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                  Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Weitere Informationen</h2>
                <nav className="space-y-2" aria-label="Zusätzliche rechtliche Seiten">
                  <p>
                    <Link to="/datenschutz" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </Link>
                    {" "}- Informationen zum Umgang mit Ihren Daten
                  </p>
                  <p>
                    <Link to="/barrierefreiheit" className="text-primary hover:underline">
                      Barrierefreiheit
                    </Link>
                    {" "}- Unser Engagement für zugängliche Webinhalte
                  </p>
                  <p>
                    <Link to="/" className="text-primary hover:underline">
                      Startseite
                    </Link>
                    {" "}- Zurück zur Hauptseite mit kostenloser Bewerbungshilfe
                  </p>
                  <p>
                    <Link to="/bewerbungshilfe" className="text-primary hover:underline">
                      Bewerbungshilfe
                    </Link>
                    {" "}- Kostenlose Unterstützung für Ihre Bewerbung
                  </p>
                </nav>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* SEO Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Impressum - Marcel CV Boost",
            "description": "Impressum und rechtliche Angaben für Marcel CV Boost Service",
            "url": "https://marcel-cv-boost.lovable.app/impressum"
          })
        }}
      />
    </Layout>
  );
};

export default Impressum;