import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Users, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const About = () => {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const highlights = [
    {
      icon: Heart,
      title: "Persönliche Erfahrung",
      description: "Ich weiß aus eigener Erfahrung, wie schwer Bewerbungen sein können"
    },
    {
      icon: Lightbulb,
      title: "Moderne Tools",
      description: "Nutzung von KI und Google Sheets für optimierte Bewerbungsprozesse"
    },
    {
      icon: Users,
      title: "Erfolgreiche Begleitung",
      description: "Ich unterstütze Menschen mit psychischen Belastungen oder Schwerbehinderungen erfolgreich."
    },
    {
      icon: Target,
      title: "Gemeinsamer Erfolg",
      description: "Ich gebe mein Bestes, damit wir gemeinsam erfolgreich sind."
    }
  ];

  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('about.title')} <span className="gradient-text">{t('about.story')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="flex justify-center">
          {/* Story Content - centered container */}
          <div className="animate-fade-up mx-auto max-w-3xl lg:max-w-4xl">
            <div className="space-y-6 text-lg leading-relaxed">
              {/* Always visible intro content */}
              <div>
                <p>
                  <strong className="text-foreground">{t('about.intro.greeting')}</strong> {t('about.intro.story')}
                </p>
                
                <p>
                  {t('about.intro.beginning')} <a href="/bewerbungshilfe" className="text-primary hover:underline">{t('about.intro.service')}</a> {t('about.intro.services')}
                </p>
                
                <p className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                  <strong className="text-accent">{t('about.intro.result')}</strong> {t('about.intro.example')} <a href="/reviews" className="text-primary hover:underline">{t('about.intro.reviews')}</a>.
                </p>
              </div>

              {/* Expandable content */}
              <div 
                id="about-more"
                className={`space-y-6 transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-expanded={isExpanded}
              >
                <p>
                  {t('about.expanded.tools')} <em className="text-primary font-medium">"{t('about.expanded.quote')}"</em> {t('about.expanded.faq')} <a href="/faq" className="text-primary hover:underline">{t('about.expanded.faq_link')}</a> {t('about.expanded.faq_end')}
                </p>
                
                <p>
                  {t('about.expanded.approach')}
                </p>
                
                <p>
                  {t('about.expanded.support')}
                </p>
              </div>

              {/* Toggle button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm sm:text-base px-4 py-2 flex items-center gap-2"
                  aria-expanded={isExpanded}
                  aria-controls="about-more"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      {t('about.toggle.less')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      {t('about.toggle.more')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Highlight boxes removed */}
        </div>
      </div>
    </section>
  );
};

export default About;