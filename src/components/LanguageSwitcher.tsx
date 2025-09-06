import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const languages = [
  { code: 'de' as const, label: 'DE', name: 'Deutsch' },
  { code: 'en' as const, label: 'EN', name: 'English' },
  { code: 'tr' as const, label: 'TR', name: 'Türkçe' },
  { code: 'ru' as const, label: 'RU', name: 'Русский' },
  { code: 'ar' as const, label: 'AR', name: 'العربية' },
  { code: 'uk' as const, label: 'UK', name: 'Українська' },
  { code: 'pl' as const, label: 'PL', name: 'Polski' }
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: typeof locale) => {
    setLocale(langCode);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, langCode?: typeof locale) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (langCode) {
        handleLanguageChange(langCode);
      } else {
        setIsOpen(!isOpen);
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => handleKeyDown(e)}
        aria-label={t('language.select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1 h-9 px-2 focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLanguage.label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-[120px]"
            role="listbox"
            aria-label={t('language.select')}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                onKeyDown={(e) => handleKeyDown(e, lang.code)}
                role="option"
                aria-selected={lang.code === locale}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-accent focus:bg-accent focus:outline-none first:rounded-t-md last:rounded-b-md ${
                  lang.code === locale ? 'bg-accent font-medium' : ''
                }`}
              >
                <span className="font-medium">{lang.label}</span>
                <span className="ml-2 text-muted-foreground">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}