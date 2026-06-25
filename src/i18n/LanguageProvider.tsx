import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations, languageMeta, type Language, type TranslationKey } from './translations';
import { displayValue } from './displayValue';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: TranslationKey, fallback?: string) => string;
  displayValue: (value: unknown) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'halal_language';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';

  const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved === 'ar' || saved === 'ku' || saved === 'en') return saved;

  const htmlLang = document.documentElement.lang as Language;
  if (htmlLang === 'ar' || htmlLang === 'ku' || htmlLang === 'en') return htmlLang;

  return 'ar';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const dir = languageMeta[language].dir;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [language, dir]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage: setLanguageState,
      dir,
      t: (key, fallback) => translations[language][key] || translations.en[key] || fallback || key,
      displayValue: (rawValue) => displayValue(rawValue, language),
    };
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
