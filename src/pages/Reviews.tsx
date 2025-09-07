import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';

const Reviews = () => {
  useEffect(() => {
    // SEO Meta Tags - only update if missing or incorrect
    document.title = "Kundenbewertungen - Kostenlose Bewerbungshilfe Erfahrungen | Marcel Welk";
    
    // Update meta description for Reviews page
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Lesen Sie echte Bewertungen zur kostenlosen Bewerbungshilfe. Erfahrungen mit KI-gestützter Lebenslauf-Erstellung und professionellem Bewerbungscoaching.');
    
    // Add Open Graph tags for social sharing
    const ogTags = [
      { property: 'og:title', content: 'Kundenbewertungen - Kostenlose Bewerbungshilfe' },
      { property: 'og:description', content: 'Echte Erfahrungen mit kostenloser Bewerbungshilfe und KI-gestützter Lebenslauf-Erstellung.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://marcel-cv-boost.lovable.dev/reviews' }
    ];
    
    ogTags.forEach(tag => {
      let existingTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!existingTag) {
        existingTag = document.createElement('meta');
        existingTag.setAttribute('property', tag.property);
        document.head.appendChild(existingTag);
      }
      existingTag.setAttribute('content', tag.content);
    });
  }, []);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Bewertungen</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lesen Sie, was unsere Kunden über unseren Service sagen, oder hinterlassen Sie selbst eine Bewertung.
          </p>
        </div>

        {/* Reviews List */}
        <section>
          <ReviewsList />
        </section>

        {/* Review Form */}
        <section className="border-t pt-16">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Ihre Erfahrung teilen</h2>
            <p className="text-lg text-muted-foreground">
              Helfen Sie anderen mit Ihrer ehrlichen Bewertung
            </p>
          </div>
          <ReviewForm />
        </section>
      </div>

      {/* SEO Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Kundenbewertungen - Marcel CV Boost",
            "description": "Lesen Sie Bewertungen unserer Kunden und teilen Sie Ihre eigene Erfahrung mit unserem CV Boost Service.",
            "url": "https://marcel-cv-boost.lovable.dev/reviews"
          })
        }}
      />
    </Layout>
  );
};

export default Reviews;