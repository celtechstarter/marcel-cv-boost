import { Heart, Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900/95 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">{t('footer.brand.title')}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
              {t('footer.brand.description')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-neutral-600 dark:text-neutral-400">{t('footer.brand.tagline')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.navigation.title')}</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.home')}</a>
              <a href="/#about" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.about')}</a>
              <a href="/#services" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.services')}</a>
              <a href="/#ablauf" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.process')}</a>
              
              <a href="/faq" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.faq')}</a>
              <a href="/blog" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.blog')}</a>
              <a href="/tools" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.tools')}</a>
              {/* Additional internal links for SEO */}
              <a href="/bewerbungshilfe" className="block text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.navigation.help')}</a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact.title')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <a href="mailto:marcel.welk@bewerbungsmensch.de" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.contact.email')}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <a href="tel:+491234567890" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.contact.phone')}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <span className="text-neutral-600 dark:text-neutral-400">{t('footer.contact.location')}</span>
              </div>
              {/* Social links - stacked vertically */}
              <div className="space-y-2 text-sm mt-3">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                  <a
                    href="https://www.linkedin.com/in/marcel-welk-572a412ab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="LinkedIn-Profil von Marcel (öffnet in neuem Tab)"
                  >
                    {t('footer.contact.linkedin')}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                  <a
                    href="https://github.com/celtechstarter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="GitHub – Profil von Marcel"
                  >
                    {t('footer.contact.github')}
                  </a>
                </div>
                {/* Additional Social Media Links */}
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Icon" className="h-6 w-6" />
                  <a
                    href="https://facebook.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="Facebook-Profil (Coming Soon)"
                  >
                    {t('footer.contact.facebook')}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/icons/tiktok.svg" alt="TikTok Icon" className="h-5 w-5 opacity-80" aria-hidden="true" />
                  <a
                    href="https://tiktok.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="TikTok-Profil (Coming Soon)"
                  >
                    {t('footer.contact.tiktok')}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram Icon" className="h-6 w-6" />
                  <a
                    href="https://instagram.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="Instagram-Profil (Coming Soon)"
                  >
                    {t('footer.contact.instagram')}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                  <a
                    href="https://twitter.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="X (Twitter)-Profil (Coming Soon)"
                  >
                    {t('footer.contact.twitter')}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" alt="YouTube Icon" className="h-6 w-6" />
                  <a
                    href="https://youtube.com/your-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    aria-label="YouTube-Profil (Coming Soon)"
                  >
                    {t('footer.contact.youtube')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">{t('footer.legal.copyright', { year: currentYear })}</p>
            <div className="flex gap-6 text-sm">
              <a href="/impressum" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.legal.imprint')}</a>
              <a href="/datenschutz" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.legal.privacy')}</a>
              <a href="/barrierefreiheit" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">{t('footer.legal.accessibility')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
