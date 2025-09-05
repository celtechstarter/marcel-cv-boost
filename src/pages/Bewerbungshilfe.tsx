import Layout from '@/components/Layout';
import { SlotsBadge } from '@/components/SlotsBadge';
import { BookingForm } from '@/components/BookingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { callEdge } from '@/utils/callEdge';

const Bewerbungshilfe = () => {
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [privacyAcceptedRequest, setPrivacyAcceptedRequest] = useState(false);
  const { toast } = useToast();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.focus();
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingRequest(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      await callEdge('/requests/create', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          discord_name: formData.get('discord'),
          message: formData.get('message')
        })
      });

      toast({
        title: "Anfrage gesendet! 📨",
        description: "Ich melde mich schnellstmöglich bei dir. Vielen Dank für dein Vertrauen!",
      });

      (e.target as HTMLFormElement).reset();
      setPrivacyAcceptedRequest(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Senden",
        description: "Bitte versuche es erneut oder schreibe mir direkt an marcel.welk87@gmail.com",
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Kostenlose Bewerbungshilfe</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sichere dir einen der kostenlosen Plätze für professionelle Unterstützung bei deiner Bewerbung.
          </p>
          <SlotsBadge />
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => scrollToSection('anfrage-section')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Send className="mr-2 h-4 w-4" />
            Anfrage senden
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollToSection('termin-section')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Sofort Termin buchen
          </Button>
        </div>

        {/* Section 1: Anfrage senden */}
        <section 
          id="anfrage-section"
          className="scroll-mt-8"
          tabIndex={-1}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Kurze Anfrage senden
              </CardTitle>
              <p className="text-muted-foreground">
                Wenn du erst kurz schildern möchtest, wobei du Unterstützung brauchst, sende mir hier eine Anfrage. Ich melde mich zeitnah bei dir.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="request-name">Name *</Label>
                    <Input
                      id="request-name"
                      name="name"
                      placeholder="Dein Name"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="request-email">E-Mail *</Label>
                    <Input
                      id="request-email"
                      name="email"
                      type="email"
                      placeholder="deine@email.de"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="request-discord">Discord Name (optional)</Label>
                  <Input
                    id="request-discord"
                    name="discord"
                    placeholder="@deinname"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="request-message">Deine Nachricht *</Label>
                  <Textarea
                    id="request-message"
                    name="message"
                    placeholder="Beschreibe frei, wobei ich dir helfen kann..."
                    rows={4}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="request-privacy"
                    checked={privacyAcceptedRequest}
                    onCheckedChange={(checked) => setPrivacyAcceptedRequest(checked === true)}
                    required
                  />
                  <Label htmlFor="request-privacy" className="text-sm leading-relaxed cursor-pointer">
                    Ich stimme der <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> zu. *
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmittingRequest || !privacyAcceptedRequest}
                >
                  {isSubmittingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Kostenlose Anfrage senden
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Termin buchen */}
        <section 
          id="termin-section"
          className="scroll-mt-8"
          tabIndex={-1}
        >
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Direkt Termin buchen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wenn du direkt loslegen möchtest, buche dir hier sofort einen freien Termin.
            </p>
          </div>
          <BookingForm />
        </section>

        {/* SEO Meta Tags */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Kostenlose Bewerbungshilfe - Marcel CV Boost",
              "description": "Sichere dir einen kostenlosen Platz für professionelle Bewerbungsunterstützung. Anfrage senden oder direkt Termin buchen.",
              "url": "https://marcel-cv-boost.lovable.dev/bewerbungshilfe"
            })
          }}
        />
      </div>
    </Layout>
  );
};

export default Bewerbungshilfe;