import Layout from '@/components/Layout';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewsList } from '@/components/ReviewsList';

const Reviews = () => {
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