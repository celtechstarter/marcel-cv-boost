import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Clock, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots] = useState(3); // This would come from backend
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Nachricht gesendet! 📨",
      description: "Ich melde mich schnellstmöglich bei dir unter marcel.welk87@gmail.com. Vielen Dank für dein Vertrauen!",
    });
    
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-Mail",
      value: "marcel.welk87@gmail.com",
      link: "mailto:marcel.welk87@gmail.com"
    },
    {
      icon: Phone,
      title: "Telefon",
      value: "+49 (0) 123 456789",
      link: "tel:+491234567890"
    },
    {
      icon: MapPin,
      title: "Standort",
      value: "Deutschland, Remote",
      link: null
    }
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lass uns <span className="gradient-text">sprechen</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bereit für deinen neuen Lebenslauf? Schreib mir eine Nachricht und 
            sichere dir einen der kostenlosen Plätze.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Bewerbungshilfe anfragen
                </CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-accent font-medium">
                    Noch {availableSlots} von 5 kostenlosen Plätzen verfügbar
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Dein Name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="deine@email.de"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefon (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+49 123 456789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="situation">Deine Situation</Label>
                    <Textarea
                      id="situation"
                      name="situation"
                      placeholder="Schreibe einfach ganz frei, wo du Probleme siehst und ich helfe dir schnell weiter."
                      rows={4}
                      className="mt-1"
                      aria-describedby="help-description"
                    />
                    <p id="help-description" className="text-sm text-muted-foreground mt-1">
                      Teile mit, was dich beschäftigt - ich bin hier, um zu helfen.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="help">Gewünschte Hilfe</Label>
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
                      id="privacy"
                      required
                      className="mt-1"
                    />
                    <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                      Ich stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu. 
                      Die Daten werden vertraulich behandelt und nicht an Dritte weitergegeben. *
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="btn-accent w-full text-lg py-3" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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

                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full mt-3 text-sm"
                    aria-label="Hier geht's direkt zur Terminbuchung (CV-Upload möglich)"
                    title="Direkt zur Terminbuchung – hier kannst du auch deinen CV hochladen"
                  >
                    <Link to="/bewerbungshilfe#termin">
                      <Calendar className="mr-2 h-4 w-4" />
                      Hier geht's direkt zur Terminbuchung <span className="text-muted-foreground">(Lade deinen CV hoch, falls du einen hast)</span>
                    </Link>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      {item.link ? (
                        <a 
                          href={item.link} 
                          className="text-primary hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Antwortzeit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ich antworte normalerweise innerhalb von 24 Stunden auf alle Anfragen.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mo - Fr:</span>
                    <span className="text-accent">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wochenende:</span>
                    <span className="text-muted-foreground">Nach Vereinbarung</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick FAQ */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle>Häufige Fragen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Wie lange dauert die CV-Erstellung?</p>
                  <p className="text-muted-foreground">Je nach Komplexität 2-5 Tage.</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Ist die Hilfe wirklich kostenlos?</p>
                  <p className="text-muted-foreground">Ja, für 5 Personen pro Monat komplett kostenfrei.</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Welche Unterlagen benötigst du?</p>
                  <p className="text-muted-foreground">Aktuelle Daten, Zeugnisse und deine Wunschvorstellungen.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;