import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SupabaseTest } from "@/components/SupabaseTest";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <ProcessSection />
        <Contact />
        
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
