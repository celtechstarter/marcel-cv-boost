import { Heart, Mail, Phone, MapPin, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900/95 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Marcel</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
              Kostenlose Lebenslauf Hilfe und Bewerbungshilfe online für Menschen mit psychischen Belastungen, 
              Schwerbehinderung oder anderen Herausforderungen. Professioneller Lebenslauf kostenlos mit 
              KI-Unterstützung. Weil jeder eine faire Chance verdient.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Mit Herzblut für deine berufliche Zukunft
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Start
              </a>
              <a href="/#about" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Über mich
              </a>
              <a href="/#services" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Leistungen
              </a>
              <a href="/#ablauf" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Ablauf
              </a>
              <a href="/reviews" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Bewertungen
              </a>
              <a href="/faq" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                FAQ
              </a>
              <a href="/blog" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Blog
              </a>
              <a href="/tools" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Tools
              </a>
              {/* Additional internal links for SEO */}
              <a href="/bewerbungshilfe" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Bewerbungshilfe
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <a href="mailto:marcel.welk87@gmail.com" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  marcel.welk87@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <a href="tel:+491234567890" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                  +49 (0) 123 456789
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="text-neutral-600 dark:text-neutral-400">Deutschland, Remote</span>
              </div>
              {/* Social links */}
              <div className="flex items-center gap-4 text-sm mt-3">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <a 
                    href="https://www.linkedin.com/in/marcel-welk-572a412ab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="LinkedIn-Profil von Marcel (öffnet in neuem Tab)"
                  >
                    LinkedIn
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-neutral-500 dark:text-neutral-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <a 
                    href="https://github.com/celtechstarter"
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="GitHub – celtechstarter"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              © {currentYear} Marcel. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/impressum" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Impressum
              </a>
              <a href="/datenschutz" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Datenschutz
              </a>
              <a href="/barrierefreiheit" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Barrierefreiheit
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;