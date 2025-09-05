import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SupabaseTest } from "@/components/SupabaseTest";
import { SlotsBadge } from "@/components/SlotsBadge";
import { BookingForm } from "@/components/BookingForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <SlotsBadge />
          </div>
        </div>
        <About />
        <Services />
        <ProcessSection />
        <Contact />
        
        {/* Booking Section */}
        <section id="booking" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">Termin buchen</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Buchen Sie direkt einen kostenlosen Beratungstermin
              </p>
            </div>
            <BookingForm />
          </div>
        </section>
        
        {/* Temporary Supabase Test - Remove in production */}
        <div className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <SupabaseTest />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
