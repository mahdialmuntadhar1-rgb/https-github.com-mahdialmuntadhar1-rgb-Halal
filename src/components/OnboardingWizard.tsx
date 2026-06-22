import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { Check, ArrowRight, ArrowLeft, ShieldAlert, Sparkles, UploadCloud, Info, Lock, Eye, EyeOff, User } from 'lucide-react';

interface OnboardingWizardProps {
  locale: Language;
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

const GOVERNORATES = [
  'Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk',
  'Najaf', 'Karbala', 'Babil', 'Wasit', 'Diyala', 'Anbar', 'Salah al-Din',
  'Maysan', 'Dhi Qar', 'Muthanna', 'Qadisiyah', 'Halabja'
];

const GOVERNORATE_CITIES: Record<string, string[]> = {
  'Baghdad': ['Karrada', 'Mansour', 'Adhamiyah', 'Jadriya', 'Zayouna', 'Baghdad Center'],
  'Basra': ['Basra Center', 'Zubair', 'Qurna', 'Abu Al-Khaseeb', 'Shatt Al-Arab'],
  'Nineveh': ['Mosul', 'Tel Kaif', 'Sinjar', 'Hamdaniya', 'Bakhdida'],
  'Erbil': ['Erbil Center', 'Ankawa', 'Shaqlawa', 'Koya', 'Soran'],
  'Sulaymaniyah': ['Sulaymaniyah City', 'Chamchamal', 'Rania', 'Dukan', 'Darbandikhan'],
  'Duhok': ['Duhok Center', 'Zakho', 'Amedi', 'Semel'],
  'Kirkuk': ['Kirkuk Center', 'Dakuk', 'Hawija', 'Altun Kupri'],
  'Najaf': ['Najaf Al-Ashraf', 'Kufa District', 'Manathera', 'Al-Meshkhab'],
  'Karbala': ['Karbala Center', 'Hindiyah', 'Ain Al-Tamer'],
  'Babil': ['Hillah', 'Al-Musayab', 'Mahaweel', 'Hashimiyah'],
  'Wasit': ['Kut', 'Al-Suwaira', 'Al-Hai'],
  'Diyala': ['Baqubah', 'Muqdadiyah', 'Khanaqin'],
  'Anbar': ['Ramadi', 'Fallujah', 'Hit', 'Haditha'],
  'Salah al-Din': ['Tikrit', 'Samarra', 'Balad', 'Dujail'],
  'Maysan': ['Amarah', 'Ali Al-Gharbi', 'Kahla'],
  'Dhi Qar': ['Nasiriyah', 'Shatrah', 'Al-Rifai', 'Chibayish'],
  'Muthanna': ['Samawah', 'Al-Rumaitha'],
  'Qadisiyah': ['Diwaniyah', 'Al-Shamiya'],
  'Halabja': ['Halabja City', 'Sirwan', 'Khurmal'],
  'All Iraq': ['All Iraqi Cities']
};

const COUNTRIES = ['Iraq', 'Egypt', 'Jordan', 'Saudi Arabia', 'Kuwait', 'UAE', 'Qatar', 'Turkey', 'Iran'];

const EDUCATION_LEVELS = [
  "High School Diploma",
  "Vocational / Technical Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate Degree",
  "Other Education Track"
];

const PROFESSION_CATEGORIES = [
  "Engineering",
  "Medicine & Healthcare",
  "Education & Academia",
  "Business, Startups & Finance",
  "Technology, Software & Cyber",
  "Arts, Architecture & Design",
  "Trade & Handcrafted",
  "Homemaker / Home administrator",
  "Other Category"
];

const LANGUAGES = ['Arabic', 'Kurdish', 'English', 'Turkish', 'French', 'Persian', 'Urdu', 'Syriac'];

export default function OnboardingWizard({ locale, onComplete, initialProfile }: OnboardingWizardProps) {
  const t = TRANSLATIONS[locale];
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    ...initialProfile,
    country: initialProfile.country || 'Iraq',
    governorate: initialProfile.governorate || 'Baghdad',
    religion: initialProfile.religion || 'islam',
    sect: initialProfile.sect || 'sunni',
    ethnicity: initialProfile.ethnicity || 'arab',
    age: initialProfile.age || 25,
    lookingFor: initialProfile.lookingFor || 'Marriage within one year',
    timeline: initialProfile.timeline || 'Within 1 year',
    wantsChildren: initialProfile.wantsChildren || 'Yes',
    relocation: initialProfile.relocation || 'Yes',
    familyInvolvement: initialProfile.familyInvolvement || 'From the beginning',
    maritalStatus: initialProfile.maritalStatus || 'Single',
    professionCategory: initialProfile.professionCategory || 'Engineering',
    partnerAgeRange: initialProfile.partnerAgeRange || '25-30',
    partnerCountry: initialProfile.partnerCountry || 'Iraq',
    partnerGovernorate: initialProfile.partnerGovernorate || 'Baghdad',
    partnerReligion: initialProfile.partnerReligion || 'islam',
    partnerSect: initialProfile.partnerSect || 'sunni',
    partnerEthnicity: initialProfile.partnerEthnicity || 'arab',
    partnerEducation: initialProfile.partnerEducation || "Bachelor's Degree",
    partnerProfession: initialProfile.partnerProfession || 'Any Profession',
    partnerLanguage: initialProfile.partnerLanguage || ['Arabic'],
    partnerFamilyValues: initialProfile.partnerFamilyValues || 'Traditional & Balanced',
    partnerLifestyle: initialProfile.partnerLifestyle || 'Modest & Family Oriented',
    partnerSmoking: initialProfile.partnerSmoking || 'Non-smoker',
    partnerWantsChildren: initialProfile.partnerWantsChildren || 'Yes',
    partnerPersonality: initialProfile.partnerPersonality || 'Kind & Empathetic',
    partnerSeriousness: initialProfile.partnerSeriousness || 'Very High',
    partnerDealbreakers: initialProfile.partnerDealbreakers || ['Smoking', 'Dishonesty'],
    locationSearchPreference: initialProfile.locationSearchPreference || 'Across all Iraq',
    trustedPerson: initialProfile.trustedPerson || 'Parent',
    sendRequestsPermission: initialProfile.sendRequestsPermission || 'Everyone verified',
    seeProfilePermission: initialProfile.seeProfilePermission || 'All verified members'
  });

  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Adjust languages automatically based on ethnicity
  useEffect(() => {
    if (profile.ethnicity === 'kurdish') {
      updateProfile({ 
        languages: ['Kurdish', 'Arabic', 'English'],
        partnerLanguage: ['Kurdish', 'Arabic']
      });
    } else if (profile.ethnicity === 'arab') {
      updateProfile({ 
        languages: ['Arabic', 'English'],
        partnerLanguage: ['Arabic']
      });
    } else {
      updateProfile({ 
        languages: ['Arabic', 'English'],
        partnerLanguage: ['Arabic']
      });
    }
  }, [profile.ethnicity]);

  // Handle auto preset alignment whenever gender is configured
  useEffect(() => {
    if (profile.gender === 'female') {
      updateProfile({ photoPrivacy: 'hidden_by_default' });
    } else {
      updateProfile({ photoPrivacy: 'visible' });
    }
  }, [profile.gender]);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  const validateStep = (): boolean => {
    const currentErrors: string[] = [];
    if (step === 1) {
      if (!profile.name.trim()) currentErrors.push("Please provide your name.");
      if (profile.age < 18 || profile.age > 60) currentErrors.push("Age must be between 18 and 60.");
      if (profile.country === 'Iraq' && !profile.governorate) currentErrors.push("Please select your governorate.");
      if (!profile.profession.trim()) currentErrors.push("Please describe your profession / roles.");
      if (profile.languages.length === 0) currentErrors.push("Please select at least one language.");
    }
    setErrors(currentErrors);
    return currentErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 6) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onComplete(profile);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleDealbreaker = (db: string) => {
    const active = profile.partnerDealbreakers || [];
    const fresh = active.includes(db)
      ? active.filter(d => d !== db)
      : [...active, db];
    updateProfile({ partnerDealbreakers: fresh });
  };

  const selectSimulatedPhoto = () => {
    setSimulatedFile('respectful_ai_portrait.jpg');
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSimulatedFile(e.dataTransfer.files[0].name);
    }
  };

  const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => i + 18); // 18 to 60

  const WHAT_MATTERS_MOST_OPTIONS = [
    'Values', 'Personality', 'Family background', 'Education', 'Profession',
    'Lifestyle', 'Religion / values compatibility', 'Location', 'Emotional maturity',
    'Financial stability', 'Respectful communication'
  ];

  const DEALBREAKERS_OPTIONS = [
    'Smoking', 'Dishonesty', 'Lack of ambition', 'Relocation mismatch',
    'No family values', 'Angry temperament', 'Uncooperative', 'Irresponsibility'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white/40 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-white/40 shadow-2xl relative z-10" id="onboarding-flow">
      
      {/* Wizard Header Progress Bar */}
      <div className="mb-8 space-y-4 text-left">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-accent-coral uppercase tracking-wider">{locale === 'en' ? 'HALAL Courtship Parameters' : locale === 'ar' ? 'معايير الخطوبة الحلال' : 'پێوەرەکانی خوازبێنی حەڵاڵ'}</span>
          <span className="text-[#6B635B] font-bold">{t.stepNum} {step} {locale === 'en' ? 'of 6' : locale === 'ar' ? 'من ٦' : 'لە ٦'}</span>
        </div>
        
        <div className="w-full bg-white/30 h-2.5 rounded-full overflow-hidden flex border border-white/20 shadow-inner">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 border-r border-white/20 transition-all duration-500 ${
                s <= step
                  ? 'bg-gradient-to-r from-accent-coral to-accent-pink'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        
        <h3 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal tracking-tight">
          {step === 1 && (locale === 'en' ? 'Step 1: Your Basic parameters' : locale === 'ar' ? 'الخطوة ١: المعايير الأساسية الخاصة بك' : 'ھەنگاوی ١: پێوەرە سەرەکییەکانت')}
          {step === 2 && (locale === 'en' ? 'Step 2: Marriage Intentions' : locale === 'ar' ? 'الخطوة ٢: نية الزواج وتطلعاته' : 'ھەنگاوی ٢: مەبەستەکانی هاوسەرگیری')}
          {step === 3 && (locale === 'en' ? 'Step 3: Partner Compatibility Preferences' : locale === 'ar' ? 'الخطوة ٣: تفضيلات التوافق لشريك الحياة' : 'ھەنگاوی ٣: هەڵبژاردنی گونجاوی هاوبەشی ژیان')}
          {step === 4 && (locale === 'en' ? 'Step 4: Respectful Portrait Comfort & Privacy' : locale === 'ar' ? 'الخطوة ٤: خصوصية وراحة الصورة الوقورة' : 'ھەنگاوی ٤: تایبەتمەندی وێنەی شایستە')}
          {step === 5 && (locale === 'en' ? 'Step 5: Trusted Wali & Visibility Rules' : locale === 'ar' ? 'الخطوة ٥: ولي الأمر وقواعد الظهور' : 'ھەنگاوی ٥: نوێنەری خێزان زانیارییەکان')}
          {step === 6 && (locale === 'en' ? 'Step 6: Sincere Validation Review' : locale === 'ar' ? 'الخطوة ٦: مراجعة نهائية والتحقق من النوايا' : 'ھەنگاوی ٦: پێداچوونەوە و پشتڕاستکردنەوەم')}
        </h3>
        <p className="text-xs sm:text-sm text-[#6B635B] font-medium leading-relaxed">
          {step === 1 && (locale === 'en' ? 'Let us map out your fundamental bio. Clean, structured fields and no casual fluff.' : locale === 'ar' ? 'فلنرسم بيانات سيرتك الذاتية الأساسية. حقول واضحة ومنظمة بدون تشتيت.' : 'با زانیارییە سەرەکییەکانت بنەخشێنین. خانەی ڕوون و ڕێکخراو بەبێ یاری هاندەر.')}
          {step === 2 && (locale === 'en' ? 'Exclusively serious goals. Set your targeted timelines, expectations, and family views.' : locale === 'ar' ? 'أهداف جادة وحصرية. حدد الجداول الزمنية المستهدفة والتوقعات والآراء العائلية.' : 'تەنها ئامانجی جدی. کاتەکان، چاوەڕوانییەکان و بۆچوونەکانی خێزانەکەت دیاری بکە.')}
          {step === 3 && (locale === 'en' ? 'Specify what is essential in your partner. This determines compatibility filters.' : locale === 'ar' ? 'حدد ما هو أساسي في شريكك. يحدد هذا مرشحات تصفية التوافق بدقة.' : 'ئەوەی لە هاوبەشەکەتدا گرنگ و بنەڕەتییە دیاری بکە بۆ گونجاندوویی.')}
          {step === 4 && (locale === 'en' ? 'Dignity first. Women control their photo visibility manually. Men supply transparent portraits.' : locale === 'ar' ? 'الوقار والكرامة أولاً. تتحكم النساء يدويًا في ظهور صورهم، بينما يقدم الرجال صورًا واضحة.' : 'سەرەتا کەرامەت. ئافرەتان کۆنترۆڵی بینینی وێنەکانیان دەکەن، پیاوانیش وێنەی ڕوون پیشان دەدەن.')}
          {step === 5 && (locale === 'en' ? 'Opt to include a family representative to witness transcripts and defend peaceful boundaries.' : locale === 'ar' ? 'خيار لتضمين ممثل عن الأسرة (ولي أمر) للاطلاع على سجلات المحادثة وحماية الحدود الآمنة للجميع.' : 'هەڵبژاردنی زیادکردنی نوێنەرێکی خێزان بۆ هێشتنەوەی سنوورە جدییەکان بە ئاشتیانە.')}
          {step === 6 && (locale === 'en' ? 'Perfectly configured. Confirm your courtship statements before launching matching.' : locale === 'ar' ? 'تم الإعداد بنجاح. أكد بيانات خطوبتك قبل إطلاق البحث والمطابقة.' : 'هەموو شتێک ئامادەیە. زانیارییەکانت بپشکنە پێش دەستپێکردنی گەڕان.')}
        </p>

        {/* Validation Errors Overlay */}
        {errors.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 animate-pulse text-left">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Correction Required to Proceed
            </p>
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-rose-700 font-semibold">• {err}</p>
            ))}
          </div>
        )}
      </div>

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white/55 border border-white/40 p-4 rounded-2xl flex items-center gap-3">
            <User className="w-5 h-5 text-accent-coral" />
            <p className="text-xs text-warm-charcoal font-medium">
              You selected <strong className="text-accent-coral capitalize">{profile.gender}</strong> on step 1. You can change your gender by clicking overview above.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="e.g. Lina or Adam"
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Age</label>
              <select
                value={profile.age}
                onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 25 })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a} Years Old</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Country</label>
              <select
                value={profile.country}
                onChange={(e) => updateProfile({ country: e.target.value, governorate: e.target.value === 'Iraq' ? 'Baghdad' : '' })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {profile.country === 'Iraq' && (
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Governorate</label>
                <select
                  value={profile.governorate}
                  onChange={(e) => updateProfile({ governorate: e.target.value })}
                  className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Religion</label>
              <select
                value={profile.religion}
                onChange={(e) => {
                  const r = e.target.value as 'islam' | 'non_islam';
                  updateProfile({ religion: r, sect: r === 'islam' ? 'sunni' : 'none' });
                }}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm font-semibold"
              >
                <option value="islam">Islam</option>
                <option value="non_islam">Non-Islam</option>
              </select>
            </div>

            {profile.religion === 'islam' ? (
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Sect</label>
                <select
                  value={profile.sect}
                  onChange={(e) => updateProfile({ sect: e.target.value as 'sunni' | 'shiaa' | 'none' })}
                  className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm font-semibold"
                >
                  <option value="sunni">Sunni</option>
                  <option value="shiaa">Shiaa</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Sect</label>
                <select
                  disabled
                  value="none"
                  className="w-full bg-stone-100/60 border border-white/30 text-stone-400 p-3 rounded-xl text-sm shadow-sm cursor-not-allowed"
                >
                  <option value="none">Not Applicable</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Ethnicity</label>
              <select
                value={profile.ethnicity}
                onChange={(e) => updateProfile({ ethnicity: e.target.value as 'arab' | 'kurdish' | 'others' })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="arab">Arab</option>
                <option value="kurdish">Kurdish</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Education Level</label>
              <select
                value={profile.education}
                onChange={(e) => updateProfile({ education: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                {EDUCATION_LEVELS.map((el) => (
                  <option key={el} value={el}>{el}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Profession Category</label>
              <select
                value={profile.professionCategory}
                onChange={(e) => updateProfile({ professionCategory: e.target.value, profession: e.target.value === 'Other Category' ? '' : e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                {PROFESSION_CATEGORIES.map((pc) => (
                  <option key={pc} value={pc}>{pc}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Specific Profession / Role title</label>
            <input
              type="text"
              value={profile.profession}
              onChange={(e) => updateProfile({ profession: e.target.value })}
              placeholder={profile.professionCategory === 'Engineering' ? "e.g. Renewable Systems Engineer" : "Describe your role specifically"}
              className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Marital Status</label>
              <select
                value={profile.maritalStatus}
                onChange={(e) => updateProfile({ maritalStatus: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Languages Spoken</label>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#40798C]/15 text-[#40798C] border border-[#40798C]/20 shadow-sm inline-block"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#6B635B] mt-2 font-semibold">
                Languages automatically curated based on your location and ethnicity.
              </p>
            </div>
          </div>

          {/* Sincere Courtship Statement (Bio) removed */}

        </div>
      )}

      {/* STEP 2: Marriage Intention */}
      {step === 2 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">What are you looking for?</label>
              <select
                value={profile.lookingFor}
                onChange={(e) => updateProfile({ lookingFor: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Marriage soon">Marriage soon</option>
                <option value="Marriage within one year">Marriage within one year</option>
                <option value="Serious introduction first">Serious introduction first</option>
                <option value="Family-guided matching">Family-guided matching</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Marriage timeline</label>
              <select
                value={profile.timeline}
                onChange={(e) => updateProfile({ timeline: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="As soon as suitable">As soon as suitable</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Within 6 months">Within 6 months</option>
                <option value="Within 1 year">Within 1 year</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Do you want children?</label>
              <select
                value={profile.wantsChildren}
                onChange={(e) => updateProfile({ wantsChildren: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
                <option value="Already have children">Already have children</option>
                <option value="Prefer to discuss later">Prefer to discuss later</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Open to relocation?</label>
              <select
                value={profile.relocation}
                onChange={(e) => updateProfile({ relocation: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Inside Iraq only">Inside Iraq only</option>
                <option value="Outside Iraq possible">Outside Iraq possible</option>
                <option value="Depends on the person">Depends on the person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Family involvement</label>
              <select
                value={profile.familyInvolvement}
                onChange={(e) => updateProfile({ familyInvolvement: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Not now">Not now</option>
                <option value="Later after serious interest">Later after serious interest</option>
                <option value="From the beginning">From the beginning</option>
                <option value="I want family-aware mode">I want family-aware mode</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-3">
              What matters most to you in marriage? (Multi-select)
            </label>
            <div className="flex flex-wrap gap-2">
              {WHAT_MATTERS_MOST_OPTIONS.map((opt) => {
                const selected = profile.values.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => {
                      const fresh = selected
                        ? profile.values.filter(it => it !== opt)
                        : [...profile.values, opt];
                      updateProfile({ values: fresh });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      selected
                        ? 'bg-gradient-to-r from-accent-coral to-accent-pink border-accent-coral text-white shadow-md'
                        : 'bg-white/60 border-white/30 text-[#4A443F] hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Partner Preferences */}
      {step === 3 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Partner Age Range</label>
              <select
                value={profile.partnerAgeRange}
                onChange={(e) => updateProfile({ partnerAgeRange: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="18-24">18-24 Years Old</option>
                <option value="25-30">25-30 Years Old</option>
                <option value="31-35">31-35 Years Old</option>
                <option value="36-40">36-40 Years Old</option>
                <option value="41-45">41-45 Years Old</option>
                <option value="46-50">46-50 Years Old</option>
                <option value="50+">50+ Years Old</option>
                <option value="Any suitable age">Any suitable age</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Location Search Priority (CRITICAL)</label>
              <select
                value={profile.locationSearchPreference}
                onChange={(e) => updateProfile({ locationSearchPreference: e.target.value })}
                className="w-full bg-white border border-[#FF7F50]/40 p-3 rounded-xl text-warm-charcoal font-bold bg-[#FF7F50]/5 focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Across all Iraq">Across all Iraq</option>
                <option value="Inside one governorate">Inside one governorate</option>
                <option value="Inside one city">Inside one city</option>
                <option value="Nearby cities">Nearby cities</option>
                <option value="Outside Iraq">Outside Iraq</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Partner Country</label>
              <select
                value={profile.partnerCountry}
                onChange={(e) => updateProfile({ partnerCountry: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Partner Governorate (if Iraq)</label>
              <select
                value={profile.partnerGovernorate}
                onChange={(e) => updateProfile({ partnerGovernorate: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="All Iraq">All Iraq</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Religion</label>
              <select
                value={profile.partnerReligion}
                onChange={(e) => updateProfile({ partnerReligion: e.target.value as 'all' | 'islam' | 'non_islam' })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm font-semibold"
              >
                <option value="all">Any Religion</option>
                <option value="islam">Islam</option>
                <option value="non_islam">Non-Islam</option>
              </select>
            </div>

            {profile.partnerReligion === 'islam' ? (
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Sect</label>
                <select
                  value={profile.partnerSect}
                  onChange={(e) => updateProfile({ partnerSect: e.target.value as 'all' | 'sunni' | 'shiaa' | 'none' })}
                  className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
                >
                  <option value="all">Any Sect</option>
                  <option value="sunni">Sunni</option>
                  <option value="shiaa">Shiaa</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Sect</label>
                <select
                  disabled
                  value="all"
                  className="w-full bg-stone-100/60 border border-white/30 text-stone-400 p-3 rounded-xl text-sm shadow-sm cursor-not-allowed"
                >
                  <option value="all">Not Applicable</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Ethnicity</label>
              <select
                value={profile.partnerEthnicity}
                onChange={(e) => updateProfile({ partnerEthnicity: e.target.value as 'all' | 'arab' | 'kurdish' | 'others' })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="all">Any Ethnicity</option>
                <option value="arab">Arab</option>
                <option value="kurdish">Kurdish</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Education Preference</label>
              <select
                value={profile.partnerEducation}
                onChange={(e) => updateProfile({ partnerEducation: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Any level">Any Education level</option>
                {EDUCATION_LEVELS.map((el) => (
                  <option key={el} value={el}>{el} and above</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Profession preference</label>
              <select
                value={profile.partnerProfession}
                onChange={(e) => updateProfile({ partnerProfession: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Any Profession">Any Profession category</option>
                {PROFESSION_CATEGORIES.map((pc) => (
                  <option key={pc} value={pc}>{pc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Family Values style</label>
              <select
                value={profile.partnerFamilyValues}
                onChange={(e) => updateProfile({ partnerFamilyValues: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Traditional & Balanced">Traditional & Balanced</option>
                <option value="Highly Conservative">Highly Conservative</option>
                <option value="Modern Values-Oriented">Modern Values-Oriented</option>
                <option value="Flexible / Decisive">Flexible / Decisive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Smoking preference</label>
              <select
                value={profile.partnerSmoking}
                onChange={(e) => updateProfile({ partnerSmoking: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Non-smoker">Strictly Non-smoker</option>
                <option value="Smoker acceptable">Smoker acceptable</option>
                <option value="Prefer non-smoker">Prefer non-smoker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Wants Children Preference</label>
              <select
                value={profile.partnerWantsChildren}
                onChange={(e) => updateProfile({ partnerWantsChildren: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Yes">Yes, definitely</option>
                <option value="Maybe / Islamic stance">Open / Islamic stance</option>
                <option value="No">No kids</option>
                <option value="Prefer discussing later">Prefer discussing later</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Partner Personality</label>
              <select
                value={profile.partnerPersonality}
                onChange={(e) => updateProfile({ partnerPersonality: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Kind & Empathetic">Kind & Empathetic</option>
                <option value="Studious & Ambitious">Studious & Ambitious</option>
                <option value="Calm, Serene & Traditional">Calm, Serene & Traditional</option>
                <option value="Cheerful, Active & Social">Cheerful, Active & Social</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Preferred Partner Languages</label>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {(profile.partnerLanguage || ['Arabic']).map((lang) => (
                  <span
                    key={lang}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#40798C]/15 text-[#40798C] border border-[#40798C]/20 shadow-sm inline-block"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#6B635B] mt-2 font-semibold font-mono">
                Auto-aligned language capability preset to fit respective spouse ethnicity matches.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-3 font-mono">
              Absolute Dealbreakers (Select critical items)
            </label>
            <div className="flex flex-wrap gap-2">
              {DEALBREAKERS_OPTIONS.map((db) => {
                const selected = (profile.partnerDealbreakers || []).includes(db);
                return (
                  <button
                    type="button"
                    key={db}
                    onClick={() => toggleDealbreaker(db)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      selected
                        ? 'bg-rose-500 border-rose-500 text-white shadow-sm font-bold'
                        : 'bg-white/60 border-white/30 text-warm-charcoal hover:bg-white'
                    }`}
                  >
                    🚫 {db}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* STEP 4: Photo Privacy */}
      {step === 4 && (
        <div className="space-y-6 text-left">
          
          {profile.gender === 'male' ? (
            <div className="p-5 bg-blue-50 border border-blue-200/50 rounded-2xl flex space-x-3">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-900 leading-tight">Men’s Profile Transparency Pledge</p>
                <p className="text-[11px] text-blue-800 leading-relaxed mt-1">
                  <strong>Men are expected to use a clear profile photo so members can feel safe and confident.</strong> Therefore, your respectful photo is visible by default to verified partners.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-amber-50 border border-amber-200/50 rounded-2xl flex space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 leading-tight">Protected Female Portrait Policy</p>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-1">
                  <strong>Your comfort comes first. You decide when your photo becomes visible.</strong> Women have photo hiding or blurring turned on by default to shield dignity from casual spectators.
                </p>
              </div>
            </div>
          )}

          {/* Side by side Visual Examples of Privacy States */}
          <div className="p-2 border border-white/20 rounded-3xl bg-white/20">
            <p className="text-[10px] font-mono uppercase tracking-widest text-center text-[#6B635B] py-2 font-bold">
              Visual Illustration of Privacy card levels
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 items-stretch">
              {/* Male visual card example */}
              <div className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center space-x-3 shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                  alt="Male Example" 
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-warm-charcoal">Adam (Male Card)</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">🔓 ALWAYS VISIBLE PHOTO</p>
                  <p className="text-[9px] text-[#6B635B] mt-0.5 leading-tight">Men build trust by displaying verified, elegant portraits.</p>
                </div>
              </div>

              {/* Female visual card example */}
              <div className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center space-x-3 shadow-inner">
                <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl border border-stone-200">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                    alt="Female Example" 
                    className="w-full h-full object-cover filter blur-[9px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-900/35 flex items-center justify-center">
                    <Lock className="w-4.5 h-4.5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-warm-charcoal">Lina (Female Card)</span>
                    <span className="w-1.5 h-1.5 bg-accent-coral rounded-full" />
                  </div>
                  <p className="text-[10px] text-accent-coral font-bold uppercase mt-0.5">🔒 FULLY BLURRED BY DEFAULT</p>
                  <p className="text-[9px] text-[#6B635B] mt-0.5 leading-tight">Portraits are only unlocked file-by-file with active consent.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo simulator upload box */}
          <div className="border border-white/50 rounded-2xl bg-white/60 p-6 space-y-4 text-center">
            <h4 className="text-sm font-serif font-bold text-warm-charcoal">Secure Courtship Portrait</h4>
            
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragOver ? 'border-accent-coral bg-accent-coral/5' : 'border-white/40 hover:bg-white/80'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-[#6B635B] mb-2" />
              {simulatedFile ? (
                <div className="text-center">
                  <p className="text-xs font-bold text-warm-charcoal">{simulatedFile}</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1">✓ Photo captured successfully</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-warm-charcoal font-medium">Drag & drop your portrait here, or click to browse</p>
                  <p className="text-[9px] text-[#6B635B] mt-1 font-mono">Accepts JPG, PNG up to 8MB. Respectful presentation required.</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={selectSimulatedPhoto}
                className="bg-white/80 hover:bg-white border border-white/40 text-warm-charcoal px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                Use Respectful AI Mock Portrait
              </button>
            </div>
          </div>

          {/* Display dependent selectors */}
          {profile.gender === 'female' ? (
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Set Your Custom Visibility Level</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateProfile({ photoPrivacy: 'hidden_by_default' })}
                  className={`p-4 rounded-xl text-left border transition ${
                    profile.photoPrivacy === 'hidden_by_default'
                      ? 'bg-accent-coral/10 border-accent-coral text-warm-charcoal shadow-sm'
                      : 'bg-white border-white/40 text-warm-charcoal hover:bg-white/80'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">🔒 Blurred Photo (Recommended)</p>
                  <p className="text-[10px] font-medium text-[#6B635B] mt-1">Unlocked dynamically individual-by-individual once you accept requests.</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateProfile({ photoPrivacy: 'hidden' })}
                  className={`p-4 rounded-xl text-left border transition ${
                    profile.photoPrivacy === 'hidden'
                      ? 'bg-accent-coral/10 border-accent-coral text-warm-charcoal shadow-sm'
                      : 'bg-white border-white/40 text-warm-charcoal hover:bg-white/80'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">🚫 Direct Hidden Portrait</p>
                  <p className="text-[10px] font-medium text-[#6B635B] mt-1">Never display photo; use placeholder initials only.</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateProfile({ photoPrivacy: 'initials' })}
                  className={`p-4 rounded-xl text-left border transition ${
                    profile.photoPrivacy === 'initials'
                      ? 'bg-accent-coral/10 border-accent-coral text-warm-charcoal shadow-sm'
                      : 'bg-white border-white/40 text-warm-charcoal hover:bg-white/80'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">🌸 Initials Icon Avatar</p>
                  <p className="text-[10px] font-medium text-[#6B635B] mt-1">Your display name initials serve as your secure profile emblem.</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateProfile({ photoPrivacy: 'floral' })}
                  className={`p-4 rounded-xl text-left border transition ${
                    profile.photoPrivacy === 'floral'
                      ? 'bg-accent-coral/10 border-accent-coral text-warm-charcoal shadow-sm'
                      : 'bg-white border-white/40 text-warm-charcoal hover:bg-white/80'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">🏵️ Floral Motif Avatar</p>
                  <p className="text-[10px] font-medium text-[#6B635B] mt-1">Replaces avatar references with unique beautiful Arabic geometric arabesque flowers.</p>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Configure Visibility</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateProfile({ photoPrivacy: 'visible' })}
                  className={`p-4 rounded-xl text-left border transition ${
                    profile.photoPrivacy === 'visible'
                      ? 'bg-accent-coral/10 border-accent-coral text-warm-charcoal shadow-sm'
                      : 'bg-white border-white/40 text-warm-charcoal hover:bg-white/80'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">🔓 Visible Photo (Mandatory for Men)</p>
                  <p className="text-[10px] font-medium text-[#6B635B] mt-1">Allows prospective match candidates to verify safety instantly.</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateProfile({ photoPrivacy: 'private_mode' })}
                  className={`p-4 rounded-xl text-left border transition ${
                    profile.photoPrivacy === 'private_mode'
                      ? 'bg-accent-coral/10 border-accent-coral text-warm-charcoal shadow-sm'
                      : 'bg-white border-white/40 text-warm-charcoal hover:bg-white/80'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">🔒 Match-Only visible</p>
                  <p className="text-[10px] font-medium text-[#6B635B] mt-1">Hide your profile page entirely from public lists. Visible only to people you select.</p>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* STEP 5: Family & Privacy Settings */}
      {step === 5 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Do you want a trusted person involved?</label>
              <select
                value={profile.trustedPerson}
                onChange={(e) => updateProfile({ trustedPerson: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Parent">Parent (Father / Mother)</option>
                <option value="Sibling">Sibling (Brother / Sister)</option>
                <option value="Relative">Uncle / Aunt / Relative</option>
                <option value="Trusted friend">Trusted Friend / Representative</option>
                <option value="Not now">Not now</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Who can send you requests?</label>
              <select
                value={profile.sendRequestsPermission}
                onChange={(e) => updateProfile({ sendRequestsPermission: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Everyone verified">Everyone verified</option>
                <option value="Only people matching my filters">Only people matching my filters</option>
                <option value="Only approved suggestions">Only approved suggestions</option>
                <option value="Nobody until I browse first">Nobody until I browse first</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-2">Who can see your profile?</label>
              <select
                value={profile.seeProfilePermission}
                onChange={(e) => updateProfile({ seeProfilePermission: e.target.value })}
                className="w-full bg-white border border-white/50 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="All verified members">All verified members</option>
                <option value="Only compatible members">Only compatible members</option>
                <option value="Hidden until I approve">Hidden until I approve</option>
                <option value="Only people I like first">Only people I like first</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-white/55 border border-white/30 rounded-2xl">
            <h5 className="text-xs font-bold uppercase tracking-wider text-accent-coral mb-2 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4" />
              Safety Verification Guarantee
            </h5>
            <p className="text-xs text-[#6B635B] leading-relaxed font-medium">
              By ticking below, your profile enforces mutual verification limits. Unverified or casual accounts will not match your strict parameters.
            </p>
          </div>

        </div>
      )}

      {/* STEP 6: Profile Summary */}
      {step === 6 && (
        <div className="space-y-6 text-left">
          
          <div className="p-5 bg-gradient-to-tr from-accent-coral/10 to-accent-pink/10 rounded-[2rem] border border-accent-coral/15 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-accent-coral mx-auto" />
            <h4 className="text-base font-serif font-black text-warm-charcoal">Parameters Complete & Sealed</h4>
            <p className="text-xs text-[#6B635B] font-medium max-w-sm mx-auto leading-relaxed">
              Assalamu Alaikum, {profile.name}. Your marriage introduction file has been successfully calibrated. Review your specs below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Box 1: basic */}
            <div className="bg-white border border-white/40 rounded-[2rem] p-6 space-y-4 shadow-sm">
              <h5 className="text-xs font-bold text-accent-coral uppercase tracking-wider border-b pb-1 font-mono">Basic Information</h5>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[#6B635B] font-medium">Name & Gender</span>
                  <p className="font-bold text-warm-charcoal capitalize">{profile.name} • {profile.gender}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Age & Marital Status</span>
                  <p className="font-bold text-warm-charcoal">{profile.age} Years Old • {profile.maritalStatus}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Location</span>
                  <p className="font-bold text-warm-charcoal">
                    {profile.country === 'Iraq' ? `${profile.governorate} (Iraq)` : `${profile.country}`}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Religion & Ethnicity</span>
                  <p className="font-bold text-warm-charcoal capitalize">
                    {profile.religion === 'islam' ? `${profile.sect || 'Sunni'} Muslim` : 'Non-Muslim'} • {profile.ethnicity}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Studies & Profession</span>
                  <p className="font-bold text-warm-charcoal">{profile.education} • {profile.profession}</p>
                </div>
              </div>
            </div>

            {/* Box 2: Intentions */}
            <div className="bg-white border border-white/40 rounded-[2rem] p-6 space-y-4 shadow-sm">
              <h5 className="text-xs font-bold text-[#40798C] uppercase tracking-wider border-b pb-1 font-mono">Marriage Intentions</h5>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[#6B635B] font-medium">What is Sought</span>
                  <p className="font-bold text-warm-charcoal">{profile.lookingFor}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Courtship Timeline</span>
                  <p className="font-bold text-[#40798C]">{profile.timeline}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Relocation & Kids</span>
                  <p className="font-bold text-warm-charcoal">Kids: {profile.wantsChildren} • Relocation: {profile.relocation}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Wali & Family Connection</span>
                  <p className="font-bold text-warm-charcoal">{profile.familyInvolvement}</p>
                </div>
              </div>
            </div>

            {/* Box 3: Partner expectations */}
            <div className="bg-white border border-white/40 rounded-[2rem] p-6 space-y-4 shadow-sm md:col-span-2">
              <h5 className="text-xs font-bold text-accent-pink uppercase tracking-wider border-b pb-1 font-mono">Partner Expectations</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#6B635B] font-medium">Preferred Location Search Priority</span>
                  <p className="font-bold text-warm-charcoal bg-[#FF7F50]/10 px-2.5 py-1 rounded-lg text-accent-coral inline-block mt-1">
                    📍 {profile.locationSearchPreference}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Expectation Age Range & Studies</span>
                  <p className="font-bold text-warm-charcoal">Age {profile.partnerAgeRange} • Degree: {profile.partnerEducation}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Values style & Personality</span>
                  <p className="font-bold text-warm-charcoal">{profile.partnerFamilyValues} • {profile.partnerPersonality}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Strict Dealbreakers</span>
                  <p className="font-bold text-rose-600">{(profile.partnerDealbreakers || []).join(', ') || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Box 4: Privacy Settings */}
            <div className="bg-white border border-white/40 rounded-[2rem] p-6 space-y-4 shadow-sm md:col-span-2">
              <h5 className="text-xs font-bold text-warm-charcoal uppercase tracking-wider border-b pb-1 font-mono">Privacy & Photo Rules</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#6B635B] font-medium">Photo Privacy State</span>
                  <p className="font-bold text-warm-charcoal capitalize">{profile.photoPrivacy.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Trusted Contact Involvement</span>
                  <p className="font-bold text-warm-charcoal capitalize">{profile.trustedPerson || 'None'}</p>
                </div>
                <div>
                  <span className="text-[#6B635B] font-medium">Dossier Visibility</span>
                  <p className="font-bold text-warm-charcoal">{profile.seeProfilePermission}</p>
                </div>
              </div>
            </div>

          </div>

          <div className="p-3.5 bg-white/40 border border-white/20 rounded-xl">
            <span className="text-[10px] font-medium text-[#6B635B] block italic">
              "Establishment of serious intent: I verify that all selections represent correct principles and active truthfulness."
            </span>
          </div>

        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-8">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 1}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
            step === 1
              ? 'opacity-40 text-[#6B635B] cursor-not-allowed'
              : 'bg-white/60 border border-white/30 text-warm-charcoal hover:bg-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4 transform rtl:rotate-180" />
          <span>{t.prevStep}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-accent-coral to-accent-pink hover:opacity-90 text-white px-7 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-accent-coral/25 transition-all active:scale-95"
        >
          <span>
            {step === 6 
              ? (locale === 'en' ? 'Start Matching' : locale === 'ar' ? 'بدء البحث عن شريك' : 'دەستپێکردنی گەڕان') 
              : (locale === 'en' ? 'Continue' : locale === 'ar' ? 'متابعة' : 'بەردەوام بە')
            }
          </span>
          <ArrowRight className="w-4 h-4 transform rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
}
