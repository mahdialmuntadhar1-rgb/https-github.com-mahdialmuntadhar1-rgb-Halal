import { useState, useCallback } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';

export function useLocale(initial: AppLanguage = 'ar') {
  const [locale, setLocaleState] = useState<AppLanguage>(initial);

  const setLocale = useCallback((newLocale: AppLanguage) => {
    setLocaleState(newLocale);
  }, []);

  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];

  return {
    locale,
    setLocale,
    t
  };
}
