import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Wrench, MessageCircle, HelpCircle } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
interface RelatedPageProps {
  currentPage: 'home' | 'about' | 'services' | 'tools' | 'blog' | 'faq' | 'contact' | 'reviews';
}
export const RelatedPages = ({
  currentPage
}: RelatedPageProps) => {
  const {
    t
  } = useI18n();
  const allPages = [{
    id: 'services',
    title: 'Meine Leistungen',
    description: 'Professionelle Bewerbungshilfe: CV-Erstellung, Anschreiben-Optimierung und Interview-Vorbereitung',
    href: '/bewerbungshilfe',
    icon: <FileText className="h-5 w-5" />,
    relevantFor: ['home', 'about', 'tools', 'blog', 'faq', 'contact', 'reviews']
  }, {
    id: 'tools',
    title: 'KI-Tools & Software',
    description: 'Moderne Tools die ich für ATS-optimierte Bewerbungen nutze: ChatGPT, Canva, Perplexity Pro',
    href: '/tools',
    icon: <Wrench className="h-5 w-5" />,
    relevantFor: ['home', 'about', 'services', 'blog', 'faq', 'contact', 'reviews']
  }, {
    id: 'blog',
    title: 'Blog & Bewerbungstipps',
    description: 'Expertentipps für KI-Bewerbungen, Umgang mit psychischen Belastungen und Karriere-Strategien',
    href: '/blog',
    icon: <MessageCircle className="h-5 w-5" />,
    relevantFor: ['home', 'about', 'services', 'tools', 'faq', 'contact', 'reviews']
  }, {
    id: 'faq',
    title: 'Häufige Fragen',
    description: 'Antworten zu Datenschutz, Bewerbungsprozess und meiner kostenlosen Bewerbungshilfe',
    href: '/faq',
    icon: <HelpCircle className="h-5 w-5" />,
    relevantFor: ['home', 'about', 'services', 'tools', 'blog', 'contact', 'reviews']
  }];
  const relatedPages = allPages.filter(page => page.relevantFor.includes(currentPage) && page.id !== currentPage).slice(0, 3);
  if (relatedPages.length === 0) return null;
  return <section className="bg-gradient-to-r from-secondary/20 to-accent/20 border-t border-border/50 py-[64px] my-[40px]">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Das könnte dich auch interessieren
          </h2>
          <p className="text-muted-foreground">
            Entdecke weitere hilfreiche Informationen für deine erfolgreiche Bewerbung
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {relatedPages.map(page => <Card key={page.id} className="card-soft hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    {page.icon}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {page.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {page.description}
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all" asChild>
                  <a href={page.href} className="flex items-center gap-2">
                    Mehr erfahren
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};