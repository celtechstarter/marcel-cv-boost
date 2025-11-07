import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callEdge } from "@/utils/callEdge";
import { CvDropzone } from "@/components/CvDropzone";
import Layout from "@/components/Layout";
import { z } from "zod";

const requestSchema = z.object({
  name: z.string().trim().min(1, 'Name ist erforderlich').max(100, 'Name darf maximal 100 Zeichen lang sein'),
  email: z.string().trim().email('Ungültige E-Mail-Adresse').max(255, 'E-Mail darf maximal 255 Zeichen lang sein'),
  discord_name: z.string().trim().max(50, 'Telefon darf maximal 50 Zeichen lang sein').optional(),
  message: z.string().trim().min(10, 'Nachricht muss mindestens 10 Zeichen lang sein').max(2000, 'Nachricht darf maximal 2000 Zeichen lang sein'),
  cv_path: z.string().max(500, 'Dateipfad zu lang').nullable().optional()
});

const Bewerbungshilfe = () => {
  useEffect(() => {
    // SEO optimization for main service page
    document.title = "Bewerbungshilfe kostenlos - Lebenslauf erstellen lassen | Marcel Welk";
    
    // Set meta description for this critical landing page
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Kostenlose Bewerbungshilfe: Lebenslauf erstellen lassen mit KI-Unterstützung. Professionelle CV Hilfe für Menschen mit psychischen Belastungen.');
    
    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://bewerbungsmensch.de/bewerbungshilfe');
    
    // Open Graph tags for social sharing
    const ogTags = [
      { property: 'og:title', content: 'Bewerbungshilfe kostenlos - Lebenslauf erstellen lassen' },
      { property: 'og:description', content: 'Kostenlose Bewerbungshilfe mit KI-Unterstützung. Professionelle CV Hilfe für Menschen mit besonderen Herausforderungen.' },
      { property: 'og:type', content: 'service' },
      { property: 'og:url', content: 'https://bewerbungsmensch.de/bewerbungshilfe' }
    ];
    
    ogTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!existingTag) {
        existingTag = document.createElement('meta');
        existingTag.setAttribute('property', tag.property);
        document.head.appendChild(existingTag);
      }
      existingTag.setAttribute('content', tag.content);
    });
  }, []);

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [cvPath, setCvPath] = useState<string>('');
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const requestData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        discord_name: formData.get('phone') as string || '', // Using phone field as discord for compatibility
        message: formData.get('situation') as string || '',
        cv_path: cvPath || null,
      };
      
      // Validate input data
      const validated = requestSchema.parse(requestData);
      
      const res = await callEdge('/requests/create', { body: JSON.stringify(validated) });
      
      toast({
        title: "Nachricht gesendet! 📨",
        description: "Danke, deine Anfrage ist eingegangen. Ich melde mich zeitnah.",
      });

      // Show mail status warning if needed
      if (res.mail === 'not_sent') {
        toast({
          title: "⚠️ E-Mail-Problem",
          description: "Deine Anfrage wurde gespeichert, aber es gab ein Problem beim E-Mail-Versand. Ich kontaktiere dich trotzdem!",
          variant: "default",
        });
      }
      
      (e.target as HTMLFormElement).reset();
      setCvPath('');
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        toast({
          title: "Eingabefehler",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler beim Senden",
          description: "Bitte versuche es später erneut oder schreibe direkt an marcel.welk@bewerbungsmensch.de",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleCvUploaded = (path: string, fileName: string) => {
    setCvPath(path);
  };

  const handleCvRemoved = () => {
    setCvPath('');
  };

  return (
    <Layout>
      <main id="main" className="container mx-auto px-4 py-16 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kostenlose Bewerbungshilfe</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Sende mir eine Anfrage und beschreibe, wobei ich dir helfen kann. Ich melde mich zeitnah bei dir.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Contact Request Section */}
          <section id="anfrage" className="scroll-mt-24">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl">Anfrage senden</h2>
                </CardTitle>
                <p className="text-muted-foreground">
                  Beschreibe kurz, wobei du Unterstützung brauchst. Ich melde mich zeitnah bei dir.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Name *</Label>
                      <Input
                        id="contact-name"
                        name="name"
                        placeholder="Dein Name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">E-Mail *</Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="deine@email.de"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <CvDropzone 
                    onFileUploaded={handleCvUploaded}
                    onFileRemoved={handleCvRemoved}
                  />

                  <div>
                    <Label htmlFor="contact-phone">Telefon (optional)</Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="+49 123 456789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="situation">Beschreibe frei, wobei ich dir helfen kann *</Label>
                    <Textarea
                      id="situation"
                      name="situation"
                      placeholder="Schreibe einfach ganz frei, wo du Probleme siehst und ich helfe dir schnell weiter."
                      rows={4}
                      className="mt-1"
                      required
                      aria-describedby="help-description"
                    />
                    <p id="help-description" className="text-sm text-muted-foreground mt-1">
                      Teile mit, was dich beschäftigt - ich bin hier, um zu helfen.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="help">Gewünschte Hilfe (optional)</Label>
                    <Textarea
                      id="help"
                      name="help"
                      placeholder="Was genau brauchst du? (z.B. kompletter Lebenslauf, Design-Optimierung, Bewerbungstracker, etc.)"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="contact-privacy"
                      required
                      className="mt-1"
                    />
                    <Label htmlFor="contact-privacy" className="text-sm leading-relaxed cursor-pointer">
                      Ich stimme der{" "}
                      <a href="/datenschutz" className="text-primary hover:underline">
                        Datenschutzerklärung
                      </a>{" "}
                      zu. *
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-3" 
                    disabled={isSubmittingContact}
                  >
                    {isSubmittingContact ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Kostenlose Anfrage senden
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* SEO Meta Tags */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Kostenlose Bewerbungshilfe",
              "description": "Professionelle Bewerbungshilfe und Lebenslauf-Erstellung kostenlos für Menschen mit besonderen Herausforderungen.",
              "provider": {
                "@type": "Person",
                "name": "Marcel Welk"
              },
              "areaServed": "Deutschland",
              "url": "https://bewerbungsmensch.de/bewerbungshilfe",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              }
            })
          }}
        />
      </main>
    </Layout>
  );
};

export default Bewerbungshilfe;