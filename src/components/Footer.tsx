import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Marcel</h3>
            <p className="text-background/80 mb-4 leading-relaxed">
              Kostenlose Bewerbungshilfe für Menschen mit psychischen Problemen 
              oder Schwierigkeiten im Bewerbungsprozess. Weil jeder eine faire 
              Chance verdient.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-background/80">
                Mit Herzblut für deine berufliche Zukunft
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <nav className="space-y-2">
              <a href="#home" className="block text-background/80 hover:text-background transition-colors">
                Start
              </a>
              <a href="#about" className="block text-background/80 hover:text-background transition-colors">
                Über mich
              </a>
              <a href="#services" className="block text-background/80 hover:text-background transition-colors">
                Leistungen
              </a>
              <a href="#ablauf" className="block text-background/80 hover:text-background transition-colors">
                Ablauf
              </a>
              <a href="#contact" className="block text-background/80 hover:text-background transition-colors">
                Kontakt
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-background/60" />
                <a href="mailto:marcel.welk87@gmail.com" className="text-background/80 hover:text-background transition-colors">
                  marcel.welk87@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-background/60" />
                <a href="tel:+491234567890" className="text-background/80 hover:text-background transition-colors">
                  +49 (0) 123 456789
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-background/60" />
                <span className="text-background/80">Deutschland, Remote</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {currentYear} Marcel. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/impressum" className="text-background/60 hover:text-background transition-colors">
                Impressum
              </a>
              <a href="/datenschutz" className="text-background/60 hover:text-background transition-colors">
                Datenschutz
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;