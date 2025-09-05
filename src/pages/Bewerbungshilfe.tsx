import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callEdge } from "@/utils/callEdge";
import { SlotsBadge } from "@/components/SlotsBadge";
import { CvDropzone } from "@/components/CvDropzone";
import Layout from "@/components/Layout";

const Bewerbungshilfe = () => {
  const [activeSection, setActiveSection] = useState<'anfrage' | 'termin'>('anfrage');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [cvPath, setCvPath] = useState<string>('');
  const [mailStatus, setMailStatus] = useState<'sent' | 'not_sent' | null>(null);
  const { toast } = useToast();

  const scrollToSection = (section: 'anfrage' | 'termin') => {
    setActiveSection(section);
    const sectionId = section === 'anfrage' ? 'anfrage' : 'termin';
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Set focus for screen readers with timeout to ensure smooth scroll completes
      setTimeout(() => {
        const heading = element.querySelector('h2');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      }, 500);
    }
  };

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
      
      const res = await callEdge('/requests/create', { body: JSON.stringify(requestData) });
      
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
      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuche es später erneut oder schreibe direkt an marcel.welk87@gmail.com",
        variant: "destructive",
      });
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const startsAt = new Date(formData.get('datetime') as string);
    const duration = parseInt(formData.get('duration') as string);
    
    try {
      const bookingData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        discord_name: formData.get('discord_name') as string || '',
        note: formData.get('note') as string || '',
        starts_at: startsAt.toISOString(),
        duration_minutes: duration,
      };
      
      const res = await callEdge('/bookings/create', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
      
      if (res?.mail === 'not_sent') {
        setMailStatus('not_sent');
      } else if (res?.mail === 'sent') {
        setMailStatus('sent');
      } else {
        setMailStatus(null);
      }
      
      toast({
        title: "Termin erfolgreich gebucht! 🎉",
        description: "Du erhältst eine Bestätigungs-E-Mail mit allen Details. Ich freue mich auf unser Gespräch!",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Fehler bei der Buchung",
        description: error instanceof Error ? error.message : "Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <Layout>
      <main id="main" className="container mx-auto px-4 py-16 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Kostenlose Bewerbungshilfe</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Wähle den Weg, der am besten zu dir passt: Sende eine kurze Anfrage oder buche direkt einen Termin für persönliche Beratung.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <SlotsBadge />
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={activeSection === 'anfrage' ? 'default' : 'outline'}
            onClick={() => scrollToSection('anfrage')}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Anfrage senden
          </Button>
          <Button
            variant={activeSection === 'termin' ? 'default' : 'outline'}
            onClick={() => scrollToSection('termin')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Sofort Termin buchen
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Section 1: Contact Request */}
          <section id="anfrage" className="scroll-mt-24">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl">Kurze Anfrage senden</h2>
                </CardTitle>
                <p className="text-muted-foreground">
                  Wenn du erst kurz schildern möchtest, wobei du Unterstützung brauchst, sende mir hier eine Anfrage. 
                  Ich melde mich zeitnah bei dir.
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

          {/* Section 2: Direct Booking */}
          <section id="termin" className="scroll-mt-24">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl">Direkt Termin buchen</h2>
                </CardTitle>
                <p className="text-muted-foreground">
                  Wenn du direkt loslegen möchtest, buche dir hier sofort einen freien Termin.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="booking-name">Name *</Label>
                      <Input
                        id="booking-name"
                        name="name"
                        placeholder="Dein Name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-email">E-Mail *</Label>
                      <Input
                        id="booking-email"
                        name="email"
                        type="email"
                        placeholder="deine@email.de"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="discord_name">Discord Name (optional)</Label>
                    <Input
                      id="discord_name"
                      name="discord_name"
                      placeholder="deinname#1234"
                      className="mt-1"
                      aria-describedby="discord-help"
                    />
                    <p id="discord-help" className="text-sm text-muted-foreground mt-1">
                      Wenn vorhanden, erleichtert das den Termin. Alternativ sende ich dir einen Discord-Link.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="datetime">Wunschtermin *</Label>
                      <Input
                        id="datetime"
                        name="datetime"
                        type="datetime-local"
                        required
                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Dauer</Label>
                      <select
                        id="duration"
                        name="duration"
                        required
                        className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                         <option value="30">30 Minuten</option>
                         <option value="45">45 Minuten</option>
                         <option value="60" selected>60 Minuten</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="note">Anmerkungen (optional)</Label>
                    <Textarea
                      id="note"
                      name="note"
                      placeholder="Was möchtest du besprechen? Gibt es spezielle Wünsche?"
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="booking-privacy"
                      required
                      className="mt-1"
                    />
                    <Label htmlFor="booking-privacy" className="text-sm leading-relaxed cursor-pointer">
                      Ich stimme der{" "}
                      <a href="/datenschutz" className="text-primary hover:underline">
                        Datenschutzerklärung
                      </a>{" "}
                      zu. *
                    </Label>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Hinweis:</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Termine finden über Discord statt. Du erhältst eine Bestätigung per E-Mail mit allen Details.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">Wichtig:</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Bitte keine Dokumente über Discord senden. Nutze für Unterlagen ausschließlich den Upload hier auf der Seite. So bleiben deine Daten geschützt.
                    </p>
                  </div>

                  {mailStatus === 'not_sent' && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">Hinweis zum E-Mail-Versand:</span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Buchung erfolgreich, aber E-Mail konnte nicht gesendet werden. Bitte prüfe später dein Postfach oder kontaktiere mich direkt unter marcel.welk87@gmail.com.
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-3" 
                    disabled={isSubmittingBooking}
                  >
                    {isSubmittingBooking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wird gebucht...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-5 w-5" />
                        Kostenlosen Termin buchen
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Bewerbungshilfe;