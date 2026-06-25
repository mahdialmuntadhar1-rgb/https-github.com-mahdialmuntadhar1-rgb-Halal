import { useLanguage } from '../i18n/LanguageProvider';
import { AppLanguage } from '../types';

export function useLocale(_initial: AppLanguage = 'ar') {
  return useLanguage();
}
