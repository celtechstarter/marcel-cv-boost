import { Button } from "@/components/ui/button";
import { Heart, Users, FileText } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import logoImage from "@/assets/bewerbungsmensch-logo.png";

const Hero = () => {
  const { t } = useI18n();
  
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-7xl mx-auto section-padding px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-up">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t('hero.subtitle')}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {/* Mobile CTA button - responsive, no overflow, proper wrapping */}
              <Button
                size="lg"
                className="
                  inline-flex items-center justify-center gap-2
                  font-medium ring-offset-background transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  disabled:pointer-events-none disabled:opacity-50
                  [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
                  bg-primary text-primary-foreground hover:bg-primary/90
                  h-11 rounded-md btn-accent
                  w-full sm:w-auto max-w-[calc(100vw-2rem)]
                  px-4 sm:px-8 py-3 text-base sm:text-lg
                  whitespace-normal break-words
                "
                aria-label={t('cta.bookNow')}
                asChild
              >
                <a href="#contact">
                  <FileText className="mr-2 h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
                  <span className="sm:hidden">{t('cta.bookNowShort')}</span>
                  <span className="hidden sm:inline">{t('cta.bookNow')}</span>
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto" asChild>
                <a href="#about"><span className="truncate">{t('hero.cta.secondary')}</span></a>
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span>{t('benefits.free')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <span>{t('benefits.personal')}</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in">
            <div className="relative z-10">
              <img
                src={logoImage}
                alt="Bewerbungsmensch - Professionelle Bewerbungshilfe"
                className="rounded-2xl shadow-large w-full h-auto"
                loading="eager"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;