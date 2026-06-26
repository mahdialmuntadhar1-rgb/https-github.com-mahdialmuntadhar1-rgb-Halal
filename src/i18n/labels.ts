import type { Language, Translations } from '../lib/translations';

const keyMap: Record<string, keyof Translations> = {
  'Serious for marriage': 'seriousForMarriage',
  'Family involved': 'familyInvolved',
  'Family involvement welcome': 'familyInvolvementWelcome',
  'Ready for engagement': 'readyForEngagement',
  'Studying first': 'studyingFirst',
  'Private profile': 'privateProfile',
  'Marriage advice': 'marriageAdvice',
  'Family approval': 'familyApproval',
  'Engagement questions': 'engagementQuestions',
  'Culture and traditions': 'cultureTraditions',
  'Religious/respectful questions': 'religiousQuestions',
  'Success stories': 'successStories',
  'Single': 'single',
  'Divorced': 'divorced',
  'Widowed': 'widowed',
  'Ready for marriage soon': 'readyForMarriageSoon',
  'Family discussion needed': 'familyDiscussionNeeded'
};

export function labelFor(value: string, t: Translations): string {
  const key = keyMap[value];
  return key ? t[key] : value;
}

const valueLabels: Record<string, Record<Language, string>> = {
  Iraq: { en: 'Iraq', ar: 'العراق', ku: 'عێراق' },
  Baghdad: { en: 'Baghdad', ar: 'بغداد', ku: 'بەغدا' },
  Basra: { en: 'Basra', ar: 'البصرة', ku: 'بەسرە' },
  Nineveh: { en: 'Nineveh', ar: 'نينوى', ku: 'نەینەوا' },
  Erbil: { en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' },
  Sulaymaniyah: { en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' },
  Duhok: { en: 'Duhok', ar: 'دهوك', ku: 'دهۆک' },
  Kirkuk: { en: 'Kirkuk', ar: 'كركوك', ku: 'کەرکووک' },
  Najaf: { en: 'Najaf', ar: 'النجف', ku: 'نەجەف' },
  Karbala: { en: 'Karbala', ar: 'كربلاء', ku: 'کەربەلا' },
  Babil: { en: 'Babil', ar: 'بابل', ku: 'بابیل' },
  Wasit: { en: 'Wasit', ar: 'واسط', ku: 'واسیت' },
  Diyala: { en: 'Diyala', ar: 'ديالى', ku: 'دیالە' },
  Anbar: { en: 'Anbar', ar: 'الأنبار', ku: 'ئەنبار' },
  'Salah al-Din': { en: 'Salah al-Din', ar: 'صلاح الدين', ku: 'سەلاحەدین' },
  Maysan: { en: 'Maysan', ar: 'ميسان', ku: 'مەیسان' },
  'Dhi Qar': { en: 'Dhi Qar', ar: 'ذي قار', ku: 'زیقار' },
  Muthanna: { en: 'Muthanna', ar: 'المثنى', ku: 'موسەننا' },
  Qadisiyah: { en: 'Qadisiyah', ar: 'القادسية', ku: 'قادسیە' },
  Halabja: { en: 'Halabja', ar: 'حلبجة', ku: 'هەڵەبجە' },
  'High School': { en: 'High School', ar: 'ثانوية', ku: 'ئامادەیی' },
  'Diploma / Institute': { en: 'Diploma / Institute', ar: 'دبلوم / معهد', ku: 'دبلۆم / پەیمانگا' },
  "Bachelor's Degree": { en: "Bachelor's Degree", ar: 'بكالوريوس', ku: 'بەکالۆریۆس' },
  "Master's Degree": { en: "Master's Degree", ar: 'ماجستير', ku: 'ماستەر' },
  Doctorate: { en: 'Doctorate', ar: 'دكتوراه', ku: 'دکتۆرا' },
  Other: { en: 'Other', ar: 'أخرى', ku: 'هیتر' },
  male: { en: 'Man', ar: 'رجل', ku: 'پیاو' },
  female: { en: 'Woman', ar: 'امرأة', ku: 'ئافرەت' },
  islam: { en: 'Islam', ar: 'الإسلام', ku: 'ئیسلا‌م' },
  non_islam: { en: 'Non-Islam', ar: 'غير مسلم', ku: 'ناموسڵمان' },
  sunni: { en: 'Sunni', ar: 'سني', ku: 'سوننی' },
  shiaa: { en: 'Shia', ar: 'شيعي', ku: 'شیعە' },
  arab: { en: 'Arab', ar: 'عربي', ku: 'عەرەب' },
  kurdish: { en: 'Kurdish', ar: 'كردي', ku: 'کورد' },
  others: { en: 'Other', ar: 'أخرى', ku: 'هیتر' },
  visible: { en: 'Visible profile', ar: 'ملف ظاهر', ku: 'پڕۆفایلی دیار' },
  hidden_by_default: { en: 'Blur photo', ar: 'تمويه الصورة', ku: 'وێنە شێوێنراو' },
  hidden: { en: 'Private profile', ar: 'ملف خاص', ku: 'پڕۆفایلی تایبەت' },
  blurred: { en: 'Blurred photo', ar: 'صورة مموهة', ku: 'وێنەی شێوێنراو' },
  initials: { en: 'Initials only', ar: 'الأحرف فقط', ku: 'تەنها پیتەکان' },
  mutual_approval: { en: 'By approval', ar: 'بالموافقة', ku: 'بە ڕەزامەندی' }
};

export function displayValue(value: string | undefined, locale: Language): string {
  if (!value) return '—';
  return valueLabels[value]?.[locale] || value;
}
