import { AppLanguage } from '../types';

const valueTranslations: Record<string, Partial<Record<AppLanguage, string>>> = {
  Baghdad: { ar: 'بغداد', ckb: 'بەغدا' },
  Sulaymaniyah: { ar: 'السليمانية', ckb: 'سلێمانی' },
  Erbil: { ar: 'أربيل', ckb: 'هەولێر' },
  Najaf: { ar: 'النجف', ckb: 'نەجەف' },
  Basra: { ar: 'البصرة', ckb: 'بەسرە' },
  Duhok: { ar: 'دهوك', ckb: 'دهۆک' },
  Kirkuk: { ar: 'كركوك', ckb: 'کەرکووک' },
  Nineveh: { ar: 'نينوى', ckb: 'نەینەوا' },
  Babil: { ar: 'بابل', ckb: 'بابل' },
  Karbala: { ar: 'كربلاء', ckb: 'کەربەلا' },
  male: { ar: 'ذكر', ckb: 'نێر' },
  female: { ar: 'أنثى', ckb: 'مێ' },
  islam: { ar: 'الإسلام', ckb: 'ئیسلام' },
  non_islam: { ar: 'ديانة أخرى', ckb: 'ئایینی تر' },
  'Bachelor Degree': { ar: 'بكالوريوس', ckb: 'بەکالۆریۆس' },
  'Master Degree': { ar: 'ماجستير', ckb: 'ماستەر' },
  'High School': { ar: 'إعدادية', ckb: 'ئامادەیی' },
  Single: { ar: 'أعزب / عزباء', ckb: 'سینگڵ' },
  Divorced: { ar: 'مطلق / مطلقة', ckb: 'جیابووەوە' },
  Widowed: { ar: 'أرمل / أرملة', ckb: 'بێوەژن / بێوەپیاو' },
};

export function displayValue(value: unknown, language: AppLanguage): string {
  const raw = String(value ?? '').trim();
  return valueTranslations[raw]?.[language] || raw;
}
