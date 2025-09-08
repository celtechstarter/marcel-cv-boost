import { useEffect } from "react";
import Layout from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/data/tools";
import { Wrench, Zap } from "lucide-react";

const Tools = () => {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Tools für ATS-optimierte Bewerbungen | Marcel Welk";
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'KI-Tools für professionelle Bewerbungen: ChatGPT Pro, Perplexity Pro, Canva & Google Sheets. Erstelle ATS-optimierte Lebensläufe mit modernsten Tools.');
    
    // Add keywords for AI search
    let keywords = document.querySelector('meta[name="keywords"]');
    if (!keywords) {
      keywords = document.createElement('meta');
      keywords.setAttribute('name', 'keywords');
      document.head.appendChild(keywords);
    }
    keywords.setAttribute('content', 'ChatGPT Bewerbung, Perplexity Jobsuche, Canva Lebenslauf, Google Sheets Bewerbungstracker, KI Tools Bewerbung, ATS optimiert');
    
    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://marcel-cv-boost.lovable.dev/tools');
    
    // Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: 'Tools für ATS-optimierte Bewerbungen | Marcel Welk' },
      { property: 'og:description', content: 'KI-Tools für professionelle Bewerbungen: ChatGPT Pro, Perplexity Pro, Canva & Google Sheets für ATS-optimierte Lebensläufe.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://marcel-cv-boost.lovable.dev/tools' }
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
    
    // Twitter Card Tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Tools für ATS-optimierte Bewerbungen | Marcel Welk' },
      { name: 'twitter:description', content: 'KI-Tools für professionelle Bewerbungen: ChatGPT Pro, Perplexity Pro, Canva & Google Sheets für ATS-optimierte Lebensläufe.' }
    ];
    
    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', tag.content);
    });
    
    // Optional JSON-LD ItemList schema
    const toolsSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Tools für professionelle Bewerbungen",
      "description": "Empfohlene KI-Tools und Software für ATS-optimierte Bewerbungsunterlagen",
      "numberOfItems": tools.length,
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": tool.name,
        "description": tool.description,
        "url": tool.url
      }))
    };
    
    let script = document.querySelector('script[type="application/ld+json"][data-tools]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-tools', 'true');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(toolsSchema);
  }, []);

  return (
    <Layout>
      <main className="section-padding" style={{ marginTop: '4rem' }}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Tools, die ich für <span className="gradient-text">deine Bewerbung</span> nutze
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Moderne KI-Tools und bewährte Software ermöglichen es mir, ATS-freundliche Lebensläufe zu erstellen, 
              die sowohl Algorithmen als auch Personalverantwortliche überzeugen. Hier sind die wichtigsten 
              Werkzeuge, die ich für deine erfolgreiche Bewerbung einsetze.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border border-primary/20">
            <div className="flex items-start gap-4">
              <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Warum diese Tools?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Jedes Tool hat seinen spezifischen Zweck: <strong>ChatGPT Pro</strong> für intelligente Formulierungen 
                  und ATS-Optimierung, <strong>Perplexity Pro</strong> für präzise Jobrecherche, <strong>Canva</strong> 
                  für professionelles Design und <strong>Google Sheets</strong> für systematisches Bewerbungsmanagement. 
                  Zusammen bilden sie das perfekte Toolkit für deine erfolgreiche Bewerbung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Tools;