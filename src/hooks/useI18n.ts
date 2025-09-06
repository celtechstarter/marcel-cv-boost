import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type Locale = 'de' | 'en' | 'tr' | 'ru' | 'ar' | 'uk' | 'pl';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
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
    const data = await response.json();
    if (!translations[locale]) translations[locale] = {};
    translations[locale][namespace] = data;
  } catch (error) {
    const message = 'Failed to load translation ' + locale + '/' + namespace + ':';
    console.warn(message, error);
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
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (typeof value !== 'string') return key;
    
    if (params) {
      let result = value;
      for (const paramKey in params) {
        const placeholder = '{{' + paramKey + '}}';
        const replacement = String(params[paramKey]);
        while (result.indexOf(placeholder) !== -1) {
          result = result.replace(placeholder, replacement);
        }
      }
      return result;
    }
    
    return value;
  };

  useEffect(() => {
    loadTranslation(locale, 'common');
    loadTranslation(locale, 'home');
  }, [locale]);

  const contextValue: I18nContextType = {
    locale,
    setLocale,
    t
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {props.children}
    </I18nContext.Provider>
  );
}