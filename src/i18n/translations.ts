export { TRANSLATIONS } from '../lib/translations';
export type { Language, Translations } from '../lib/translations';

import { TRANSLATIONS } from '../lib/translations';
import type { Language } from '../lib/translations';

export const LANGUAGE_OPTIONS: Array<{ code: Language; label: string; dir: 'rtl' | 'ltr' }> = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'ku', label: 'کوردی', dir: 'rtl' },
  { code: 'en', label: 'English', dir: 'ltr' }
];

export function getDirection(language: Language): 'rtl' | 'ltr' {
  return TRANSLATIONS[language]?.dir || 'rtl';
}

export function translate(language: Language, key: keyof typeof TRANSLATIONS.en): string {
  return TRANSLATIONS[language]?.[key] || TRANSLATIONS.ar[key] || String(key);
}
