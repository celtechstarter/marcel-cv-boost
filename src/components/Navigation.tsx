import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const navItems = [
    { href: "/#home", label: t('navigation.items.home'), title: t('navigation.titles.home') },
    { href: "/#about", label: t('navigation.items.about'), title: t('navigation.titles.about') },
    { href: "/#services", label: t('navigation.items.services'), title: t('navigation.titles.services') },
    { href: "/#ablauf", label: t('navigation.items.process'), title: t('navigation.titles.process') },
    { href: "/bewerbungshilfe", label: t('navigation.items.help'), title: t('navigation.titles.help') },
    { href: "/reviews", label: t('navigation.items.reviews'), title: t('navigation.titles.reviews') },
    { href: "/faq", label: t('navigation.items.faq'), title: t('navigation.titles.faq') },
    { href: "/blog", label: t('navigation.items.blog'), title: t('navigation.titles.blog') },
    { href: "/#contact", label: t('navigation.items.contact'), title: t('navigation.titles.contact') },
  ];

  const isActiveRoute = (href: string) => {
    if (href.startsWith('/#')) return false; // Hash links are not "active" routes
    return location.pathname === href;
  };

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Skip Link */}
      <a 
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        {t('navigation.skipLink')}
      </a>

      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-md' 
            : 'bg-background/80 backdrop-blur-md border-b border-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a 
                 href="/" 
                className="text-xl font-semibold gradient-text focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                title="Zur Startseite - Marcel Bewerbungshilfe"
              >
                Marcel
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6 lg:space-x-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    className={`whitespace-nowrap text-foreground/80 hover:text-primary transition-all duration-300 font-medium focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                      isActiveRoute(item.href) 
                        ? 'text-primary after:scale-x-100 after:h-0.5 after:bg-primary' 
                        : ''
                    }`}
                    aria-current={isActiveRoute(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                ))}
                <LanguageSwitcher />
                <ThemeToggle />
                <Button 
                  variant="default" 
                  className="btn-accent whitespace-nowrap" 
                  asChild
                >
                  <a 
                    href="/bewerbungshilfe#anfrage"
                    aria-label={t('navigation.titles.help')}
                  >
                    {t('navigation.requestButton')}
                  </a>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMenuToggle}
                aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="focus:ring-2 focus:ring-primary"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div 
              id="mobile-menu"
              className="md:hidden animate-fade-in motion-reduce:animate-none"
              role="dialog"
              aria-modal="true"
              aria-label="Hauptmenü"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2 shadow-medium border border-border/50">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    className={`block px-3 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors duration-300 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isActiveRoute(item.href) 
                        ? 'text-primary bg-muted border-l-4 border-primary' 
                        : ''
                    }`}
                    onClick={handleMenuItemClick}
                    aria-current={isActiveRoute(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-2">
                  <Button 
                    variant="default" 
                    className="btn-accent w-full" 
                    asChild
                  >
                    <a 
                      href="/bewerbungshilfe#anfrage" 
                      onClick={handleMenuItemClick}
                      aria-label={t('navigation.titles.help')}
                    >
                      {t('navigation.requestButton')}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;