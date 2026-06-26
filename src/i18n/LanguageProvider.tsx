import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { languageMeta, translations, type Language, type TranslationKey } from './translations';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: TranslationKey, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'halal_language';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'ar' || saved === 'ku' || saved === 'en') return saved;

  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const dir = languageMeta[language].dir;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [language, dir]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    dir,
    t: (key, fallback) => translations[language][key] || translations.en[key] || fallback || key,
  }), [language, dir]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}