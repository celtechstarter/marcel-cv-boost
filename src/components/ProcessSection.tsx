import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Laptop, Headphones, Camera, ExternalLink } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const ProcessSection = () => {
  const { t } = useI18n();
  
  const requirementIcons = [<Laptop className="h-6 w-6" />, <Headphones className="h-6 w-6" />, <Camera className="h-6 w-6" />];
  const requirementsData = t('process.requirements.items', []);
  const requirements = Array.isArray(requirementsData) ? requirementsData.map((req: any, index: number) => ({
    ...req,
    icon: requirementIcons[index]
  })) : [];

  return (
    <section className="section-padding bg-muted/30" id="ablauf">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('process.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('process.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                {t('process.communication.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('process.communication.description')}
              </p>
              <Button 
                className="w-full btn-primary"
                onClick={() => window.open("https://discord.gg/your-server-link", "_blank")}
                aria-label={t('process.communication.button')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('process.communication.button')}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader>
              <CardTitle>{t('process.requirements.title')}</CardTitle>
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
                  <strong>Wichtig:</strong> {t('process.requirements.important')}
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t('process.requirements.alternatives.text1')}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-3">
                  {t('process.requirements.alternatives.text2')}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-3">
                  {t('process.requirements.alternatives.text3')}
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