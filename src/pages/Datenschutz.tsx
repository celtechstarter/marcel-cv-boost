import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Datenschutz = () => {
  return (
    <Layout>
      <main className="container mx-auto px-4 py-16" role="main">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              {/* Main H1 for SEO */}
              <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
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
                <h2 className="text-xl font-semibold mb-3">2. Datenerfassung und Verwendung</h2>
                
                <h3 className="text-lg font-medium mb-2">Bewerbungsunterstützung</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Alle erhobenen Daten werden ausschließlich für die Bewerbungsunterstützung genutzt. 
                  Wir verwenden Ihre Informationen, um Ihnen bestmögliche Hilfe bei Lebenslauf und Bewerbung zu bieten.
                </p>

                <h3 className="text-lg font-medium mb-2">Bewertungen</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Wenn Sie eine Bewertung abgeben, erheben wir folgende Daten:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li>Name</li>
                  <li>E-Mail-Adresse (nicht öffentlich sichtbar)</li>
                  <li>Bewertungstext und Titel</li>
                  <li>Bewertung (Sterne)</li>
                </ul>

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
                <h2 className="text-xl font-semibold mb-3">3. Datenspeicherung und -verarbeitung</h2>
                
                <h3 className="text-lg font-medium mb-2">Supabase (EU-Server)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Wir verwenden Supabase für die sichere Speicherung und Verarbeitung Ihrer Daten. 
                  Supabase entspricht den DSGVO-Anforderungen und speichert alle Daten auf EU-Servern.
                </p>

                <h3 className="text-lg font-medium mb-2">E-Mail-Versand über Resend</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Für den Versand von Bestätigungs- und Verifizierungs-E-Mails nutzen wir den Dienst Resend. 
                  Dabei werden Ihre E-Mail-Adresse und der Nachrichteninhalt verschlüsselt übertragen.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Datenweitergabe</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  <strong>Keine Weitergabe an Dritte:</strong> Ihre Daten werden nicht an Dritte weitergegeben, 
                  verkauft oder anderweitig kommerziell genutzt. Sie bleiben ausschließlich in unserem System 
                  für die Bewerbungsunterstützung.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Ihre Rechte</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Sie haben jederzeit das Recht:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li><strong>Recht auf Auskunft:</strong> Welche Daten über Sie gespeichert sind</li>
                  <li><strong>Recht auf Löschung:</strong> Vollständige Entfernung Ihrer Daten</li>
                  <li><strong>Recht auf Berichtigung:</strong> Korrektur unrichtiger Daten</li>
                  <li><strong>Recht auf Datenübertragbarkeit:</strong> Erhalt Ihrer Daten in strukturiertem Format</li>
                  <li><strong>Recht auf Einschränkung:</strong> Beschränkung der Datenverarbeitung</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Kontakt für Datenschutzfragen</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
                  <br />
                  <strong>Marcel Welk</strong>
                  <br />
                  E-Mail: marcel.welk87@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Änderungen dieser Datenschutzerklärung</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Diese Datenschutzerklärung kann bei Bedarf aktualisiert werden, um rechtlichen Änderungen 
                  oder Verbesserungen unseres Services zu entsprechen. Die aktuelle Version finden Sie stets auf dieser Seite.
                </p>
              </section>

              <p className="text-xs text-muted-foreground mt-8">
                Stand: Januar 2025
              </p>
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
            "name": "Datenschutzerklärung - Marcel CV Boost",
            "description": "Datenschutzerklärung für Marcel CV Boost Service - DSGVO-konform",
            "url": "https://marcel-cv-boost.lovable.app/datenschutz"
          })
        }}
      />
    </Layout>
  );
};

export default Datenschutz;