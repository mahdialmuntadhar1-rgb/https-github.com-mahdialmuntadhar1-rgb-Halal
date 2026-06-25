import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { TRANSLATIONS, getDirection, translate } from './translations';
import type { Language, Translations } from './translations';

const STORAGE_KEY = 'halal_language';

interface LanguageContextValue {
  locale: Language;
  setLocale: (language: Language) => void;
  t: Translations;
  tr: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalizeLanguage(value: string | null): Language {
  if (value === 'en' || value === 'ar' || value === 'ku') return value;
  return 'ar';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>(() => normalizeLanguage(localStorage.getItem(STORAGE_KEY)));

  const setLocale = useCallback((language: Language) => {
    setLocaleState(language);
    localStorage.setItem(STORAGE_KEY, language);
  }, []);

  useEffect(() => {
    document.documentElement.dir = getDirection(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale,
    t: TRANSLATIONS[locale] || TRANSLATIONS.ar,
    tr: (key) => translate(locale, key)
  }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
