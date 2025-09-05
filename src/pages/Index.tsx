import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProcessSection from "@/components/ProcessSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SlotsBadge } from "@/components/SlotsBadge";

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
