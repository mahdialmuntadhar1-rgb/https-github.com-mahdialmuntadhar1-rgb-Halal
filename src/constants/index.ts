export const GOVERNORATES = [
  'Baghdad',
  'Sulaymaniyah',
  'Erbil',
  'Najaf',
  'Basra',
  'Duhok',
  'Kirkuk',
  'Nineveh',
  'Babil',
  'Karbala',
  'Anbar',
  'Diyala',
  'Qadisiyah',
  'Maysan',
  'Muthanna',
  'Salah al-Din',
  'Wasit',
  'Dhi Qar'
];

export const SECTS = [
  { value: 'sunni', label_en: 'Sunni', label_ar: 'سُنّي', label_ku: 'سوننی' },
  { value: 'shiaa', label_en: 'Shiaa', label_ar: 'شيعي', label_ku: 'شیعە' },
  { value: 'none', label_en: 'Prefer not to say / Other', label_ar: 'يفضل عدم القول / آخر', label_ku: 'پێم باشە نەیڵێم / تر' }
];

export const ETHNICITIES = [
  { value: 'arab', label_en: 'Arab', label_ar: 'عربي', label_ku: 'عەرەب' },
  { value: 'kurdish', label_en: 'Kurdish', label_ar: 'كوردي', label_ku: 'کورد' },
  { value: 'others', label_en: 'Other (Turkmen, Assyrian, etc.)', label_ar: 'آخر (تركماني، آشوري، إلخ)', label_ku: 'تر (تورکمان، ئاشووری، هتد)' }
];

export const RELIGIONS = [
  { value: 'islam', label_en: 'Islam', label_ar: 'الإسلام', label_ku: 'ئیسلام' },
  { value: 'non_islam', label_en: 'Other Religion', label_ar: 'ديانة أخرى', label_ku: 'ئایینی تر' }
];

export const EDUCATION_LEVELS = [
  'High School',
  'Diploma / Institute',
  'Bachelor Degree',
  'Master Degree',
  'PhD / Doctorate',
  'Other Professional Certificate'
];

export const MARITAL_STATUSES = [
  'Single',
  'Divorced',
  'Widowed'
];

export const PROFESSION_CATEGORIES = [
  'Healthcare & Medicine',
  'Education & Academia',
  'Engineering & Technology',
  'Business, Finance & Sales',
  'Law & Government',
  'Art, Design & Writing',
  'Self-Employed / Freelancer',
  'Homemaker',
  'Student',
  'Other'
];

export const COMMUNITY_CATEGORIES = [
  'Marriage advice',
  'Family approval',
  'Engagement questions',
  'Culture and traditions',
  'Religious/respectful questions',
  'Success stories'
] as const;

export const INTENTION_BADGES = [
  'Serious for marriage',
  'Family involved',
  'Ready for engagement',
  'Studying first',
  'Private profile'
] as const;
