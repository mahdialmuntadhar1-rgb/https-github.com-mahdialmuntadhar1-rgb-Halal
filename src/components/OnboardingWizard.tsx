import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { displayValue } from '../lib/displayValue';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  Sparkles, 
  UploadCloud, 
  Info, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Settings, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

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

const LANGUAGES_OPTIONS = ['Arabic', 'Kurdish', 'English', 'Turkish', 'French', 'Persian', 'Syriac'];

export default function OnboardingWizard({ locale, onComplete, initialProfile }: OnboardingWizardProps) {
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>({
    ...initialProfile,
    badges: initialProfile.badges || ['Serious for marriage'],
    country: initialProfile.country || 'Iraq',
    governorate: initialProfile.governorate || 'Baghdad',
    city: initialProfile.city || '',
    religion: initialProfile.religion || 'islam',
    sect: initialProfile.sect || 'sunni',
    ethnicity: initialProfile.ethnicity || 'arab',
    age: initialProfile.age || 25,
    lookingFor: initialProfile.lookingFor || 'Marriage within one year',
    timeline: initialProfile.timeline || 'Within 1 year',
    wantsChildren: initialProfile.wantsChildren || 'Yes',
    relocation: initialProfile.relocation || 'Yes',
    communicationPreference: initialProfile.communicationPreference || 'Prefers private respectful correspondence',
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
    privateContactMode: initialProfile.privateContactMode || 'Direct Private Only',
    sendRequestsPermission: initialProfile.sendRequestsPermission || 'Everyone verified',
    seeProfilePermission: initialProfile.seeProfilePermission || 'All verified members'
  });

  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [pledgeChecked, setPledgeChecked] = useState<boolean>(false);

  // Set default photo visibilities based on gender
  useEffect(() => {
    if (profile.gender === 'female') {
      updateProfile({ photoPrivacy: 'hidden_by_default' }); // blurred
    } else {
      updateProfile({ photoPrivacy: 'visible' }); // visible or customizable
    }
  }, [profile.gender]);

  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  const validateStep = (): boolean => {
    const currentErrors: string[] = [];
    
    if (step === 1) {
      if (!profile.name.trim()) {
        currentErrors.push(isEn ? "Please provide a Display Name." : isAr ? "يُرجى إدخال اسم العرض التعريفي الخاص بك." : "تکایە ناوێکی نمایش دابنێ.");
      }
      if (profile.age < 18 || profile.age > 60) {
        currentErrors.push(isEn ? "Age must be between 18 and 60." : isAr ? "يجب أن يكون العمر بين ١٨ و ٦٠ عاماً." : "تەمەن دەبێت لە نێوان ١٨ بۆ ٦٠ ساڵ بێت.");
      }
      if (profile.country === 'Iraq' && !profile.governorate) {
        currentErrors.push(isEn ? "Please select a Governorate." : isAr ? "يُرجى اختيار المحافظة العراقية التي تقطن بها." : "تکایە پارێزگاکەت هەڵبژێرە.");
      }
      if (!profile.languages || profile.languages.length === 0) {
        currentErrors.push(isEn ? "Please pick at least one language preference." : isAr ? "يُرجى تحديد لغة واحدة على الأقل تتحدثها." : "تکایە لانیکەم یەک زمان کڵیک بکە.");
      }
    } else if (step === 2) {
      if (!profile.profession.trim()) {
        currentErrors.push(isEn ? "Please state your specific profession/role." : isAr ? "يُرجى كتابة عنوان مهنتك أو عملك بالتحديد للحفاظ على مصداقية الملف للطرف الآخر." : "تکایە پیشەکەت بە دیاریکراوی بنووسە.");
      }
    } else if (step === 6) {
      if (!pledgeChecked) {
        currentErrors.push(isEn ? "You must sign the Sincere Intention Pledge to proceed." : isAr ? "يُرجى تأكيد ميثاق الشرف والالتزام بنية الزواج الشرعية الصادقة أولاً." : "دەبێت بەڵێننامەی نیەتی جدی هاوسەرگیری پەسەند بکەیت بۆ بەردەوامبوون.");
      }
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

  const toggleLanguage = (lang: string) => {
    const active = profile.languages || [];
    const fresh = active.includes(lang)
      ? active.filter(it => it !== lang)
      : [...active, lang];
    updateProfile({ languages: fresh });
  };

  const toggleDealbreaker = (db: string) => {
    const active = profile.partnerDealbreakers || [];
    const fresh = active.includes(db)
      ? active.filter(d => d !== db)
      : [...active, db];
    updateProfile({ partnerDealbreakers: fresh });
  };

  const selectSimulatedPhoto = () => {
    setSimulatedFile('respectful_marital_portrait.jpg');
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
    'Traditional Values', 'Mutual Respect', 'Islamic Commitment', 'Emotional Maturity',
    'Financial Responsibility', 'Family Integration', 'Sincere Communication', 
    'Ambition & Growth', 'Calm Temperament', 'Modest Lifestyle'
  ];

  const DEALBREAKERS_OPTIONS = [
    'Smoking', 'Unseriousness', 'Lack of Prayer', 'Irresponsibility',
    'Relocation disagreement', 'Angry temperament', 'Dishonesty', 'Bad communication'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white/55 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] border border-white/70 shadow-2xl relative z-10" id="onboarding-flow">
      
      {/* Wizard Header Progress Bar */}
      <div className="mb-8 space-y-4 text-left">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-[#40798C] uppercase tracking-wider">
            {isEn ? '🔐 Private Marital Profiling' : isAr ? '🔐 ملف بناء العائلة الخاص' : '🔐 پڕۆفایلی تایبەتی هاوسەرگیری'}
          </span>
          <span className="text-[#6B635B] font-black">
            {isEn ? `Step ${step} of 6` : isAr ? `الخطوة ${step} من ٦` : `هەنگاوی ${step} لە ٦`}
          </span>
        </div>
        
        <div className="w-full bg-stone-200/50 h-2 rounded-full overflow-hidden flex border border-white/40 shadow-inner">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-full flex-1 border-r border-white/20 transition-all duration-500 ${
                s <= step
                  ? 'bg-gradient-to-r from-accent-coral to-[#FF7F50]'
                  : 'bg-stone-300/35'
              }`}
            />
          ))}
        </div>
        
        <h3 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal tracking-tight font-display">
          {step === 1 && (isEn ? 'Step 1: Basic Identity' : isAr ? 'الخطوة ١: الهوية والمواصفات الأساسية' : 'هەنگاوی ١: زانیاری ناسنامەی سەرەکی')}
          {step === 2 && (isEn ? 'Step 2: Education & Background' : isAr ? 'الخطوة ٢: الخلفية الأكاديمية والمهنية' : 'هەنگاوی ٢: خوێندن و پاشخانی کار')}
          {step === 3 && (isEn ? 'Step 3: Marriage Intention & Values' : isAr ? 'الخطوة ٣: غاية الزواج والسمات الأخلاقية' : 'هەنگاوی ٣: نیەتی هاوسەرگیری و بەهاکان')}
          {step === 4 && (isEn ? 'Step 4: Partner Compatibility Criteria' : isAr ? 'الخطوة ٤: المواصفات المطلوبة في شريك الحياة' : 'هەنگاوی ٤: تایبەتمەندییە خوازراوەکانی هاوسەر')}
          {step === 5 && (isEn ? 'Step 5: Privacy & Photo Visibility Guidance' : isAr ? 'الخطوة ٥: إدارة خصوصية الصور وحقوق التواصل' : 'هەنگاوی ٥: هێمنی و کۆنترۆڵکردنی وێنەکانتان')}
          {step === 6 && (isEn ? 'Step 6: Sincere Review & Submission' : isAr ? 'الخطوة ٦: مراجعة دقيقة وميثاق الشرف الأخلاق' : 'هەنگاوی ٦: پێداچوونەوە و بەڵێننامەی کۆتایی')}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#6B635B] font-medium leading-relaxed">
          {step === 1 && (isEn ? 'Let’s map out your basic biography. These fields are visible only to serious vetted matches.' : isAr ? 'يرجى إدخال مواصفاتكِ الأساسية. تذكر أن معلوماتك محفوظة بأعلى مستويات من الأمان والوقار.' : 'با سەرەتاییترین زانیارییەکەت بنووسین. ئەم زانیارییانە پارێزراون.')}
          {step === 2 && (isEn ? 'Provide your occupational and educational background. Transparency encourages mutual family trust.' : isAr ? 'حدد مستواك الدراسي ومجال مهنتك. البيانات الصحيحة والمحترمة توطد ثقة العائلات ببعضها.' : 'شوێنی کار و فێربوونت بنووسە بۆ زیاتر متمانە پێکردن.')}
          {step === 3 && (isEn ? 'Marriage only. Outline your anticipated timeline, relocation, parenting stance, and core virtues.' : isAr ? 'هنا لغرض الزواج الشرعي الجاد فقط. تفضل ببيان خطط البيت المستقبلي والاستقرار العائلي.' : 'تەنها بۆ هاوسەرگیری. تەمەنی خواستراو، منداڵ، و ویستی گواستنەوە دیاری بكە.')}
          {step === 4 && (isEn ? 'Configure your compatibility preferences. Vetted profiles will be curated to align with your expectations.' : isAr ? 'حدد الشروط الفكرية والاجتماعية المطلوبة في شريك حياتك لتصفية ومطابقة الملفات المناسبة تلقائياً.' : 'مەرجەکانی خۆت بۆ هاوبەشی ژیانت بنووسە تا تەنها کەسی گونجاو نیشان بدەین.')}
          {step === 5 && (isEn ? 'Dignity first. Women’s photos are blurred by default. Choose your custom photo exposure levels.' : isAr ? 'الوقار أولاً. تُعرض صور النساء افتراضياً بتمويه كامل، ولكِ الحرية المطلقة في اختيار وسيلة التحكم.' : 'پێشینەی ئێمە سەرەفراتانە. وێنەی خانمان لێڵە. خۆت شێوازی کۆنترۆڵ هەڵبژێرە.')}
          {step === 6 && (isEn ? 'Please double check all values to avoid error claims and guarantee a true, serious experience.' : isAr ? 'مراجعة ختامية سريعة للتأكد من كامل مطابقة معلوماتك، يعقبها التوقيع على تعهد الجدية والمصداقية.' : 'پیش تەمامکردن بەڵێننامە پەسەند بکە بۆ گەرەنتی کردنی نیەتێکی ڕاست و هاوسەرگیری.')}
        </p>

        {/* Validation Errors Overlay */}
        {errors.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-left animate-slideDown">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              Correction Required to Continue
            </p>
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-rose-700 font-semibold pl-6 rtl:pl-0 rtl:pr-6">• {err}</p>
            ))}
          </div>
        )}
      </div>

      {/* STEP 1: Basic Identity */}
      {step === 1 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Display Name / Pseudonym' : 'اسم العرض المستعار (للحفاظ على الخصوصية)'}
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder={isEn ? "e.g. Heba or Ahmed" : "مثال: هبة أو أحمد"}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              />
              <p className="text-[10px] text-[#6B635B] mt-1 font-medium">
                {isEn ? "You can use your real first name or a pseudonym—family names are kept completely private." : "يمكنك كتابة الاسم الأول فقط دون كشف اسم عشيرتك أو عائلتك لتأمين السرية العامة."}
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Biological Gender' : 'الجنس'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateProfile({ gender: 'male' })}
                  className={`p-3 rounded-xl border text-center font-bold text-sm transition-all duration-200 ${
                    profile.gender === 'male'
                      ? 'bg-[#40798C]/15 border-[#40798C] text-[#40798C] shadow-sm'
                      : 'bg-white border-stone-200 text-[#6B635B] hover:bg-stone-50'
                  }`}
                >
                  🙋‍♂️ {isEn ? 'Male' : 'رجل'}
                </button>
                <button
                  type="button"
                  onClick={() => updateProfile({ gender: 'female' })}
                  className={`p-3 rounded-xl border text-center font-bold text-sm transition-all duration-200 ${
                    profile.gender === 'female'
                      ? 'bg-accent-coral/15 border-accent-coral text-accent-coral shadow-sm'
                      : 'bg-white border-stone-200 text-[#6B635B] hover:bg-stone-50'
                  }`}
                >
                  🙋‍♀️ {isEn ? 'Female' : 'امرأة'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">{isEn ? 'Age' : 'العمر'}</label>
              <select
                value={profile.age}
                onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 25 })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a} {isEn ? 'Years Old' : 'عاماً'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">{isEn ? 'Country' : 'بلد الخطوبة'}</label>
              <select
                value={profile.country}
                onChange={(e) => updateProfile({ country: e.target.value, governorate: e.target.value === 'Iraq' ? 'Baghdad' : '' })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {profile.country === 'Iraq' ? (
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">{isEn ? 'Governorate' : 'المحافظة'}</label>
                <select
                  value={profile.governorate}
                  onChange={(e) => updateProfile({ governorate: e.target.value })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm font-semibold text-warm-charcoal"
                >
                  {GOVERNORATES.map((g) => (
                  <option key={g} value={g}>{displayValue(g, locale)}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-wider mb-2 font-mono">{isEn ? 'Governorate' : 'المحافظة'}</label>
                <input
                  type="text"
                  disabled
                  value={isEn ? "Not Applicable" : "ليست مطلوبة خارج العراق"}
                  className="w-full bg-stone-100/60 border border-stone-200 p-3 rounded-xl text-stone-400 text-sm shadow-sm cursor-not-allowed"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'City / District (Optional)' : 'القضاء أو الحي / المنطقة السكنية (اختياري)'}
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => updateProfile({ city: e.target.value })}
                placeholder={isEn ? "e.g. Mansour or Sarchinar" : "مثال: الكرادة، المنصور، أو بختياري"}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'My Languages (Select spoken)' : 'اللغات التي تتحدثها (اختر المتعدد)'}
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES_OPTIONS.map((lang) => {
                  const selected = (profile.languages || []).includes(lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        selected
                          ? 'bg-[#40798C] border-[#40798C] text-white shadow-sm'
                          : 'bg-white border-stone-200 text-warm-charcoal hover:bg-stone-50'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: Background (Education, Profession, Religion, Sect, Ethnicity, Marital Status) */}
      {step === 2 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Education / Degree' : 'التحصيل الدراسي والشهادة'}
              </label>
              <select
                value={profile.education}
                onChange={(e) => updateProfile({ education: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                {EDUCATION_LEVELS.map((el) => (
                  <option key={el} value={el}>{displayValue(el, locale)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Marital Status' : 'الحالة الاجتماعية'}
              </label>
              <select
                value={profile.maritalStatus}
                onChange={(e) => updateProfile({ maritalStatus: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm font-semibold"
              >
                <option value="Single">{isEn ? 'Single' : 'أعزب / عزباء'}</option>
                <option value="Divorced">{isEn ? 'Divorced' : 'مطلق / مطلقة'}</option>
                <option value="Widowed">{isEn ? 'Widowed' : 'أرمل / أرملة'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Profession Category' : 'فئة قطاع العمل العام'}
              </label>
              <select
                value={profile.professionCategory}
                onChange={(e) => updateProfile({ 
                  professionCategory: e.target.value, 
                  profession: e.target.value === 'Other Category' ? '' : e.target.value 
                })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                {PROFESSION_CATEGORIES.map((pc) => (
                  <option key={pc} value={pc}>{pc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Specific Role Title' : 'المسمى الوظيفي بالتفصيل'}
              </label>
              <input
                type="text"
                value={profile.profession}
                onChange={(e) => updateProfile({ profession: e.target.value })}
                placeholder={isEn ? "e.g. Pediatric Dentist or High School Physics Teacher" : "مثال: طبيب مقيم باطنية أو مهندسة معمارية"}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Religion' : 'الديانة'}
              </label>
              <select
                value={profile.religion}
                onChange={(e) => {
                  const r = e.target.value as 'islam' | 'non_islam';
                  updateProfile({ religion: r, sect: r === 'islam' ? 'sunni' : 'none' });
                }}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm font-bold"
              >
                <option value="islam">{isEn ? 'Islam' : 'الإسلام'}</option>
                <option value="non_islam">{isEn ? 'Non-Islam' : 'ديانة أخرى'}</option>
              </select>
            </div>

            {profile.religion === 'islam' ? (
              <div>
                <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                  {isEn ? 'Sect (Optional Disclosure)' : 'المذهب العقدي (اختياري)'}
                </label>
                <select
                  value={profile.sect}
                  onChange={(e) => updateProfile({ sect: e.target.value as 'sunni' | 'shiaa' | 'none' })}
                  className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm font-semibold text-[#40798C]"
                >
                  <option value="sunni">{isEn ? 'Sunni' : 'سني'}</option>
                  <option value="shiaa">{isEn ? 'Shiaa' : 'شيعي'}</option>
                  <option value="none">{isEn ? 'Rather not disclose' : 'لا أرغب في الذكر حالياً'}</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-wider mb-2 font-mono">{isEn ? 'Sect' : 'المذهب'}</label>
                <input
                  type="text"
                  disabled
                  value="N/A"
                  className="w-full bg-stone-100/60 border border-stone-200 p-3 rounded-xl text-stone-400 text-sm shadow-sm cursor-not-allowed"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Ethnicity' : 'القومية'}
              </label>
              <select
                value={profile.ethnicity}
                onChange={(e) => updateProfile({ ethnicity: e.target.value as 'arab' | 'kurdish' | 'others' })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                <option value="arab">{isEn ? 'Arab' : 'عربي / عربية'}</option>
                <option value="kurdish">{isEn ? 'Kurdish' : 'كردي / كوردية'}</option>
                <option value="others">{isEn ? 'Others' : 'قوميات أخرى عريقة'}</option>
              </select>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Marriage Intention & Values */}
      {step === 3 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'What is Sought / Intention style' : 'مسار الارتباط التعريفي'}
              </label>
              <select
                value={profile.lookingFor}
                onChange={(e) => updateProfile({ lookingFor: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                <option value="Marriage soon">{isEn ? "Marriage soon" : "الخطوبة وبناء عائلة بأقرب فرصة مناسبة"}</option>
                <option value="Marriage within one year">{isEn ? "Marriage within one year" : "التوق للارتباط الشرعي في غضون عام"}</option>
                <option value="Serious introduction first">{isEn ? "Serious introduction first" : "التعرف المحترم المؤدي للخطوبة مباشرة"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Marriage Timeline Goal' : 'الجدول الزمني للزواج'}
              </label>
              <select
                value={profile.timeline}
                onChange={(e) => updateProfile({ timeline: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm font-semibold text-[#40798C]"
              >
                <option value="As soon as suitable">{isEn ? "As soon as suitable" : "حال توفر النصيب والارتياح الثنائي"}</option>
                <option value="Within 3 months">{isEn ? "Within 3 months" : "في غضون ٣ أشهر"}</option>
                <option value="Within 6 months">{isEn ? "Within 6 months" : "في غضون ٦ أشهر"}</option>
                <option value="Within 1 year">{isEn ? "Within 1 year" : "في غضون سنة"}</option>
                <option value="Flexible">{isEn ? "Flexible & Balanced" : "مرن ومتريث بالتفاهم"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Relocation Option' : 'الاستعداد للانتقال وتغيير السكن'}
              </label>
              <select
                value={profile.relocation}
                onChange={(e) => updateProfile({ relocation: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                <option value="Yes">{isEn ? "Yes, negotiable" : "نعم، قابل للتفاهم والانتقال"}</option>
                <option value="No">{isEn ? "No, prefers current town" : "لا، أفضل البقاء والاستقرار ببلدتي الحالية"}</option>
                <option value="Inside Iraq only">{isEn ? "Inside Iraq only" : "داخل العراق فقط"}</option>
                <option value="Outside Iraq possible">{isEn ? "Outside Iraq possible" : "خارج العراق ممكن"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Children Attitude' : 'النظرة لإنجاب الأطفال وتربيتهم'}
              </label>
              <select
                value={profile.wantsChildren}
                onChange={(e) => updateProfile({ wantsChildren: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                <option value="Yes">{isEn ? "Yes" : "نعم، رغبة كبيرة بالذرية الصالحة"}</option>
                <option value="No">{isEn ? "No" : "لا أرغب في الإنجاب"}</option>
                <option value="Already have children">{isEn ? "Already have children" : "لدي أطفال بالفعل بفضل الله"}</option>
                <option value="Discuss later">{isEn ? "Prefer to discuss later" : "تأجيل النقاش لما بعد التوافق والارتياح"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Lifestyle & Comm. Style' : 'نمط الحياة والتواصل العائلي'}
              </label>
              <select
                value={profile.communicationPreference}
                onChange={(e) => updateProfile({ communicationPreference: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-[#40798C] text-sm shadow-sm"
              >
                <option value="Prefers private respectful correspondence">{isEn ? "Private respectful chats only" : "دردشة جدية ثنائية ذات هدف وقور"}</option>
                <option value="Family-guided parameters">{isEn ? "Family-involved / Traditional style" : "شروط وقورة مهيأة بموازين العرف العراقي"}</option>
                <option value="Strictly private with secure steps">{isEn ? "Strictly confidential steps" : "طرق منضبطة تعلي من احترام وصون الآخر"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-3 font-mono">
              {isEn ? 'What matters most to you in marriage? (Multi-select)' : 'ما هي المرتكزات والقيم الأهم بالنسبة لك ببناء البيت؟ (حدد المتعدد)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {WHAT_MATTERS_MOST_OPTIONS.map((opt) => {
                const selected = (profile.values || []).includes(opt);
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
                        ? 'bg-[#40798C] border-[#40798C] text-white shadow-md'
                        : 'bg-white border-stone-200 text-[#4A443F] hover:bg-stone-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. Serious Intention Badges Selection */}
          <div className="space-y-3 pt-5 border-t border-stone-200/50">
            <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider font-mono">
              {isEn ? '🛡️ Serious Intention Badges' : '🛡️ شارات ونوايا الارتباط الجاد'}
            </label>
            <p className="text-[11px] text-stone-500 font-semibold leading-relaxed">
              {isEn 
                ? 'Select the badges that represent your current situation and marriage path. These will be highlighted on your card.' 
                : 'اختر الشارات التي تصف وضعك الحالي ونقاشاتك تجاه بناء بيت مستقبلي؛ ستظهر للآخرين لدعم ثقتهم بنظرتك المتزنة:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'Serious for marriage', en: 'Serious for marriage', ar: '💍 جاد للزواج الفعلي' },
                { key: 'Family involved', en: 'Family involved', ar: '👨‍👩‍👧 الأهل على علم بالمشاركة' },
                { key: 'Ready for engagement', en: 'Ready for engagement', ar: '📝 مستعد للخطوبة الفورية' },
                { key: 'Studying first', en: 'Studying first', ar: '📚 الدراسة أولاً مع التعرف' },
                { key: 'Private profile', en: 'Private profile', ar: '🔒 ملف تعريفي متحفظ وخاص' }
              ].map((badge) => {
                const isSelected = (profile.badges || []).includes(badge.key);
                return (
                  <button
                    type="button"
                    key={badge.key}
                    onClick={() => {
                      const currentBadges = profile.badges || [];
                      const updatedBadges = currentBadges.includes(badge.key)
                        ? currentBadges.filter(b => b !== badge.key)
                        : [...currentBadges, badge.key];
                      updateProfile({ badges: updatedBadges });
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition duration-200 ${
                      isSelected
                        ? 'bg-[#40798C] border-[#40798C] text-white shadow-md'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{isEn ? badge.en : badge.ar}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* STEP 4: Partner Preferences (Age range, Country/governorate, Religion, Sect, Education, Smoking, Children, Dealbreakers) */}
      {step === 4 && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Preferred Spouse Age range' : 'الفئة العمرية المقبولة في الطرف الآخر'}
              </label>
              <select
                value={profile.partnerAgeRange}
                onChange={(e) => updateProfile({ partnerAgeRange: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm font-semibold"
              >
                <option value="18-24">{isEn ? '18-24 Years Old' : 'من ١٨ إلى ٢٤ عاماً'}</option>
                <option value="25-30">{isEn ? '25-30 Years Old' : 'من ٢٥ إلى ٣٠ عاماً'}</option>
                <option value="31-35">{isEn ? '31-35 Years Old' : 'من ٣١ إلى ٣٥ عاماً'}</option>
                <option value="36-40">{isEn ? '36-40 Years Old' : 'من ٣٦ إلى ٤٠ عاماً'}</option>
                <option value="41-45">{isEn ? '41-45 Years Old' : 'من ٤١ إلى ٤٥ عاماً'}</option>
                <option value="Any suitable age">{isEn ? 'Any Suitable Age' : 'لا مشكلة، حسب التوافق والارتياح الفكري'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Sought Location Priority' : 'الأولوية الجغرافية للبحث والتصفية'}
              </label>
              <select
                value={profile.locationSearchPreference}
                onChange={(e) => updateProfile({ locationSearchPreference: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Across all Iraq">{isEn ? 'Across all Iraq' : 'في كافة المحافظات العراقية'}</option>
                <option value="Inside one governorate">{isEn ? 'Same governorate priority' : 'الأولوية داخل محافظتي فقط بالدرجة الأولى'}</option>
                <option value="Outside Iraq">{isEn ? 'Gorbah / Outside Iraq' : 'عراقيين مقيمين خارج القطر / بلاد المهجر'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Sought Spouse Education' : 'أقل تحصيل دراسي مطلوب مقترح'}
              </label>
              <select
                value={profile.partnerEducation}
                onChange={(e) => updateProfile({ partnerEducation: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Any level">{isEn ? 'Any level is acceptable' : 'لا مشكلة، الأخلاق والجدية قبل مستوى الدراسة'}</option>
                <option value="Bachelor's Degree">{isEn ? "Minimum Bachelor's degree" : "شهادة البكالوريوس فما فوق"}</option>
                <option value="Master's Degree">{isEn ? "Minimum Master's or postgraduate" : "دراسات عليا / ماجستير ودكتوراه"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Sought Spouse Profession' : 'الأولوية المهنية في الطرف الآخر'}
              </label>
              <select
                value={profile.partnerProfession}
                onChange={(e) => updateProfile({ partnerProfession: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral text-sm shadow-sm"
              >
                <option value="Any Profession">{isEn ? "Any Category" : "لا يهم نوع الوظيفة ما دامت حلالاً شريفة"}</option>
                <option value="Engineering">{isEn ? 'Engineering field' : 'مجال الهندسة والتقنيات'}</option>
                <option value="Medicine & Healthcare">{isEn ? 'Doctor / Medical' : 'القطاع الطبي والتمريضي'}</option>
                <option value="Education & Academia">{isEn ? 'Teacher / Education' : 'سلك التعليم والتربية'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Preferred Religion' : 'الديانة المقترحة شريطةً'}
              </label>
              <select
                value={profile.partnerReligion}
                onChange={(e) => updateProfile({ partnerReligion: e.target.value as 'all' | 'islam' | 'non_islam' })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal text-sm shadow-sm font-semibold"
              >
                <option value="islam">{isEn ? 'Islam only' : 'مسلم / مسلمة فقط'}</option>
                <option value="all">{isEn ? 'Any religion' : 'لا تشترط بالتحديد'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Smoking Rule' : 'موقف التدخين أو الأرجيلة'}
              </label>
              <select
                value={profile.partnerSmoking}
                onChange={(e) => updateProfile({ partnerSmoking: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal text-sm shadow-sm"
              >
                 <option value="Non-smoker">{isEn ? "Strictly Non-smoker" : "غير مدخن إطلاقاً (شرط أساسي)"}</option>
                 <option value="Smoker acceptable">{isEn ? "Smoker is acceptable" : "التدخين مقبول أو ليس نقطة خلاف"}</option>
                 <option value="Prefer non-smoker">{isEn ? "Prefer non-smoker" : "يفضل غير مدخن"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
                {isEn ? 'Children Attitude preference' : 'النظرة لأطفال الطرف الآخر حال وجودهم'}
              </label>
              <select
                value={profile.partnerWantsChildren}
                onChange={(e) => updateProfile({ partnerWantsChildren: e.target.value })}
                className="w-full bg-white border border-stone-200 p-3 rounded-xl text-warm-charcoal text-sm shadow-sm font-medium"
              >
                <option value="Yes">{isEn ? "Wants Children" : "يرغب في إنجاب ذرية"}</option>
                <option value="Maybe">{isEn ? "Open/Discussions" : "قابل للنقاش الودي والتقارب"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-3 font-mono">
              {isEn ? 'Absolute Match Dealbreakers' : 'الخطوط الحمراء ونقاط الفصل التامة (اختر ما تمانعه بالكامل)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {DEALBREAKERS_OPTIONS.map((db) => {
                const selected = (profile.partnerDealbreakers || []).includes(db);
                return (
                  <button
                    type="button"
                    key={db}
                    onClick={() => toggleDealbreaker(db)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selected
                        ? 'bg-rose-500 border-rose-500 text-white font-bold shadow'
                        : 'bg-white border-stone-200 text-[#6B635B] hover:bg-stone-50'
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

      {/* STEP 5: Privacy & Photo Visibility Guidance */}
      {step === 5 && (
        <div className="space-y-6 text-left">
          
          <div className="p-5 bg-[#40798C]/5 border border-[#40798C]/20 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-[#40798C] mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-warm-charcoal leading-none">
                {isEn ? "Privacy Control over Photo Visibility" : "موازين الأمان والخصوصية للطرفين"}
              </p>
              <p className="text-[11px] text-[#6B635B] leading-relaxed">
                {isEn 
                  ? "At HALAL, women's photos are automatically blurred, ensuring zero public exposure. Men also possess full configuration settings to shield portraits from casual browsing, promoting safety and deep respect." 
                  : "خصوصية متبادلة لحماية كرامة العائلات. يتم ضبط صور الفتيات بصفة افتراضية على المظهر المموه المشفر. للرجال أيضاً الصلاحيات لاقتصار ظهور صورهم لمن نالوا قبولهم فقط لضمان بيئة آمنة وراقية."}
              </p>
            </div>
          </div>

          {/* Portrait Photo Upload Simulation */}
          <div className="bg-white border border-stone-150 p-6 rounded-[2rem] space-y-4">
            <h4 className="text-xs font-bold text-[#40798C] uppercase tracking-wider font-mono">
              {isEn ? '📁 Simulative Portrait Verification' : '📁 تحميل صورة التحقق التعريفية (المصانة)'}
            </h4>

            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center cursor-pointer transition ${
                isDragOver ? 'bg-[#40798C]/10 border-[#40798C]' : 'hover:bg-stone-50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              {simulatedFile ? (
                <div>
                  <p className="text-xs font-bold text-warm-charcoal">{simulatedFile}</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Digital image staged securely</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-medium text-warm-charcoal">
                    {isEn ? "Choose your profile photo files (Accepts JPG/PNG)" : "انقر لاختيار صورة وقورة للمطابقة (أو قم بإفلاتها هنا)"}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    {isEn ? "Only verified matches who have accepted dynamic request parameters will eventually request to view it." : "لن يشاهد صورتكِ الفتيات المدخلة سوى الشركاء المتوافقين تماماً وعقب كشفها الإرادي الفردي."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={selectSimulatedPhoto}
                className="text-xs font-bold text-[#40798C] bg-[#40798C]/10 border border-[#40798C]/15 hover:bg-[#40798C]/15 px-4 py-2 rounded-xl"
              >
                {isEn ? "Simulate Clean Profile Avatar Portrait" : "توليد صورة تجريبية ملائمة بذكاء المنصة"}
              </button>
            </div>
          </div>

          {/* Customized Levels selectors */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-warm-charcoal uppercase tracking-wider mb-2 font-mono">
              {isEn ? 'Set Your Photo Privacy Level' : 'اختر الوضع المناسب لعرض صورتك للآخرين'}
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => updateProfile({ photoPrivacy: 'hidden_by_default' })}
                className={`p-4 rounded-2xl text-left border transition duration-200 ${
                  profile.photoPrivacy === 'hidden_by_default'
                    ? 'bg-[#40798C]/10 border-[#40798C] text-warm-charcoal shadow-sm'
                    : 'bg-white border-stone-200 text-warm-charcoal hover:bg-stone-50'
                }`}
              >
                <p className="font-bold text-xs sm:text-sm">🔒 {isEn ? 'Blurred Photo' : 'تمويه وحجب الصورة بصفة افتراضية'}</p>
                <p className="text-[11px] text-[#6B635B] mt-1">
                  {isEn ? 'Photos remain blurred on lists. Reveal portrait individually with mutual conversation requests.' : 'سيبقى مظهر وجهك في بطاقة البحث مخفيّاً لضمان عدم التعرف العشوائي، وتكفله لمن تقرره فقط.'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => updateProfile({ photoPrivacy: 'visible' })}
                className={`p-4 rounded-2xl text-left border transition duration-200 ${
                  profile.photoPrivacy === 'visible'
                    ? 'bg-emerald-500/10 border-emerald-500 text-warm-charcoal shadow-sm'
                    : 'bg-white border-stone-200 text-warm-charcoal hover:bg-stone-50'
                }`}
              >
                <p className="font-bold text-xs sm:text-sm">🔓 {isEn ? 'Visible Photo (Normal View)' : 'صورة واضحة مباشرة'}</p>
                <p className="text-[11px] text-[#6B635B] mt-1">
                  {isEn ? 'Visually display your respectfully formatted portrait clearly to verified candidates only.' : 'إتاحة صورتك مباشرة للفئة الجادة الموثقة بالهوية لتقريب الاختيار بشكل أسرع.'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => updateProfile({ photoPrivacy: 'hidden' })}
                className={`p-4 rounded-2xl text-left border transition duration-200 ${
                  profile.photoPrivacy === 'hidden'
                    ? 'bg-rose-500/10 border-rose-400 text-warm-charcoal shadow-sm'
                    : 'bg-white border-stone-200 text-warm-charcoal hover:bg-stone-50'
                }`}
              >
                <p className="font-bold text-xs sm:text-sm">🚫 {isEn ? 'Photo Hidden' : 'حجب الصورة بالكامل'}</p>
                <p className="text-[11px] text-[#6B635B] mt-1">
                  {isEn ? 'Completely hides files from all list options. Placeholders initials replace portraits.' : 'لا يتم طلب رفع صور على الإطلاق ويستعاض بتفاصيل خلفيتك ونزاهة أخلاقك المعبرة.'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => updateProfile({ photoPrivacy: 'initials' })}
                className={`p-4 rounded-2xl text-left border transition duration-200 ${
                  profile.photoPrivacy === 'initials'
                    ? 'bg-purple-500/10 border-purple-400 text-warm-charcoal shadow-sm'
                    : 'bg-white border-stone-200 text-warm-charcoal hover:bg-stone-50'
                }`}
              >
                <p className="font-bold text-xs sm:text-sm">🌸 {isEn ? 'Initials Emblem Avatar' : 'أيقونة الحروف للملفات السرية'}</p>
                <p className="text-[11px] text-[#6B635B] mt-1">
                  {isEn ? 'Show custom beautifully stylized typography initials instead of physical picture.' : 'توليد وسم فني هادئ يحمل أحرف اسمكِ لتفادي اللجوء لأي مستمسك صورة.'}
                </p>
              </button>
            </div>
          </div>

          {/* Secure matching control toggles */}
          <div className="bg-white/45 border border-stone-200/60 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-warm-charcoal uppercase tracking-wider font-mono">
              {isEn ? '⚙️ Exclusive Match Restrictions' : '⚙️ قيود الاتصال والبحث الفائقة'}
            </h4>
            
            <div className="space-y-3 text-xs font-medium text-warm-charcoal">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={profile.seeProfilePermission === 'Only compatible members'}
                  onChange={(e) => updateProfile({ 
                    seeProfilePermission: e.target.checked 
                      ? 'Only compatible members' 
                      : 'All verified members' 
                  })}
                  className="rounded border-stone-300 text-[#40798C] focus:ring-[#40798C] mt-0.5"
                />
                <div>
                  <span className="font-bold">{isEn ? 'Show full profile only after direct request approval' : 'عدم السماح بمشاهدة كامل بطاقة بياناتي إلا عقب اختياري وموافقتي'}</span>
                  <p className="text-[10px] text-[#6B635B] mt-0.5">{isEn ? 'Protects details from casual verified account browsers.' : 'تقييد استكشاف السيرة الذاتية لدرجة الصفر لمنع أي تصفح غير هادف.'}</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-stone-200/50">
                <input 
                  type="checkbox"
                  checked={profile.sendRequestsPermission === 'Only approved suggestions'}
                  onChange={(e) => updateProfile({ 
                    sendRequestsPermission: e.target.checked 
                      ? 'Only approved suggestions' 
                      : 'Everyone verified' 
                  })}
                  className="rounded border-stone-300 text-[#40798C] focus:ring-[#40798C] mt-0.5"
                />
                <div>
                  <span className="font-bold">{isEn ? 'Open chat room ONLY after mutual match interest' : 'دردشة مغلقة تماماً ولا تُفتح إلا بقبول ثنائي متبادل'}</span>
                  <p className="text-[10px] text-[#6B635B] mt-0.5">{isEn ? 'Enforces strict mutual approval guidelines. Zero spam communication.' : 'منع إرسال رسائل أو فتح نوافذ عشوائية من أي حساب غريب.'}</p>
                </div>
              </label>
            </div>
          </div>

        </div>
      )}

      {/* STEP 6: Sincere Review & Submission */}
      {step === 6 && (
        <div className="space-y-6 text-left">
          
          <div className="p-5 bg-[#40798C]/10 rounded-2xl border border-[#40798C]/20 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#40798C] mx-auto animate-pulse" />
            <h4 className="text-base font-serif font-black text-warm-charcoal font-display">
              {isEn ? 'Your Marriage Portfolio Dossier is Complete' : 'ملف الزواج الخاص بك مكتمل ومعد بدقة'}
            </h4>
            <p className="text-xs text-[#6B635B] font-medium max-w-lg mx-auto leading-relaxed">
              {isEn 
                ? "Please review your calibrated matchmaking parameters below. All data is protected with TLS and encryption under HALAL Match guidelines." 
                : "يرجى مراجعة بيانات ميثاقك التعريفي أدناه. يتم تشفير وحفظ هذه البيانات بكل وقار وأمان، وهي متاحة فقط لمن يتناسق مع شروطك الفكرية."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Box 1: My Profile Bio */}
            <div className="bg-white/95 border border-stone-200 rounded-3xl p-5 space-y-3.5 shadow-sm">
              <h5 className="text-xs font-black text-accent-coral uppercase tracking-wider border-b border-stone-100 pb-1.5 font-mono">
                👤 {isEn ? 'My Profile Details' : 'البيانات الشخصية'}
              </h5>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Name' : 'الاسم والسن'}</span>
                  <p className="font-bold text-warm-charcoal text-sm">{profile.name}, {profile.age} &bull; <span className="capitalize">{displayValue(profile.gender, locale)}</span></p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Location' : 'المكان السكني'}</span>
                  <p className="font-bold text-warm-charcoal">
                    {profile.country === 'Iraq' ? `${displayValue(profile.governorate, locale)}, ${displayValue('Iraq', locale)} ${profile.city ? `(${displayValue(profile.city, locale)})` : ''}` : `${displayValue(profile.country, locale)}`}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Religion & Ethnicity' : 'الديانة والقومية'}</span>
                  <p className="font-bold text-warm-charcoal capitalise">
                    {profile.religion === 'islam' ? `${displayValue(profile.sect || 'Sunni', locale)} ${displayValue('islam', locale)}` : displayValue('non_islam', locale)} / {displayValue(profile.ethnicity, locale)}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Occupation & Education' : 'العمل والتحصيل العلمي'}</span>
                  <p className="font-bold text-[#40798C]">{displayValue(profile.education, locale)} &bull; {displayValue(profile.profession, locale)}</p>
                </div>
              </div>
            </div>

            {/* Box 2: Partner expectations & Marriage Intention */}
            <div className="bg-white/95 border border-stone-200 rounded-3xl p-5 space-y-3.5 shadow-sm">
              <h5 className="text-xs font-black text-[#40798C] uppercase tracking-wider border-b border-stone-100 pb-1.5 font-mono">
                💍 {isEn ? 'Marriage Intentions' : 'أهداف ومعايير الشريك'}
              </h5>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Sought Goal' : 'الرؤية والجاهزية'}</span>
                  <p className="font-bold text-warm-charcoal">{displayValue(profile.lookingFor, locale)}</p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Estimated Timeline' : 'الجدول الزمني المقترح'}</span>
                  <p className="font-bold text-accent-coral">{displayValue(profile.timeline, locale)}</p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Children & Relocation' : 'الأطفال والانتقال والمسكن'}</span>
                  <p className="font-bold text-warm-charcoal">
                    {isEn ? `Children: ${displayValue(profile.wantsChildren, locale)} | Relocate: ${displayValue(profile.relocation, locale)}` : `إنجاب الأطفال: ${displayValue(profile.wantsChildren, locale)} | الانتقال: ${displayValue(profile.relocation, locale)}`}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Matched Age Limits' : 'شروط الشريك المستهدف'}</span>
                  <p className="font-bold text-warm-charcoal">
                    {isEn ? `Age ${profile.partnerAgeRange} | Degree: ${displayValue(profile.partnerEducation, locale)}` : `عمر شريك الحياة: ${profile.partnerAgeRange} | مستوى التعليم المطلوب: ${displayValue(profile.partnerEducation, locale)}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Box 3: Privacy & Photo choice summary */}
            <div className="bg-white/95 border border-stone-200 rounded-3xl p-5 space-y-3 border-dashed md:col-span-2">
              <h5 className="text-xs font-black text-stone-500 uppercase tracking-wider border-b border-stone-100 pb-1 font-mono">
                🛡️ {isEn ? 'My Privacy Choice Summary' : 'قواعد خصوصية ملفي المتفقة عليها'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Photo Display' : 'أمن وصورة العرض'}</span>
                  <p className="font-bold text-warm-charcoal capitalize">
                    {profile.photoPrivacy === 'hidden_by_default' ? (isEn ? '🔒 Blurred Portrait' : '🔒 صورة مموهة بحرص') : profile.photoPrivacy}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Profile Browsing' : 'أحقية استكشاف السيرة'}</span>
                  <p className="font-bold text-warm-charcoal">
                    {profile.seeProfilePermission === 'Only compatible members' ? (isEn ? 'Only Compatibles' : 'المستكشفون المتوافقون فقط') : (isEn ? 'All Verified' : 'جميع الأعضاء الموثقين')}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 font-bold font-mono text-[9px] uppercase tracking-wider">{isEn ? 'Interactions' : 'طريقة بدء المحادثة'}</span>
                  <p className="font-bold text-[#40798C]">
                    {profile.sendRequestsPermission === 'Only approved suggestions' ? (isEn ? 'Strict Mutual match' : 'قبول متبادل حظر للسبام') : (isEn ? 'Vetted requests' : 'إرسال طلبات محترمة')}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sincere ethical marriage pledge input requirement */}
          <div className="bg-stone-50 border border-stone-200/80 p-5 rounded-3xl space-y-3 mt-6">
            <h4 className="text-xs font-black text-[#40798C] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{isEn ? 'Sincere Marital Intention Pledge' : 'ميثاق شرف الارتباط الجاد وحسن النوايا'}</span>
            </h4>
            
            <p className="text-xs text-[#6B635B] leading-relaxed font-medium">
              {isEn 
                ? "By checking the binding pledge below, you swear under your ethical values that your goal is solely a serious lawful marriage (lawful nikah). Any casual dating, amusement, catfishing, or unserious behaviors will trigger automated identity expulsion from our Iraqi Match framework."
                : "بتحديد موافقتك أدناه، أنت تقر وتلتزم التزاماً كاملاً أمام الله والمجتمع بأن الهدف الأوحد والوحيد لولوجك المنصة هو التماس الشريك الحقيقي لبناء عش الزوجية والاستقرار بالخطوبة الرسمية. يُحظر كلياً التعارف والدردشات المبتذلة أو التسلية، ويخضع مخالفو الميثاق لإنهاء الحساب والمساءلة."}
            </p>

            <label className="flex items-start gap-3 bg-white p-4.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50 transition mt-3">
              <input 
                type="checkbox"
                id="intention-pledge-checkbox"
                checked={pledgeChecked}
                onChange={(e) => setPledgeChecked(e.target.checked)}
                className="rounded border-stone-300 text-[#40798C] scale-110 focus:ring-[#40798C] mt-1"
              />
              <span className="text-xs sm:text-sm font-black text-warm-charcoal select-none leading-relaxed">
                {isEn 
                  ? "I confirm I am using HALAL for serious marriage intentions only." 
                  : "أؤكد والتزم بأنني أستخدم منصة حلال لغرض الزواج الشرعي الصادق وبناء أسرة وقورة فقط."}
              </span>
            </label>
          </div>

        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-stone-200 mt-8">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 1}
          className={`flex items-center space-x-1.5 rtl:space-x-reverse px-5 py-3 rounded-2xl text-sm font-black transition-all duration-200 ${
            step === 1
              ? 'opacity-30 text-[#6B635B] cursor-not-allowed bg-transparent'
              : 'bg-white border border-stone-200 text-warm-charcoal hover:bg-stone-50 active:scale-95'
          }`}
        >
          <ArrowLeft className="w-4 h-4 transform rtl:rotate-180" />
          <span>{t.prevStep}</span>
        </button>

        <button
          type="button"
          id="onboarding-continue-button"
          onClick={handleNext}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-accent-coral to-[#FF7F50] hover:opacity-95 text-white px-7 py-3 rounded-2xl text-sm font-extrabold shadow-lg shadow-accent-coral/20 transition-all active:scale-95 duration-200"
        >
          <span>
            {step === 6 
              ? (isEn ? 'Start Matchmaking' : isAr ? 'بدء البحث' : 'دەستپێکردنی گەڕان') 
              : (isEn ? 'Continue' : isAr ? 'متابعة' : 'بەردەوام بە')
            }
          </span>
          <ArrowRight className="w-4 h-4 transform rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
}
