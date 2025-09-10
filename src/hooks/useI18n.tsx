import React, { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type Locale = 'de' | 'en' | 'tr' | 'ru' | 'ar' | 'uk' | 'pl';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isLoaded: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, any>> = {
  de: {},
  en: {},
  tr: {},
  ru: {},
  ar: {},
  uk: {},
  pl: {}
};

async function loadTranslation(locale: Locale, namespace: string) {
  try {
    const url = '/locales/' + locale + '/' + namespace + '.json';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!translations[locale]) translations[locale] = {};
    translations[locale][namespace] = data;
  } catch (error) {
    // Only warn if it's not a missing file (404) - those are expected for some locales
    if (error instanceof Error && !error.message.includes('404')) {
      console.warn(`Failed to load translation ${locale}/${namespace}:`, error);
    }
  }
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider(props: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('de');
  const [isLoaded, setIsLoaded] = useState(false);
  const [version, setVersion] = useState(0); // Force re-renders

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    const supportedLocales: Locale[] = ['de', 'en', 'tr', 'ru', 'ar', 'uk', 'pl'];
    const initialLocale = saved || 'de';
    setLocaleState(initialLocale);
    
    document.documentElement.lang = initialLocale;
    document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string, params?: Record<string, any>): string => {
    // Search across multiple namespaces
    const searchNamespaces = ['home', 'common', 'cta', 'navigation', 'about', 'services', 'contact'];
    
    for (const namespace of searchNamespaces) {
      const normalizedKey = key.startsWith(namespace + '.') ? key.slice(namespace.length + 1) : key;
      const result = findTranslation(normalizedKey, locale, namespace);
      if (result !== null) {
        if (typeof result !== 'string') continue;
        
        if (params) {
          let processedResult = result;
          for (const paramKey in params) {
            const placeholder = '{{' + paramKey + '}}';
            const replacement = String(params[paramKey]);
            while (processedResult.indexOf(placeholder) !== -1) {
              processedResult = processedResult.replace(placeholder, replacement);
            }
          }
          return processedResult;
        }
        
        return result;
      }
    }
    
    // If not found in current locale, try German fallback
    if (locale !== 'de') {
      for (const namespace of searchNamespaces) {
        const normalizedKey = key.startsWith(namespace + '.') ? key.slice(namespace.length + 1) : key;
        const result = findTranslation(normalizedKey, 'de', namespace);
        if (result !== null && typeof result === 'string') {
          if (params) {
            let processedResult = result;
            for (const paramKey in params) {
              const placeholder = '{{' + paramKey + '}}';
              const replacement = String(params[paramKey]);
              while (processedResult.indexOf(placeholder) !== -1) {
                processedResult = processedResult.replace(placeholder, replacement);
              }
            }
            return processedResult;
          }
          return result;
        }
      }
    }
    
    return key; // Return key if nothing found
  };

  const findTranslation = (key: string, targetLocale: Locale, namespace: string): any => {
    const keys = key.split('.');
    let value: any = translations[targetLocale]?.[namespace];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    
    return value;
  };

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoaded(false);
      
      // Always load German as fallback first
      await Promise.all([
        loadTranslation('de', 'common'),
        loadTranslation('de', 'home'),
        loadTranslation('de', 'cta'),
        loadTranslation('de', 'navigation'),
        loadTranslation('de', 'about'),
        loadTranslation('de', 'services'),
        loadTranslation('de', 'contact')
      ]);
      
      // Then load current locale if different from German
      if (locale !== 'de') {
        await Promise.all([
          loadTranslation(locale, 'common'),
          loadTranslation(locale, 'home'),
          loadTranslation(locale, 'cta'),
          loadTranslation(locale, 'navigation'),
          loadTranslation(locale, 'about'),
          loadTranslation(locale, 'services'),
          loadTranslation(locale, 'contact')
        ]);
      }
      
      setIsLoaded(true);
      setVersion(prev => prev + 1); // Force re-render
    };
    loadTranslations();
  }, [locale]);

  const contextValue: I18nContextType = {
    locale,
    setLocale,
    t,
    isLoaded
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {props.children}
    </I18nContext.Provider>
  );
}