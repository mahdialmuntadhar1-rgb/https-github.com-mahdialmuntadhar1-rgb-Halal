import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { useApi } from '../engine';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User, 
  Lock, 
  MapPin, 
  Mail, 
  Heart,
  Eye,
  EyeOff,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Users
} from 'lucide-react';

interface OnboardingWizardProps {
  locale: AppLanguage;
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

const GOVERNORATES = [
  'Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk',
  'Najaf', 'Karbala', 'Babil', 'Wasit', 'Diyala', 'Anbar', 'Salah al-Din',
  'Maysan', 'Dhi Qar', 'Muthanna', 'Qadisiyah', 'Halabja'
];

export default function OnboardingWizard({ locale, onComplete, initialProfile }: OnboardingWizardProps) {
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  // 1 to 4 steps, then 'success'
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 'success'>(1);
  
  // STEP 1: Choose Role (👰 Bride / 👨 Groom)
  // Bride -> Female, Groom -> Male
  const [role, setRole] = useState<'bride' | 'groom'>('groom');

  // STEP 2: Essential Information
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 25);
  const [governorate, setGovernorate] = useState(initialProfile?.governorate || 'Baghdad');
  const [district, setDistrict] = useState(initialProfile?.city || '');
  const [maritalStatus, setMaritalStatus] = useState(initialProfile?.maritalStatus || 'Single');
  const [education, setEducation] = useState(initialProfile?.education || 'Bachelor Degree');
  const [occupation, setOccupation] = useState(initialProfile?.profession || '');

  // STEP 3: Looking For
  const [prefAgeRange, setPrefAgeRange] = useState<string>('25-35');
  const [prefGov, setPrefGov] = useState<string>('Baghdad');
  const [isSeriousOnly, setIsSeriousOnly] = useState<boolean>(true);

