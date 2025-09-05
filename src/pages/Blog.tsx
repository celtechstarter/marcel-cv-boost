import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, FileText, Lightbulb, Heart, Zap } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "10 Tipps für einen perfekten Lebenslauf mit KI-Unterstützung",
      excerpt: "Erfahre, wie du moderne KI-Tools nutzen kannst, um deinen Lebenslauf zu optimieren und deine Chancen auf dem Arbeitsmarkt zu verbessern.",
      date: "2024-03-15",
      category: "CV-Design",
      icon: <Zap className="h-5 w-5" />,
      content: "Moderne KI-Tools können dir dabei helfen, deinen Lebenslauf zu optimieren. Hier sind meine besten Tipps für die Nutzung von KI bei der Bewerbungserstellung..."
    },
    {
      title: "Bewerbungen mit psychischen Belastungen - Du bist nicht allein",
      excerpt: "Wie du trotz psychischer Herausforderungen erfolgreich Bewerbungen schreibst und deine Stärken in den Vordergrund stellst.",
      date: "2024-03-10",
      category: "Motivation",
      icon: <Heart className="h-5 w-5" />,
      content: "Es ist völlig normal, dass Bewerbungen eine große Herausforderung darstellen können, besonders wenn du mit psychischen Belastungen zu kämpfen hast..."
    },
    {
      title: "Google Sheets Bewerbungstracker - Nie wieder den Überblick verlieren",
      excerpt: "Mit einem strukturierten Bewerbungstracker behältst du immer den Überblick über deine Bewerbungen und verpasst keine wichtigen Termine.",
      date: "2024-03-05",
      category: "Tools",
      icon: <FileText className="h-5 w-5" />,
      content: "Ein gut organisierter Bewerbungsprozess ist der halbe Erfolg. Mit meinem Google Sheets Bewerbungstracker behältst du den Überblick..."
    },
    {
      title: "Bewerbungsfotos im Jahr 2024 - Was wirklich wichtig ist",
      excerpt: "Moderne Bewerbungsfotos müssen nicht teuer sein. Erfahre, worauf es wirklich ankommt und wie du auch mit kleinem Budget professionell wirkst.",
      date: "2024-02-28",
      category: "Bewerbungsfotos",
      icon: <Lightbulb className="h-5 w-5" />,
      content: "Ein gutes Bewerbungsfoto muss nicht die Welt kosten. Hier zeige ich dir, wie du auch mit einfachen Mitteln ein professionelles Ergebnis erzielst..."
    },
    {
      title: "Discord für Bewerbungshilfe - Warum ich auf diese Plattform setze",
      excerpt: "Discord bietet ideale Voraussetzungen für effektive Bewerbungsberatung. Screen-Sharing, Voice-Chat und eine entspannte Atmosphäre.",
      date: "2024-02-20",
      category: "Methoden",
      icon: <FileText className="h-5 w-5" />,
      content: "Discord ist mehr als nur eine Gaming-Plattform. Für die Bewerbungsberatung bietet es ideale Funktionen..."
    },
    {
      title: "Barrierefreie Bewerbungen - Zugänglichkeit für alle",
      excerpt: "Wie du Bewerbungsunterlagen erstellst, die für alle Menschen zugänglich sind und dabei professionell und ansprechend wirken.",
      date: "2024-02-15",
      category: "Barrierefreiheit",
      icon: <Heart className="h-5 w-5" />,
      content: "Barrierefreiheit beginnt schon bei den Bewerbungsunterlagen. Hier erfährst du, wie du deine Bewerbung für alle zugänglich machst..."
    }
  ];

  return (
    <Layout>
      <main className="section-padding"
        style={{ marginTop: '4rem' }}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog & <span className="gradient-text">Tipps</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wertvolle Tipps rund um Bewerbungen, Lebenslauf-Design, KI-Tools und Motivation für deinen beruflichen Erfolg
            </p>
          </div>

          {/* Featured Post */}
          <Card className="card-soft mb-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Neuester Artikel</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {blogPosts[0].title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(blogPosts[0].date).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Marcel</span>
                </div>
              </div>
              <Button className="btn-primary">
                Weiterlesen <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post, index) => (
              <Card key={index} className="card-soft hover:shadow-medium transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-primary">
                      {post.icon}
                      <span className="text-sm font-medium">{post.category}</span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString('de-DE')}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      Lesen <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter CTA */}
          <Card className="card-soft mt-12 bg-accent/5 border-accent/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Bleib auf dem Laufenden
              </h3>
              <p className="text-muted-foreground mb-6">
                Erhalte die neuesten Tipps und Updates rund um Bewerbungen und Karriere direkt per E-Mail
              </p>
              <Button 
                className="btn-accent"
                onClick={() => window.location.href = 'mailto:marcel.welk87@gmail.com?subject=Newsletter Anmeldung'}
                aria-label="Newsletter abonnieren"
              >
                Newsletter abonnieren
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default Blog;