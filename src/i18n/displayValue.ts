import type { Language } from './translations';

type DisplayDictionary = Record<string, Partial<Record<Language, string>>>;

const values: DisplayDictionary = {
  male: { ar: 'ذكر', ku: 'نێر', en: 'Male' },
  female: { ar: 'أنثى', ku: 'مێ', en: 'Female' },

  pending: { ar: 'قيد الانتظار', ku: 'چاوەڕوان', en: 'Pending' },
  accepted: { ar: 'مقبول', ku: 'قبوڵکراو', en: 'Accepted' },
  declined: { ar: 'مرفوض', ku: 'ڕەتکراوە', en: 'Declined' },
  sent: { ar: 'تم الإرسال', ku: 'نێردرا', en: 'Sent' },

  admin: { ar: 'مسؤول', ku: 'بەڕێوەبەر', en: 'Admin' },
  user: { ar: 'مستخدم', ku: 'بەکارهێنەر', en: 'User' },

  Baghdad: { ar: 'بغداد', ku: 'بەغدا', en: 'Baghdad' },
  Erbil: { ar: 'أربيل', ku: 'هەولێر', en: 'Erbil' },
  Sulaymaniyah: { ar: 'السليمانية', ku: 'سلێمانی', en: 'Sulaymaniyah' },
  Duhok: { ar: 'دهوك', ku: 'دهۆک', en: 'Duhok' },
  Kirkuk: { ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk' },
  Nineveh: { ar: 'نينوى', ku: 'نەینەوا', en: 'Nineveh' },
  Basra: { ar: 'البصرة', ku: 'بەسرە', en: 'Basra' },
  Najaf: { ar: 'النجف', ku: 'نەجەف', en: 'Najaf' },
  Karbala: { ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala' },

  "Bachelor's Degree": { ar: 'بكالوريوس', ku: 'بەکالۆریۆس', en: "Bachelor's Degree" },
  "Master's Degree": { ar: 'ماجستير', ku: 'ماستەر', en: "Master's Degree" },
  PhD: { ar: 'دكتوراه', ku: 'دکتۆرا', en: 'PhD' },

  single: { ar: 'أعزب / عزباء', ku: 'سینگڵ', en: 'Single' },
  divorced: { ar: 'مطلق / مطلقة', ku: 'جیابووەوە', en: 'Divorced' },
  widowed: { ar: 'أرمل / أرملة', ku: 'بێوەژن / بێوەپیاو', en: 'Widowed' },

  visible: { ar: 'ظاهر', ku: 'دیارە', en: 'Visible' },
  hidden: { ar: 'مخفي', ku: 'شاراوە', en: 'Hidden' },
  blurred: { ar: 'مموّه', ku: 'لێڵکراو', en: 'Blurred' },
};

export function displayValue(value: unknown, language: Language): string {
  if (value === null || value === undefined) return '';
  const key = String(value);
  return values[key]?.[language] || values[key]?.en || key;
}