  // STEP 4: Account Credentials (if unregistered)
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Optional Photo / Emoji Avatar State
  const [photoType, setPhotoType] = useState<'skip' | 'emoji' | 'initials' | 'upload'>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('👤');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const validateStep2 = () => {
    const errs: string[] = [];
    if (!name.trim()) {
      errs.push(txt("First name is required.", "الاسم الأول مطلوب.", "ناوی یەکەم پێویستە."));
    }
    if (age < 18 || age > 75) {
      errs.push(txt("Age must be between 18 and 75.", "يجب أن يكون العمر بين ١٨ و ٧٥ عاماً.", "تەمەن دەبێت لە نێوان ١٨ بۆ ٧٥ ساڵ بێت."));
    }
    if (!district.trim()) {
      errs.push(txt("District / Neighborhood is required.", "القضاء / الحي مطلوب.", "قەزا یان گەڕەک پێویستە."));
    }
    if (!occupation.trim()) {
      errs.push(txt("Occupation / Job is required.", "المهنة / العمل مطلوب.", "پیشە پێویستە."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const validateStep3 = () => {
    const errs: string[] = [];
    if (!isSeriousOnly) {
      errs.push(txt("You must confirm you are seeking a serious marriage.", "يجب عليك تأكيد رغبتك بالزواج الجاد فقط.", "دەبێت پشتڕاستی بکەیتەوە کە تەنها بەدوای هاوسەرگیری جددیدا دەگەڕێیت."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const validateStep4 = () => {
    // If they are already authenticated, they can proceed without register
    const isMockOrRealToken = localStorage.getItem('halal_token');
    if (isMockOrRealToken) return true;

    const errs: string[] = [];
    if (!contact.trim()) {
      errs.push(txt("Phone number or email is required.", "رقم الهاتف أو البريد الإلكتروني مطلوب.", "ژمارەی مۆبایل یان ئیمەیڵ پێویستە."));
    }
    if (password.length < 6) {
      errs.push(txt("Password must be at least 6 characters.", "يجب أن تكون كلمة المرور ٦ أحرف على الأقل.", "وشەی تێپەڕ دەبێت لانی کەم ٦ پیت بێت."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    setErrors([]);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validateStep3()) {
        // If already authenticated, skip registration credentials step and go straight to success!
        const hasToken = localStorage.getItem('halal_token');
        if (hasToken) {
          handleSaveAndFinish();
        } else {
          setStep(4);
        }
      }
    }
  };

  const handleBack = () => {
    setErrors([]);
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const handleSaveAndFinish = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      const finalGender = role === 'bride' ? 'female' : 'male';
      
      let finalAvatarUrl = "";
      let finalPhotoStatus: 'blurred' | 'hidden' | 'initials' | 'visible' = 'visible';

      if (photoType === 'emoji') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>${selectedEmoji}</text></svg>`;
        finalPhotoStatus = 'visible';
      } else if (photoType === 'initials') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23E8F0F2'/><text y='65' x='50' font-size='48' font-family='serif' font-weight='bold' fill='%2340798C' text-anchor='middle'>${name ? name.charAt(0).toUpperCase() : '?'}</text></svg>`;
        finalPhotoStatus = 'initials';
      } else if (photoType === 'upload' && uploadedPhotoUrl) {
        finalAvatarUrl = uploadedPhotoUrl;
        finalPhotoStatus = 'blurred';
      } else {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>👤</text></svg>`;
        finalPhotoStatus = 'hidden';
      }

      const partialProfile: Partial<UserProfile> = {
        name,
        age,
        gender: finalGender,
        governorate,
        city: district,
        maritalStatus,
        education,
        profession: occupation,
        partnerAgeRange: prefAgeRange,
        partnerGovernorate: prefGov,
        photoPrivacy: finalGender === 'female' ? 'hidden_by_default' : 'visible',
        badges: ['Serious for marriage'],
        timeline: 'Within 1 year',
        wantsChildren: 'Yes',
        avatarUrl: finalAvatarUrl,
        photoStatus: finalPhotoStatus
      };

      await api.updateCurrentUserProfile(partialProfile);
      setStep('success');
    } catch (err: any) {
      setErrors([err.message || txt("Failed to update profile.", "فشل تحديث الملف الشخصي.", "تۆمارکردن سەرکەوتوو نەبوو.")]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setIsLoading(true);
    setErrors([]);

    const emailToUse = contact.includes('@') ? contact : `${contact.replace(/\s+/g, '')}@halal.me`;
    const finalGender = role === 'bride' ? 'female' : 'male';

    try {
      // 1. Call Register
      const authResponse = await api.register(name, governorate, emailToUse, undefined, password);
      
      let finalAvatarUrl = "";
      let finalPhotoStatus: 'blurred' | 'hidden' | 'initials' | 'visible' = 'visible';

      if (photoType === 'emoji') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>${selectedEmoji}</text></svg>`;
        finalPhotoStatus = 'visible';
      } else if (photoType === 'initials') {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23E8F0F2'/><text y='65' x='50' font-size='48' font-family='serif' font-weight='bold' fill='%2340798C' text-anchor='middle'>${name ? name.charAt(0).toUpperCase() : '?'}</text></svg>`;
        finalPhotoStatus = 'initials';
      } else if (photoType === 'upload' && uploadedPhotoUrl) {
        finalAvatarUrl = uploadedPhotoUrl;
        finalPhotoStatus = 'blurred';
      } else {
        finalAvatarUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%25' height='100%25' fill='%23FAF5EE'/><text y='70' x='50' font-size='60' text-anchor='middle'>👤</text></svg>`;
        finalPhotoStatus = 'hidden';
      }

      // 2. Build final Profile structure
      const finalProfile: UserProfile = {
        name,
        age,
        gender: finalGender,
        country: 'Iraq',
        governorate,
        city: district,
        religion: 'islam',
        ethnicity: 'arab',
        languages: ['Arabic'],
        photoPrivacy: finalGender === 'female' ? 'hidden_by_default' : 'visible',
        education,
        profession: occupation,
        maritalStatus,
        partnerAgeRange: prefAgeRange,
        partnerGovernorate: prefGov,
        badges: ['Serious for marriage'],
        values: ['Family First', 'Mutual Respect'],
        timeline: 'Within 1 year',
        wantsChildren: 'Yes',
        relocation: 'Yes',
        communicationPreference: 'Prefers private respectful correspondence',
        avatarUrl: finalAvatarUrl,
        photoStatus: finalPhotoStatus
      };

      // 3. Update profile with basic details
      await api.updateCurrentUserProfile(finalProfile);

      // 4. Save token
      if (authResponse.token) {
        localStorage.setItem('halal_token', authResponse.token);
      }

      setStep('success');
    } catch (err: any) {
      setErrors([err.message || txt("Registration failed.", "فشل التسجيل. يرجى المحاولة مرة أخرى.", "تۆمارکردن سەرکەوتوو نەبوو.")]);
    } finally {
      setIsLoading(false);
    }
  };

  // UI calculations
  const progressPercent = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="max-w-xl mx-auto px-4" id="onboarding-wizard">
      
      {/* Progress indicators */}
      {step !== 'success' && (
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-black text-[#6B635B] uppercase tracking-wider">
            <span>{txt(`Step ${step} of 4`, `الخطوة ${step} من ٤`, `هەنگاوی ${step} لە ٤`)}</span>
            <span className="text-accent-coral">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-200/60 h-2 rounded-full overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-accent-coral to-accent-pink h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Errors list */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-2xl text-left space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-rose-800 font-bold">{err}</p>
          ))}
        </div>
      )}

      {/* STEP 1: Choose Role (Bride / Groom) */}
      {step === 1 && (
        <div className="space-y-6 text-center animate-fade-in" id="wizard-step-1">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal font-display">
              {txt("Choose Your Role", "اختر حسابك", "ڕۆڵی خۆت دیاری بکە")}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm font-medium">
              {txt(
                "Please select if you are a Bride or a Groom to begin your search.",
                "يرجى تحديد ما إذا كنت عروساً أو عريساً لبدء البحث والتعارف الجاد.",
                "تکایە دیاری بکە کە ئایا بووکیت یان زاوا بۆ دەستپێکردنی گەڕان."
              )}
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-4">
            
            {/* Card 1: Bride */}
            <button
              type="button"
              onClick={() => { setRole('bride'); }}
              className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center space-y-2 sm:space-y-4 relative overflow-hidden ${
                role === 'bride'
                  ? 'bg-gradient-to-br from-pink-550 to-pink-500 border-accent-pink text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-accent-pink/60 text-warm-charcoal shadow-md hover:shadow-lg'
              }`}
              style={role === 'bride' ? { background: 'linear-gradient(135deg, #EC4899, #DB2777)' } : {}}
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-pink-100 flex items-center justify-center text-2xl sm:text-4xl shadow-inner group-hover:scale-110 transition duration-300">
                👰
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="block text-sm sm:text-xl font-serif font-black tracking-tight">
                  {txt("Bride", "العروس 👰", "بووک 👰")}
                </span>
                <span className={`block text-[9px] sm:text-xs font-bold uppercase tracking-wider ${role === 'bride' ? 'text-pink-100' : 'text-stone-500'}`}>
                  {txt("Seeking a Husband", "تبحث عن زوج", "بۆ هاوسەرگیری")}
                </span>
              </div>
              {role === 'bride' && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-pink-600 p-1 rounded-full shadow-md">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
                </div>
              )}
            </button>

            {/* Card 2: Groom */}
            <button
              type="button"
              onClick={() => { setRole('groom'); }}
              className={`p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] border-2 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center space-y-2 sm:space-y-4 relative overflow-hidden ${
                role === 'groom'
                  ? 'bg-gradient-to-br from-stone-900 to-stone-800 border-stone-900 text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-stone-400 text-warm-charcoal shadow-md hover:shadow-lg'
              }`}
            >
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-sky-100 flex items-center justify-center text-2xl sm:text-4xl shadow-inner group-hover:scale-110 transition duration-300">
                👨
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="block text-sm sm:text-xl font-serif font-black tracking-tight">
                  {txt("Groom", "العريس 👨", "زاوا 👨")}
                </span>
                <span className={`block text-[9px] sm:text-xs font-bold uppercase tracking-wider ${role === 'groom' ? 'text-sky-300' : 'text-stone-500'}`}>
                  {txt("Seeking a Wife", "يبحث عن زوجة", "بۆ هاوسەرگیری")}
                </span>
              </div>
              {role === 'groom' && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-stone-950 p-1 rounded-full shadow-md">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3px]" />
                </div>
              )}
            </button>

          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-accent-coral/20 mx-auto"
            >
              <span>{txt("Next: Essential Info", "التالي: البيانات الأساسية", "داهاتوو: زانیاری سەرەکی")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Essential Information */}
      {step === 2 && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" id="wizard-step-2">
          
          <div className="text-center space-y-1">
            <h4 className="text-2xl font-serif font-black text-warm-charcoal font-display">
              {txt("Essential Information", "بياناتك الأساسية", "زانیارییە سەرەکییەکان")}
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">
              {txt("Only the fields absolutely required to produce the first matches.", "الحقول المطلوبة فقط لبناء أول توافق سريع وتصفح الشركاء.", "تەنها ئەو زانیارییانەی زۆر پێویستن بۆ یەکەم گونجاندن.")}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* First Name */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("First Name", "الاسم الأول", "ناوی یەکەم")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={txt("e.g. Yusuf, Maryam", "مثال: يوسف، مريم", "بۆ نموونە: یوسف، مریەم")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* Age selector */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Date of Birth / Age", "تاريخ الميلاد / العمر", "تەمەن / بەرواری لەدایکبوون")}
              </label>
              <select
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                {Array.from({ length: 58 }, (_, i) => i + 18).map((a) => (
                  <option key={a} value={a}>{a} {txt("Years old", "سنة", "ساڵ")}</option>
                ))}
              </select>
            </div>

            {/* Governorate and District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("Governorate", "المحافظة", "پارێزگا")}
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("District / Town", "القضاء / المنطقة", "قەزا / ناوچە")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={txt("e.g. Karrada, Sarchinar", "مثال: الكرادة، المنصور، سرجنار", "بۆ نموونە: کەرادە، سەرچنار")}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                  />
                </div>
              </div>
            </div>

            {/* Marital Status and Education */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("Marital Status", "الحالة الاجتماعية", "باری خێزانی")}
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                >
                  <option value="Single">{txt("Single", "أعزب / عزباء", "سەڵت")}</option>
                  <option value="Divorced">{txt("Divorced", "مطلق / مطلقة", "جیابووەتەوە")}</option>
                  <option value="Widowed">{txt("Widowed", "أرمل / أرملة", "هاوسەر مردوو")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("Education", "التحصيل الدراسي", "ئاستی خوێندن")}
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                >
                  <option value="High School">{txt("High School", "إعدادية / ثانوية", "ئامادەیی")}</option>
                  <option value="Diploma">{txt("Diploma / Institute", "دبلوم / معهد", "دبلۆم")}</option>
                  <option value="Bachelor Degree">{txt("Bachelor Degree", "بكالوريوس / جامعة", "بەکالۆریۆس")}</option>
                  <option value="Master Degree">{txt("Master Degree", "ماجستير", "ماستەر")}</option>
                  <option value="PhD">{txt("PhD / Doctorate", "دكتوراه", "دکتۆرا")}</option>
                </select>
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Occupation / Profession", "المهنة / العمل", "کار / پیشە")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder={txt("e.g. Software Engineer, Teacher, Business", "مثال: مهندس، معلم، طبيب، عمل حر", "بۆ نموونە: ئەندازیار، مامۆستا")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* PHOTO / EMOJI AVATAR SELECTION */}
            <div className="border-t border-dashed border-stone-200/80 pt-4 space-y-3.5">
              <label className="block text-xs font-black text-[#40798C] uppercase tracking-wider font-mono">
                ✨ {txt("Profile Photo / Avatar (Optional)", "الصورة الشخصية / الصورة الرمزية (اختياري)", "وێنەی پڕۆفایل یان ئاڤاتار (ئارەزوومەندانە)")}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoType('emoji')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'emoji'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg mb-1">🌸</span>
                  <span className="text-[10px] block font-semibold">{txt("Use Emoji", "صورة تعبيرية", "بەکارھێنانی ئیمۆجی")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoType('initials')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'initials'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg font-serif font-black text-stone-700 mb-1">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </span>
                  <span className="text-[10px] block font-semibold">{txt("Use Initials", "استخدم الحروف الأولى", "پیتەکانی سەرەتا")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoType('upload')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'upload'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg mb-1">📸</span>
                  <span className="text-[10px] block font-semibold">{txt("Upload Photo", "رفع صورة", "بارکردنی وێنە")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoType('skip')}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    photoType === 'skip'
                      ? 'bg-accent-coral/10 border-accent-coral text-accent-coral font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <span className="block text-lg mb-1">👤</span>
                  <span className="text-[10px] block font-semibold">{txt("Skip For Now", "تخطي الآن", "تێپەڕاندنی ئێستا")}</span>
                </button>
              </div>

              {/* Emoji Options */}
              {photoType === 'emoji' && (
                <div className="bg-[#FCFAF7] p-3 rounded-2xl border border-stone-200 text-center space-y-2">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    {txt("Choose Your Avatar Icon", "اختر أيقونتك الخاصة", "ئایکۆنی خۆت هەڵبژێرە")}
                  </span>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['👤', '🌸', '🕊️', '💍', '🤍', '🧕', '👨‍💼'].map((emojiItem) => (
                      <button
                        key={emojiItem}
                        type="button"
                        onClick={() => setSelectedEmoji(emojiItem)}
                        className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition cursor-pointer border ${
                          selectedEmoji === emojiItem
                            ? 'bg-accent-coral border-accent-coral text-white scale-110 shadow-md'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {emojiItem}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Upload Simulation */}
              {photoType === 'upload' && (
                <div className="bg-[#FCFAF7] p-4 rounded-2xl border border-dashed border-stone-300/80 text-center space-y-2">
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-2xl mb-1">📤</span>
                    <span className="text-[11px] font-bold text-stone-600">
                      {txt("Select or drag a file to upload", "اضغط لتحديد صورة أو اسحبها هنا", "وێنەکەت لێرە باربکە")}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium leading-relaxed mt-1 block">
                      {txt("✓ Will be BLURRED by default to respect your privacy", "✓ ستكون مموهة تلقائياً للحفاظ على خصوصيتك الوقورة", "✓ بە شێوەیەکی خۆکار لێڵ دەکرێت بۆ پاراستنی تایبەتمەندێتی")}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setUploadedPhotoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-stone-500 font-semibold block mx-auto cursor-pointer"
                  />
                  {uploadedPhotoUrl && (
                    <div className="mt-2 flex flex-col items-center">
                      <span className="text-[9px] font-bold uppercase text-[#40798C] mb-1">Preview (Blurred)</span>
                      <img
                        src={uploadedPhotoUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl filter blur-md border border-[#E3D6C0]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "رجوع", "گەڕانەوە")}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1.5 py-3.5 px-4 rounded-xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/15"
            >
              <span>{txt("Next Step", "الخطوة التالية", "هەنگاوی داهاتوو")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Looking For */}
      {step === 3 && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" id="wizard-step-3">
          
          <div className="text-center space-y-1">
            <h4 className="text-2xl font-serif font-black text-warm-charcoal font-display">
              {txt("What are you looking for?", "ما الذي تبحث عنه؟", "بەدوای چیدا دەگەڕێیت؟")}
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">
              {txt("Define basic partner criteria to narrow down matches.", "حدد الشروط الأساسية للشريك لتصفية التوافق الفوري.", "پێوەرە سەرەکییەکانی هاوبەشەکەت دیاری بکە.")}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Preferred Age Range */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Preferred Partner Age Range", "العمر المفضل للشريك", "تەمەنی دڵخوازی هاوبەش")}
              </label>
              <select
                value={prefAgeRange}
                onChange={(e) => setPrefAgeRange(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                <option value="18-25">{txt("18 - 25 years old", "١٨ إلى ٢٥ سنة", "١٨ بۆ ٢٥ ساڵ")}</option>
                <option value="25-35">{txt("25 - 35 years old", "٢٥ إلى ٣٥ سنة", "٢٥ بۆ ٣٥ ساڵ")}</option>
                <option value="35-45">{txt("35 - 45 years old", "٣٥ إلى ٤٥ سنة", "٣٥ بۆ ٤٥ ساڵ")}</option>
                <option value="45+">{txt("45+ years old", "٤٥ سنة فما فوق", "٤٥ ساڵ بەرەو سەرەوە")}</option>
                <option value="Flexible">{txt("Flexible", "مرن / أي عمر", "گونجاو")}</option>
              </select>
            </div>

            {/* Preferred Governorate */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Preferred Partner Governorate", "محافظة الشريك المفضلة", "پارێزگای دڵخوازی هاوبەش")}
              </label>
              <select
                value={prefGov}
                onChange={(e) => setPrefGov(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                <option value="Any">{txt("Any Governorate / Flexible", "أي محافظة / مرن", "هەر پارێزگایەک")}</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Serious Marriage Only Confirmation Card */}
            <div 
              onClick={() => setIsSeriousOnly(!isSeriousOnly)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                isSeriousOnly 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 shadow-md' 
                  : 'bg-white border-stone-200 text-[#6B635B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSeriousOnly ? 'bg-emerald-500 text-white' : 'bg-stone-100'}`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs sm:text-sm font-extrabold">
                    {txt("Seeking Serious Halal Marriage Only", "الزواج الجاد على كتاب الله وسنته فقط", "تەنها گەڕان بەدوای هاوسەرگیری شەرعی")}
                  </h5>
                  <p className="text-[10px] sm:text-xs opacity-85 font-medium leading-normal mt-0.5">
                    {txt("No casual chat. Complete commitment to safe & ethical courtship.", "ميثاق شرف بعدم المحادثات غير الهادفة والالتزام الأخلاقي الكامل.", "بەڵێننامە بۆ ئەنجامدانی پەیوەندی هۆشیار و شەرعی.")}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <input 
                  type="checkbox" 
                  checked={isSeriousOnly}
                  onChange={() => {}}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "رجوع", "گەڕانەوە")}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1.5 py-3.5 px-4 rounded-xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/15"
            >
              <span>{txt("Next Step", "الخطوة التالية", "هەنگاوی داهاتوو")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 4: Account Credentials (register fallback) */}
      {step === 4 && (
        <form 
          onSubmit={handleRegisterAndSubmit} 
          className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" 
          id="wizard-step-4"
        >
          <div className="text-center space-y-1">
            <h4 className="text-2xl font-serif font-black text-warm-charcoal font-display">
              {txt("Secure your account", "تأمين وحفظ حسابك", "هەژمارەکەت پارێزراو بکە")}
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">
              {txt("Provide your phone or email. No public disclosure, absolute respect.", "أدخل وسيلة اتصال آمنة. الخصوصية مضمونة ١٠٠٪.", "ژمارەی مۆبایل یان ئیمەیڵەکەت بنووسە. تەواو پارێزراوە.")}
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone or email input */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Phone or Email Address", "رقم الهاتف أو البريد الإلكتروني", "ژمارەی مۆبایل یان ناونیشانی ئیمەیڵ")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={txt("e.g. 0770XXXXXXX or email@example.com", "مثال: ٠٧٧٠XXXXXXX أو البريد الإلكتروني", "نموونە: ٠٧٧٠XXXXXXX یان ئیمەیڵ")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Choose a Shield Password", "كلمة المرور الآمنة", "وشەی تێپەڕی نوێ")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation and Submit */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "رجوع", "گەڕانەوە")}</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-coral to-accent-pink text-white font-black text-xs sm:text-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/20"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{txt("Securing...", "جاري الحفظ...", "جێبەجێ دەکرێت...")}</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{txt("Sign Up & Join", "إنشاء الحساب والانضمام", "دروستکردنی هەژمار")}</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* SUCCESS SCREEN: Shows profile ready at 35% completion */}
      {step === 'success' && (
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-white/60 shadow-2xl text-center space-y-8 animate-fade-in" id="wizard-step-success">
          
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg text-5xl animate-bounce">
            🎉
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-serif font-black text-warm-charcoal font-display leading-tight">
              {txt("Your profile is ready!", "ملفك الشخصي جاهز للتعارف!", "پڕۆفایلەکەت ئامادەیە!")}
            </h3>
            
            {/* Progress Completion Display: 35% */}
            <div className="bg-stone-50 border border-stone-200/60 rounded-3xl p-5 max-w-sm mx-auto space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono font-black text-stone-600 uppercase tracking-wider">
                <span>{txt("Profile Completion", "نسبة إكمال الملف الشخصي", "ڕێژەی تەواوبوونی پڕۆفایل")}</span>
                <span className="text-accent-coral text-sm font-black">35%</span>
              </div>
              <div className="w-full bg-stone-200/80 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-accent-coral to-accent-pink h-full rounded-full transition-all duration-1000"
                  style={{ width: '35%' }}
                />
              </div>
              <p className="text-[11px] text-[#8C8075] font-semibold leading-relaxed">
                {txt("Complete optional milestones later inside the app to raise compatibility scores!", "أكمل بقية البيانات لاحقاً داخل التطبيق لزيادة نسبة المطابقة والتوافق!", "زانیاری زیاتر دواتر لە ناو ئەپەکە پڕبکەرەوە بۆ زیادبوونی گونجاندن!")}
              </p>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="button"
            onClick={() => {
              api.getCurrentUser().then(onComplete).catch(() => {
                onComplete({
                  name,
                  age,
                  gender: role === 'bride' ? 'female' : 'male',
                  country: 'Iraq',
                  governorate,
                  city: district,
                  religion: 'islam',
                  ethnicity: 'arab',
                  languages: ['Arabic'],
                  photoPrivacy: role === 'bride' ? 'hidden_by_default' : 'visible',
                  education,
                  profession: occupation,
                  maritalStatus,
                  partnerAgeRange: prefAgeRange,
                  partnerGovernorate: prefGov,
                  badges: ['Serious for marriage'],
                  values: ['Family First', 'Mutual Respect'],
                  timeline: 'Within 1 year',
                  wantsChildren: 'Yes',
                  relocation: 'Yes',
                  communicationPreference: 'Prefers private respectful correspondence'
                });
              });
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#40798C] to-[#2D5866] hover:opacity-95 text-white font-black text-sm sm:text-base transition duration-300 active:scale-95 shadow-xl shadow-[#40798C]/20 flex items-center justify-center gap-2 cursor-pointer"
            id="start-exploring-btn"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>{txt("Start Discovering", "ابدأ الاستكشاف الآن", "دەستپێکردنی گەڕان")}</span>
          </button>

        </div>
      )}

    </div>
  );
}



















