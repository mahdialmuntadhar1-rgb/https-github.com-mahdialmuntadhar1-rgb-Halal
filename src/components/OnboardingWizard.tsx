import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { apiClient } from '../services/apiClient';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User, 
  Lock, 
  MapPin, 
  Phone, 
  Mail, 
  Heart,
  CheckCircle,
  Eye,
  EyeOff
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
  const isAr = locale === 'ar';
  const isCkb = locale === 'ckb';

  const [step, setStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Basic Info state
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 24);
  const [governorate, setGovernorate] = useState(initialProfile?.governorate || 'Baghdad');
  const [city, setCity] = useState(initialProfile?.city || '');

  // Account state
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Translation helpers
  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const validateStep2 = () => {
    const errs: string[] = [];
    if (!name.trim()) {
      errs.push(txt("Please provide your name or respectful nickname.", "يُرجى إدخال اسمك أو اسم مستعار وقور.", "تکایە ناو یان ناسناوەکەت بنووسە."));
    }
    if (age < 18 || age > 75) {
      errs.push(txt("Age must be between 18 and 75.", "يجب أن يكون العمر بين ١٨ و ٧٥ عاماً.", "تەمەن دەبێت لە نێوان ١٨ بۆ ٧٥ ساڵ بێت."));
    }
    if (!governorate) {
      errs.push(txt("Please select a governorate.", "يُرجى تحديد المحافظة التي تقيم بها.", "تکایە پارێزگاکەت دیاری بکە."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const validateStep3 = () => {
    const errs: string[] = [];
    if (!contact.trim()) {
      errs.push(txt("Please provide a phone number or email address.", "يُرجى إدخال رقم الهاتف أو البريد الإلكتروني.", "تکایە ژمارەی مۆبایل یان ئیمەیڵەکەت بنووسە."));
    }
    if (password.length < 6) {
      errs.push(txt("Password must be at least 6 characters.", "يجب أن تكون كلمة المرور ٦ أحرف على الأقل.", "وشەی تێپەڕ دەبێت لانی کەم ٦ پیت بێت."));
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleRegisterAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setErrors([]);

    // Determine if it is email or phone
    const emailToUse = contact.includes('@') ? contact : `${contact.replace(/\s+/g, '')}@halal.me`;

    try {
      // 1. Call Register
      const authResponse = await apiClient.register(emailToUse, password, name, gender);
      
      // 2. Build final Profile structure
      const finalProfile: UserProfile = {
        ...initialProfile,
        name,
        age,
        gender,
        governorate,
        city,
        country: 'Iraq',
        religion: 'islam',
        ethnicity: 'arab',
        languages: ['Arabic'],
        photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible',
        education: 'Bachelor Degree',
        profession: 'Not Specified Yet',
        badges: ['Serious for marriage'],
        values: ['Family First', 'Mutual Respect'],
        timeline: 'Within 1 year',
        wantsChildren: 'Yes',
        relocation: 'Yes',
        communicationPreference: 'Prefers private respectful correspondence'
      };

      // 3. Update profile with basic details
      const savedProfile = await apiClient.updateCurrentUserProfile(finalProfile);

      // 4. Save token to localStorage to complete authenticate
      if (authResponse.token) {
        localStorage.setItem('halal_token', authResponse.token);
      }

      // 5. Success State!
      setStep('success');
    } catch (err: any) {
      setErrors([err.message || txt("Registration failed. Please try again.", "فشل التسجيل. يرجى المحاولة مرة أخرى.", "تۆمارکردن سەرکەوتوو نەبوو. دووبارە تاقیکەرەوە.")]);
    } finally {
      setIsLoading(false);
    }
  };

  // UI calculations
  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : step === 3 ? 100 : 100;

  return (
    <div className="max-w-xl mx-auto px-4" id="onboarding-wizard">
      
      {/* Progress indicators */}
      {step !== 'success' && (
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-black text-[#6B635B] uppercase tracking-wider">
            <span>{txt(`Step ${step} of 3`, `الخطوة ${step} من ٣`, `هەنگاوی ${step} لە ٣`)}</span>
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

      {/* STEP 1: Gender Selection with Two Beautiful Cards */}
      {step === 1 && (
        <div className="space-y-6 text-center animate-fade-in" id="wizard-step-1">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal font-display">
              {txt("Find a serious path to marriage", "ابدأ طريقاً جاداً نحو الزواج", "ڕێگایەکی جددی بۆ هاوسەرگیری دەست پێ بکە")}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm font-medium">
              {txt(
                "Your path to a blessed relationship built on commitment, trust, and absolute respect.",
                "طريقك إلى علاقة مباركة تبنى على المودة والالتزام والمصداقية والخصوصية.",
                "ڕێگاکەت بەرەو پەیوەندییەکی پیرۆز کە لەسەر بنەمای پابەندبوون، متمانە و ڕێز بونیاد دەنرێت."
              )}
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            
            {/* Card 1: I am a Man */}
            <button
              type="button"
              onClick={() => { setGender('male'); handleNext(); }}
              className={`p-6 sm:p-8 rounded-[2rem] border-2 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center space-y-4 relative overflow-hidden ${
                gender === 'male'
                  ? 'bg-gradient-to-br from-stone-900 to-stone-800 border-stone-900 text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-stone-200/80 hover:border-stone-400 text-warm-charcoal shadow-md hover:shadow-lg'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition duration-300">
                🤵
              </div>
              <div className="space-y-1">
                <span className="block text-lg font-serif font-black tracking-tight">
                  {txt("I am a Man", "أنا رجل", "من پیاوم")}
                </span>
                <span className={`block text-[11px] font-bold uppercase tracking-wider ${gender === 'male' ? 'text-sky-300' : 'text-stone-500'}`}>
                  {txt("Seeking a Wife", "أبحث عن زوجة صالحة", "بەدوای هاوسەردا دەگەڕێم")}
                </span>
              </div>
              {gender === 'male' && (
                <div className="absolute top-3 right-3 bg-white text-stone-950 p-1 rounded-full shadow-md animate-pulse">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Card 2: I am a Woman */}
            <button
              type="button"
              onClick={() => { setGender('female'); handleNext(); }}
              className={`p-6 sm:p-8 rounded-[2rem] border-2 text-center transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center space-y-4 relative overflow-hidden ${
                gender === 'female'
                  ? 'bg-gradient-to-br from-[#FF7F50] to-[#E25822] border-[#FF7F50] text-white shadow-2xl scale-[1.02]'
                  : 'bg-white border-stone-200/80 hover:border-[#FF7F50]/60 text-warm-charcoal shadow-md hover:shadow-lg'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition duration-300">
                🧕
              </div>
              <div className="space-y-1">
                <span className="block text-lg font-serif font-black tracking-tight">
                  {txt("I am a Woman", "أنا امرأة", "من ئافرەتم")}
                </span>
                <span className={`block text-[11px] font-bold uppercase tracking-wider ${gender === 'female' ? 'text-pink-200' : 'text-stone-500'}`}>
                  {txt("Seeking a Husband", "أبحث عن زوج صالح", "بەدوای هاوسەردا دەگەڕێم")}
                </span>
              </div>
              {gender === 'female' && (
                <div className="absolute top-3 right-3 bg-white text-[#E25822] p-1 rounded-full shadow-md animate-pulse">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>

          </div>
        </div>
      )}

      {/* STEP 2: Basic Info Form */}
      {step === 2 && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in animate-slide-up" id="wizard-step-2">
          
          <div className="text-center space-y-1">
            <h4 className="text-xl font-serif font-black text-warm-charcoal font-display">
              {txt("Tell us about yourself", "أخبرنا ببياناتك الأساسية", "دەربارەی خۆت پێمان بڵێ")}
            </h4>
            <p className="text-stone-500 text-xs font-semibold">
              {txt("Help serious members find you easily in Iraq.", "هذه البيانات هي مفتاح التعارف الوقور الأول.", "ئەم زانیارییانە یارمەتی ئەندامانی تر دەدات لە دۆزینەوەت.")}
            </p>
          </div>

          <div className="space-y-4">
            {/* Nickname */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Sincere Name / Nickname", "الاسم الكريم / اللقب وقور", "ناوی ڕاستەقینە یان ناسناو")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={txt("e.g. Yusuf, Maryam, Abu Ali", "مثال: يوسف، مريم، أبو علي", "بۆ نموونە: یوسف، مریەم")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                {txt("Your Blessings Age", "العمر المبارك", "تەمەن")}
              </label>
              <select
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 24)}
                className="block w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
              >
                {Array.from({ length: 43 }, (_, i) => i + 18).map((a) => (
                  <option key={a} value={a}>{a} {txt("Years old", "سنة", "ساڵ")}</option>
                ))}
              </select>
            </div>

            {/* Governorate */}
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

              {/* City / Area */}
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                  {txt("City / Neighborhood", "المدينة / الحي أو المنطقة", "شار یان گەڕەک")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={txt("e.g. Karrada, Sarchinar", "مثال: الكرادة، المنصور، سرجنار", "بۆ نموونە: کەرادە، سەرچنار")}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-accent-coral focus:border-accent-coral text-sm font-semibold transition"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200/80">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "رجوع", "گەڕانەوە")}</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1.5 py-3 px-4 rounded-xl bg-accent-coral text-white hover:bg-[#ff8f66] font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/10"
            >
              <span>{txt("Next Step", "الخطوة التالية", "هەنگاوی داهاتوو")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Account Credentials */}
      {step === 3 && (
        <form 
          onSubmit={handleRegisterAndSubmit} 
          className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/60 shadow-xl space-y-6 text-left animate-fade-in" 
          id="wizard-step-3"
        >
          <div className="text-center space-y-1">
            <h4 className="text-xl font-serif font-black text-warm-charcoal font-display">
              {txt("Secure your account", "تأمين وحفظ حسابك", "هەژمارەکەت پارێزراو بکە")}
            </h4>
            <p className="text-stone-500 text-xs font-semibold">
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
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
          <div className="flex gap-3 pt-4 border-t border-dashed border-stone-200/80">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-xs sm:text-sm text-stone-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{txt("Back", "رجوع", "گەڕانەوە")}</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1.5 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-coral to-accent-pink text-white font-black text-xs sm:text-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-accent-coral/20"
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

      {/* STEP SUCCESS: Beautiful Celebration & Complete later notice */}
      {step === 'success' && (
        <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 border border-white/60 shadow-2xl text-center space-y-8 animate-fade-in" id="wizard-step-success">
          
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg text-4xl animate-bounce">
            🎉
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal font-display">
              {txt("Welcome to Zawaj!", "أهلاً بك في حلال زواج!", "بەخێربێیت بۆ حەڵاڵ زەواج!")}
            </h3>
            <p className="text-[#FF7F50] text-sm font-extrabold tracking-wide uppercase font-mono">
              {txt("“You can complete your profile later.”", "«يمكنك إكمال ملفك الشخصي بالكامل لاحقاً»", "«دەتوانیت پڕۆفایلەکەت دواتر تەواو بکەیت»")}
            </p>
            <p className="text-[#6B635B] text-xs sm:text-sm font-semibold max-w-sm mx-auto leading-relaxed">
              {txt(
                "Your account is safely created! We have matched you directly with verified compatibility pools. All deep religious, job, and family preference questions can be answered easily in your profile settings later.",
                "تم إنشاء حسابك المبارك بنجاح! تم ربط بياناتك الأساسية بقاعدة بيانات الشركاء الموثقين. يمكنك إجابة أسئلة العقيدة والعمل ومواصفات الشريك لاحقاً عبر تعديل ملفك التعريفي.",
                "هەژمارەکەت بە سەرکەوتوویی دروستکرا! زانیارییەکانت بەستراوەتەوە بە لیستی هاوبەشە گونجاوەکان. دەتوانیت سەرجەم پرسیارەکانی تر دواتر لە بەشی ڕێکخستنی پڕۆفایل پڕبکەیتەوە."
              )}
            </p>
          </div>

          {/* Core Action */}
          <button
            type="button"
            onClick={() => {
              // Retrieve updated profile, pass to complete handler
              apiClient.getCurrentUser().then(onComplete).catch(() => {
                onComplete({
                  name,
                  age,
                  gender,
                  governorate,
                  city,
                  country: 'Iraq',
                  religion: 'islam',
                  ethnicity: 'arab',
                  languages: ['Arabic'],
                  photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible',
                  education: 'Bachelor Degree',
                  profession: 'Not Specified Yet',
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
            <span>{txt("Start Exploring Matches 💖", "بدء تصفح الشركاء المتوافقين 💖", "دەستپێکردنی گەڕان بۆ هاوبەش 💖")}</span>
          </button>

        </div>
      )}

    </div>
  );
}
