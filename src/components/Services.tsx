import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Palette, Bot, TableProperties, Camera, Star } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Services = () => {
  const { t } = useI18n();
  
  const serviceIcons = [FileText, Palette, Bot, TableProperties, Camera, Star];
  const serviceColors = ["text-primary", "text-accent", "text-primary", "text-accent", "text-primary", "text-accent"];
  
  const servicesData = t('services.services', []);
  const services = Array.isArray(servicesData) ? servicesData.map((service: any, index: number) => ({
    ...service,
    icon: serviceIcons[index],
    color: serviceColors[index]
  })) : [];
  return <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.title').split(' ')[0]} <span className="gradient-text">{t('services.title').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => <Card key={index} className="card-soft hover:shadow-medium transition-all duration-300 group animate-fade-up" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <service.icon className={`h-6 w-6 ${service.color} group-hover:scale-110 transition-transform duration-300`} />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features && service.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${service.color === 'text-primary' ? 'bg-primary' : 'bg-accent'}`}></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="card-soft max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                {t('services.cta.title').split('5')[0]}<span className="gradient-text">5{t('services.cta.title').split('5')[1]}</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                {t('services.cta.subtitle')}
              </p>
              <Button size="lg" className="btn-accent text-lg px-8 py-3" asChild>
                <a href="/bewerbungshilfe#termin" className="my-0 px-0 mx-px">
                  <FileText className="mr-2 h-5 w-5" />
                  {t('services.cta.button')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default Services;