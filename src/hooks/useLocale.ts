import { useState, useCallback, useEffect } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';

const STORAGE_KEY = 'halal_language';

function readStoredLocale(initial: AppLanguage): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'en' || stored === 'ar' || stored === 'ckb' ? stored : initial;
}

export function useLocale(initial: AppLanguage = 'ar') {
  const [locale, setLocaleState] = useState<AppLanguage>(() => readStoredLocale(initial));

  const setLocale = useCallback((newLocale: AppLanguage) => {
    setLocaleState(newLocale);
  }, []);

  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const dir = t.dir;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  return {
    locale,
    setLocale,
    t,
    dir
  };
}
