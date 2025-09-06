import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Laptop, Headphones, Camera, ExternalLink } from "lucide-react";

const ProcessSection = () => {
  const requirements = [
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "PC oder Laptop",
      description: "Ein funktionsfähiger Computer für unsere gemeinsame Arbeit"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Headset",
      description: "Für klare Kommunikation während unserer Gespräche"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Kamera (optional)",
      description: "Falls du persönlichen Kontakt bevorzugst"
    }
  ];

  return (
    <section className="section-padding bg-muted/30" id="ablauf">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ablauf & Was wird benötigt
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            So einfach funktioniert unsere Zusammenarbeit
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                Kommunikation über Discord
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Wir arbeiten hauptsächlich über Discord zusammen. Das ermöglicht uns eine 
                schnelle und unkomplizierte Kommunikation während des gesamten Prozesses.
              </p>
              <Button 
                className="w-full btn-primary"
                onClick={() => window.open("https://discord.gg/your-server-link", "_blank")}
                aria-label="Discord Server beitreten"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Discord Server beitreten
              </Button>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Was du benötigst</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-primary mt-1">
                      {req.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{req.title}</h4>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm">
                  <strong>Wichtig:</strong> Eine funktionierende Internetverbindung ist 
                  Voraussetzung für unsere Zusammenarbeit.
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Falls du keinen Laptop oder PC hast, können wir das auch ganz bequem über andere Medien machen. Wie z.B. schriftlich über WhatsApp oder E-Mail. So wie es für dich am angenehmsten ist.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-3">
                  Außerdem nutze ich Discord für die Kommunikation. Das kannst du dir ganz einfach herunterladen und dir einen Account erstellen. Danach kannst du meinem Discord-Server beitreten, indem du auf den blauen Button „Discord Server beitreten" klickst.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-3">
                  Weitere Fragen können wir gerne per E-Mail klären. Mach dir keinen Stress, wir bekommen das alles gemeinsam hin!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;