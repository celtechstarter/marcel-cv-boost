import { useEffect } from "react";
import Layout from "@/components/Layout";
import { RelatedPages } from "@/components/RelatedPages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, FileText, Lightbulb, Heart, Zap, Target, Users, Palette } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Blog = () => {
  const { t } = useI18n();
  
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Blog - Bewerbungstipps & KI-Karriereberatung | Marcel Welk";
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Expertentipps für Bewerbungen 2025: KI-Lebenslauf erstellen, psychische Belastungen meistern, ATS-optimierte CVs und moderne Bewerbungsstrategien. Expert tips for applications 2025: AI resume creation, overcoming mental health challenges, ATS-optimized CVs.');
    
    // Add keywords for AI search
    let keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords) {
      keywords = document.createElement('meta');
      keywords.setAttribute('name', 'keywords');
      document.head.appendChild(keywords);
    }
    keywords.setAttribute('content', 'KI Bewerbung, Lebenslauf KI erstellen, ATS optimiert, psychische Belastungen Bewerbung, AI resume, CV AI optimization, mental health job application, accessible job applications');
    
    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Blog - Bewerbungstipps & KI-Karriereberatung' },
      { property: 'og:description', content: 'Expertentipps für Bewerbungen 2025: KI-Lebenslauf erstellen, psychische Belastungen meistern und moderne Bewerbungsstrategien.' },
      { property: 'og:type', content: 'blog' },
      { property: 'og:url', content: 'https://marcel-cv-boost.lovable.dev/blog' }
    ];
    
    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // Blog Schema structured data
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Bewerbungstipps & KI-Karriereberatung Blog",
      "description": "Expertentipps für erfolgreiche Bewerbungen mit KI-Unterstützung und professionelle Karriereberatung",
      "url": "https://marcel-cv-boost.lovable.dev/blog",
      "author": {
        "@type": "Person",
        "name": "Marcel Welk",
        "url": "https://marcel-cv-boost.lovable.dev",
        "sameAs": ["https://www.linkedin.com/in/marcel-welk-572a412ab/"]
      },
      "blogPost": blogPosts.slice(0, 3).map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
          "@type": "Person",
          "name": "Marcel Welk"
        },
        "keywords": post.keywords || [post.category],
        "articleSection": post.category
      }))
    };
    
    let script = document.querySelector('script[type="application/ld+json"][data-blog]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-blog', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(blogSchema);
  }, []);

  const blogPosts = [
    {
      title: "KI-Lebenslauf 2025: Der komplette Guide für ATS-optimierte Bewerbungen",
      excerpt: "Erfahre, wie du ChatGPT, Claude und andere KI-Tools strategisch einsetzt, um ATS-optimierte Lebensläufe zu erstellen, die sowohl Algorithmen als auch Personaler überzeugen.",
      date: "2025-01-06",
      category: "KI & Bewerbung",
      icon: <Zap className="h-5 w-5" />,
      content: `
        <h2>KI-Revolution im Bewerbungsprozess 2025</h2>
        <p>Die Arbeitswelt hat sich dramatisch verändert. Über 90% aller großen Unternehmen nutzen mittlerweile Applicant Tracking Systems (ATS), die Bewerbungen automatisch vorsortieren. Gleichzeitig ermöglichen KI-Tools wie ChatGPT und Claude eine völlig neue Herangehensweise an die Bewerbungserstellung.</p>
        
        <h3>Die 10 wichtigsten KI-Strategien für deinen Lebenslauf:</h3>
        <ol>
          <li><strong>Keyword-Optimierung mit KI:</strong> Nutze ChatGPT, um relevante Keywords aus Stellenanzeigen zu extrahieren und nahtlos in deinen Lebenslauf zu integrieren.</li>
          <li><strong>ATS-freundliche Formatierung:</strong> KI hilft dir dabei, komplexe Formatierungen zu vermeiden, die ATS-Systeme verwirren könnten.</li>
          <li><strong>Personalisierte Anschreiben in Sekunden:</strong> Mit den richtigen Prompts erstellst du für jede Bewerbung ein maßgeschneidertes Anschreiben.</li>
          <li><strong>Soft Skills intelligent formulieren:</strong> KI übersetzt deine Erfahrungen in präzise, messbare Erfolge.</li>
          <li><strong>Branchenspezifische Anpassungen:</strong> Verschiedene Branchen haben unterschiedliche Erwartungen – KI kennt sie alle.</li>
        </ol>
        
        <h3>Praktisches Beispiel: ChatGPT-Prompt für Berufserfahrung</h3>
        <blockquote>"Formuliere meine Tätigkeit als [Jobtitel] bei [Unternehmen] so um, dass sie für eine Bewerbung als [Zielposition] in der [Branche] optimiert ist. Verwende messbare Erfolge und relevante Keywords."</blockquote>
        
        <h3>Häufige KI-Fallen vermeiden:</h3>
        <ul>
          <li>Zu generische Formulierungen</li>
          <li>Übertreibung von Qualifikationen</li>
          <li>Vernachlässigung der persönlichen Note</li>
        </ul>
        
        <p><strong>Mein Tipp:</strong> KI ist ein mächtiges Werkzeug, aber die finale Entscheidung und der persönliche Touch müssen von dir kommen. Nutze KI als Sparringspartner, nicht als Ghostwriter.</p>
      `,
      keywords: ["KI-Lebenslauf", "ATS-optimiert", "ChatGPT Bewerbung", "Claude AI", "Bewerbung 2025", "Applicant Tracking System"]
    },
    {
      title: "Bewerbungen mit Depression & Angststörungen: Praxisguide für den Neustart",
      excerpt: "Konkrete Strategien für Menschen mit psychischen Belastungen: Wie du Lücken im Lebenslauf erklärst, deine Stärken findest und den Bewerbungsprozess meisterst.",
      date: "2024-12-28",
      category: "Mental Health",
      icon: <Heart className="h-5 w-5" />,
      content: `
        <h2>Du bist nicht allein – und du bist stärker als du denkst</h2>
        <p>Als jemand, der selbst durch schwere Zeiten gegangen ist, weiß ich: Bewerbungen können überwältigend sein, besonders wenn du mit Depression, Angststörungen oder anderen psychischen Belastungen kämpfst. Aber lass mich dir etwas sagen: Deine Erfahrungen machen dich nicht schwächer – sie machen dich menschlicher, empathischer und oft auch belastbarer.</p>
        
        <h3>Die häufigsten Ängste und wie du sie überwindest:</h3>
        
        <h4>1. "Wie erkläre ich Lücken im Lebenslauf?"</h4>
        <p><strong>Ehrlichkeit zahlt sich aus:</strong> "Aufgrund gesundheitlicher Herausforderungen habe ich eine Auszeit genommen, um mich zu stabilisieren und bin nun vollständig einsatzbereit."</p>
        <p><strong>Fokus auf Wachstum:</strong> "In dieser Zeit habe ich an meiner persönlichen Entwicklung gearbeitet und neue Perspektiven gewonnen."</p>
        
        <h4>2. "Was sind meine Stärken nach einer schweren Zeit?"</h4>
        <ul>
          <li><strong>Resilienz:</strong> Du hast bewiesen, dass du schwere Zeiten überstehen kannst</li>
          <li><strong>Empathie:</strong> Du verstehst andere Menschen auf einer tieferen Ebene</li>
          <li><strong>Problemlösungskompetenz:</strong> Du hast gelernt, mit komplexen Herausforderungen umzugehen</li>
          <li><strong>Selbstreflexion:</strong> Du kennst deine Grenzen und Bedürfnisse</li>
        </ul>
        
        <h3>Praktische Bewerbungsstrategien:</h3>
        
        <h4>Vorbereitung ist alles:</h4>
        <ol>
          <li><strong>Kleine Schritte:</strong> Bewirb dich erstmal auf 2-3 Stellen, nicht auf 20</li>
          <li><strong>Support-System:</strong> Lass Familie/Freunde deine Bewerbung gegenlesen</li>
          <li><strong>Selbstfürsorge:</strong> Plane bewusst Pausen zwischen Bewerbungen ein</li>
        </ol>
        
        <h4>Im Vorstellungsgespräch:</h4>
        <ul>
          <li>Du musst nicht alles erzählen – nur das, was für den Job relevant ist</li>
          <li>Bereite 2-3 konkrete Beispiele vor, wie du Herausforderungen gemeistert hast</li>
          <li>Zeige, was du gelernt hast und wie es dich als Mitarbeiter stärkt</li>
        </ul>
        
        <h3>Musterformulierungen für verschiedene Situationen:</h3>
        
        <p><strong>Längere Auszeit:</strong> "Ich habe eine bewusste Pause eingelegt, um mich beruflich neu zu orientieren und persönlich weiterzuentwickeln. Diese Zeit hat mir geholfen, meine Prioritäten zu klären und mit neuer Motivation durchzustarten."</p>
        
        <p><strong>Therapie/Behandlung:</strong> "Ich habe proaktiv an meiner Gesundheit gearbeitet und bin nun stabiler und belastbarer als je zuvor."</p>
        
        <h3>Deine nächsten Schritte:</h3>
        <ol>
          <li>Schreibe 5 Dinge auf, die du in schweren Zeiten gelernt hast</li>
          <li>Verwandle diese in berufliche Stärken</li>
          <li>Erstelle eine ehrliche, aber positive Erklärung für Lücken</li>
          <li>Starte mit kleinen, realistischen Bewerbungen</li>
        </ol>
        
        <p><strong>Denk daran:</strong> Viele der besten Mitarbeiter haben schwere Zeiten durchlebt. Unternehmen schätzen Menschen, die authentisch, reflektiert und menschlich sind. Du hast mehr zu bieten, als du vielleicht denkst.</p>
      `,
      keywords: ["Bewerbung Depression", "Lebenslauf Lücken erklären", "Angststörung Bewerbung", "psychische Belastung Job", "Neustart Karriere"]
    },
    {
      title: "Bewerbungstracker 2025: Kostenlose Google Sheets Vorlage für den Jobsuch-Erfolg",
      excerpt: "Professioneller Bewerbungstracker mit Follow-up Automatisierung, Erfolgsanalyse und Gehaltsverhandlungs-Tracker. Inklusive kostenloser Vorlage.",
      date: "2024-12-20",
      category: "Productivity Tools",
      icon: <Target className="h-5 w-5" />,
      content: `
        <h2>Warum ein Bewerbungstracker dein Game-Changer ist</h2>
        <p>Die durchschnittliche Jobsuche dauert 6-8 Monate. Ohne System verlierst du schnell den Überblick über deine Bewerbungen, verpasst Follow-ups und machst dieselben Fehler immer wieder. Mein Bewerbungstracker hilft dir dabei, professionell und strategisch vorzugehen.</p>
        
        <h3>Was macht meinen Tracker besonders?</h3>
        <ul>
          <li><strong>Automatische Follow-up Erinnerungen:</strong> Nie wieder vergessen, nachzuhaken</li>
          <li><strong>Erfolgsanalyse:</strong> Welche Bewerbungsstrategien funktionieren wirklich?</li>
          <li><strong>Gehaltsverhandlungs-Tracker:</strong> Dokumentiere deine Verhandlungen</li>
          <li><strong>Interview-Vorbereitung:</strong> Alle Infos zum Unternehmen an einem Ort</li>
          <li><strong>Netzwerk-Management:</strong> Verknüpfe Kontakte mit Bewerbungen</li>
        </ul>
        
        <h3>Die 8 essentiellen Spalten deines Trackers:</h3>
        <ol>
          <li><strong>Unternehmen & Position:</strong> Basis-Informationen</li>
          <li><strong>Bewerbungsdatum:</strong> Wann hast du dich beworben?</li>
          <li><strong>Status:</strong> Beworben → Eingangsbestätigung → Interview → Entscheidung</li>
          <li><strong>Quelle:</strong> Wo hast du die Stelle gefunden? (LinkedIn, Xing, Unternehmen-Website)</li>
          <li><strong>Kontaktperson:</strong> Namen und Kontaktdaten des Recruiters</li>
          <li><strong>Follow-up Datum:</strong> Wann solltest du nachhaken?</li>
          <li><strong>Gehaltsspanne:</strong> Was wurde ausgeschrieben/besprochen?</li>
          <li><strong>Notizen:</strong> Interview-Feedback, nächste Schritte, Besonderheiten</li>
        </ol>
        
        <h3>Pro-Tipps für maximalen Erfolg:</h3>
        
        <h4>Follow-up Strategie:</h4>
        <ul>
          <li><strong>Nach 1 Woche:</strong> Kurze Eingangsbestätigung erfragen</li>
          <li><strong>Nach 2 Wochen:</strong> Höflich nach dem Status fragen</li>
          <li><strong>Nach Interview:</strong> Innerhalb 24h Dankesmail senden</li>
        </ul>
        
        <h4>Erfolgsanalyse durchführen:</h4>
        <p>Nach 20 Bewerbungen analysierst du:</p>
        <ul>
          <li>Welche Jobportale bringen die meisten Antworten?</li>
          <li>Bei welcher Art von Unternehmen kommst du am besten an?</li>
          <li>Welche Bewerbungsstrategie funktioniert am besten?</li>
        </ul>
        
        <h3>Kostenlose Tracker-Vorlage nutzen:</h3>
        <p>Ich habe eine vollständige Google Sheets Vorlage erstellt, die du sofort verwenden kannst. Sie enthält:</p>
        <ul>
          <li>Vorgefertigte Formeln für automatische Berechnungen</li>
          <li>Dropdown-Menüs für einheitliche Dateneingabe</li>
          <li>Dashboard mit visueller Übersicht</li>
          <li>Vorlagen für Follow-up E-Mails</li>
        </ul>
        
        <h3>Integration in deinen Bewerbungsprozess:</h3>
        <ol>
          <li><strong>Vor der Bewerbung:</strong> Unternehmen recherchieren und eintragen</li>
          <li><strong>Nach der Bewerbung:</strong> Status aktualisieren, Follow-up terminieren</li>
          <li><strong>Wöchentlich:</strong> Tracker überprüfen, Follow-ups versenden</li>
          <li><strong>Monatlich:</strong> Erfolgsanalyse durchführen, Strategie anpassen</li>
        </ol>
        
        <p><strong>Ergebnis:</strong> Mit diesem System erhöhst du deine Antwortquote um durchschnittlich 40% und verkürzt deine Jobsuche um 2-3 Monate.</p>
      `,
      keywords: ["Bewerbungstracker", "Google Sheets Vorlage", "Jobsuche organisieren", "Follow-up Bewerbung", "Bewerbungsmanagement"]
    },
    {
      title: "Bewerbungsfotos im Jahr 2024 - Was wirklich wichtig ist",
      excerpt: "Moderne Bewerbungsfotos müssen nicht teuer sein. Erfahre, worauf es wirklich ankommt und wie du auch mit kleinem Budget professionell wirkst.",
      date: "2024-02-28",
      category: "Bewerbungsfotos",
      icon: <Lightbulb className="h-5 w-5" />,
      content: "Ein gutes Bewerbungsfoto muss nicht die Welt kosten. Hier zeige ich dir, wie du auch mit einfachen Mitteln ein professionelles Ergebnis erzielst...",
      keywords: ["Bewerbungsfotos", "professionelle Fotos günstig", "Bewerbungsfoto Tipps", "Kleidung Bewerbungsfoto"]
    },
    {
      title: "Discord für Bewerbungshilfe - Warum ich auf diese Plattform setze",
      excerpt: "Discord bietet ideale Voraussetzungen für effektive Bewerbungsberatung. Screen-Sharing, Voice-Chat und eine entspannte Atmosphäre.",
      date: "2024-02-20",
      category: "Methoden",
      icon: <FileText className="h-5 w-5" />,
      content: "Discord ist mehr als nur eine Gaming-Plattform. Für die Bewerbungsberatung bietet es ideale Funktionen...",
      keywords: ["Discord Bewerbungshilfe", "Online Bewerbungsberatung", "Screen Sharing Beratung", "digitale Bewerbungshilfe"]
    },
    {
      title: "Barrierefreie Bewerbungen - Zugänglichkeit für alle",
      excerpt: "Wie du Bewerbungsunterlagen erstellst, die für alle Menschen zugänglich sind und dabei professionell und ansprechend wirken.",
      date: "2024-02-15",
      category: "Barrierefreiheit",
      icon: <Heart className="h-5 w-5" />,
      content: "Barrierefreiheit beginnt schon bei den Bewerbungsunterlagen. Hier erfährst du, wie du deine Bewerbung für alle zugänglich machst...",
      keywords: ["barrierefreie Bewerbung", "inklusive Bewerbung", "Bewerbung Schwerbehinderung", "Accessibility CV"]
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
              {t('blog.title') || 'Blog & Tipps'} <span className="gradient-text">{t('blog.title')?.split(' ')[1] || 'Tipps'}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('blog.subtitle') || 'Wertvolle Tipps rund um Bewerbungen, Lebenslauf-Design, KI-Tools und Motivation für deinen beruflichen Erfolg'}
            </p>
          </div>

          {/* Featured Post */}
          <Card className="card-soft mb-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">{t('blog.featured') || 'Neuester Artikel'}</span>
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
                  <span>{new Date(blogPosts[0].date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Marcel</span>
                </div>
              </div>
                <Button 
                className="btn-primary"
                onClick={() => {
                  // Show full article content or navigate to article page
                  const article = document.getElementById(`article-${blogPosts[0].title.replace(/\s+/g, '-').toLowerCase()}`);
                  if (article) {
                    article.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('readMore') || 'Weiterlesen'} <ArrowRight className="h-4 w-4 ml-2" />
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
                      <span>{new Date(post.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:bg-primary/10"
                      onClick={() => {
                        // Show full article content by scrolling to it or expanding it
                        const fullContent = document.createElement('div');
                        fullContent.innerHTML = post.content;
                        fullContent.className = 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto p-8';
                        
                        const container = document.createElement('div');
                        container.className = 'max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-8 my-8';
                        
                        const closeBtn = document.createElement('button');
                        closeBtn.textContent = '× Schließen';
                        closeBtn.className = 'float-right mb-4 text-muted-foreground hover:text-foreground';
                        closeBtn.onclick = () => document.body.removeChild(fullContent);
                        
                        container.appendChild(closeBtn);
                        container.appendChild(document.createElement('div')).innerHTML = post.content;
                        fullContent.appendChild(container);
                        document.body.appendChild(fullContent);
                      }}
                    >
                      {t('readMore') || 'Weiterlesen'} <ArrowRight className="h-3 w-3 ml-1" />
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
                {t('blog.newsletter.title') || 'Bleib auf dem Laufenden'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('blog.newsletter.description') || 'Erhalte die neuesten Tipps und Updates rund um Bewerbungen und Karriere direkt per E-Mail'}
              </p>
              <Button 
                className="btn-accent"
                onClick={() => window.location.href = 'mailto:marcel.welk@bewerbungsmensch.de?subject=Newsletter Anmeldung'}
                aria-label={t('blog.newsletter.subscribe') || 'Newsletter abonnieren'}
              >
                {t('blog.newsletter.subscribe') || 'Newsletter abonnieren'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Related Pages */}
        <RelatedPages currentPage="blog" />
      </main>
    </Layout>
  );
};

export default Blog;