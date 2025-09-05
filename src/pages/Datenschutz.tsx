import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Datenschutz = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Datenschutzerklärung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Datenschutz auf einen Blick</h2>
                <h3 className="text-lg font-medium mb-2">Allgemeine Hinweise</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                  passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                  persönlich identifiziert werden können.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Datenerfassung auf dieser Website</h2>
                
                <h3 className="text-lg font-medium mb-2">Bewertungen</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Wenn Sie eine Bewertung abgeben, erheben wir folgende Daten:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li>Name</li>
                  <li>E-Mail-Adresse</li>
                  <li>Bewertungstext und Titel</li>
                  <li>Bewertung (Sterne)</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Diese Daten werden zur Verifizierung und Veröffentlichung Ihrer Bewertung verwendet. 
                  Ihre E-Mail-Adresse wird nicht öffentlich angezeigt.
                </p>

                <h3 className="text-lg font-medium mb-2">Terminbuchungen</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Bei Terminbuchungen erheben wir:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li>Name</li>
                  <li>E-Mail-Adresse</li>
                  <li>Discord-Name (optional)</li>
                  <li>Terminwünsche und Notizen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Datenverarbeitung</h2>
                
                <h3 className="text-lg font-medium mb-2">Supabase</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Wir verwenden Supabase für die sichere Speicherung und Verarbeitung Ihrer Daten. 
                  Supabase entspricht den DSGVO-Anforderungen und bietet hohe Sicherheitsstandards.
                </p>

                <h3 className="text-lg font-medium mb-2">Resend (E-Mail-Versand)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Für den Versand von Bestätigungs- und Verifizierungs-E-Mails nutzen wir den Dienst Resend. 
                  Dabei werden Ihre E-Mail-Adresse und der Nachrichteninhalt an Resend übertragen.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Ihre Rechte</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Sie haben jederzeit das Recht:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
                  <li>Berichtigung unrichtiger Daten zu verlangen</li>
                  <li>Löschung Ihrer Daten zu fordern</li>
                  <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                  <li>Ihre Daten in einem strukturierten Format zu erhalten</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Kontakt</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bei Fragen zum Datenschutz wenden Sie sich bitte an:
                  <br />
                  <strong>Marcel Welk</strong>
                  <br />
                  E-Mail: marcel.welk87@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Änderungen dieser Datenschutzerklärung</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Diese Datenschutzerklärung kann bei Bedarf aktualisiert werden. 
                  Die aktuelle Version finden Sie stets auf dieser Seite.
                </p>
              </section>

              <p className="text-xs text-muted-foreground mt-8">
                Stand: Januar 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SEO Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Datenschutzerklärung - Marcel CV Boost",
            "description": "Datenschutzerklärung für Marcel CV Boost Service",
            "url": "https://marcel-cv-boost.lovable.dev/datenschutz"
          })
        }}
      />
    </Layout>
  );
};

export default Datenschutz;