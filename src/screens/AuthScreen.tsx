import React, { useState } from 'react';
import { Mail, Lock, User, Shield, Sparkles, CheckCircle, ArrowRight, Languages, MapPin, Phone, Calendar } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { apiClient } from '../services/apiClient';

const GOVERNORATE_DETAILS = [
  { id: 'Baghdad', label: 'Baghdad (بغداد / بەغداد)' },
  { id: 'Erbil', label: 'Erbil (أربيل / هەولێر)' },
  { id: 'Sulaymaniyah', label: 'Sulaymaniyah (السليمانية / سلێمانی)' },
  { id: 'Duhok', label: 'Duhok (دهوك / دهۆک)' },
  { id: 'Halabja', label: 'Halabja (حلبجة / هەڵەبجە)' },
  { id: 'Kirkuk', label: 'Kirkuk (كركوك / کەرکوک)' },
  { id: 'Nineveh', label: 'Nineveh (نينوى / نەینەوا)' },
  { id: 'Basra', label: 'Basra (البصرة / بەسرە)' },
  { id: 'Najaf', label: 'Najaf (النجف / نەجەف)' },
  { id: 'Karbala', label: 'Karbala (كربلاء / کەربەلا)' },
  { id: 'Babil', label: 'Babel (بابل / بابل)' },
  { id: 'Anbar', label: 'Anbar (الأنبار / ئەنبار)' },
  { id: 'Diyala', label: 'Diyala (ديالى / دیالە)' },
  { id: 'Salah al-Din', label: 'Salah al-Din (صلاح الدين / سەڵاحەدین)' },
  { id: 'Wasit', label: 'Wasit (واسط / واسیت)' },
  { id: 'Maysan', label: 'Maysan (ميسان / میسان)' },
  { id: 'Dhi Qar', label: 'Dhi Qar (ذي قار / زیقار)' },
  { id: 'Muthanna', label: 'Muthanna (المثنى / موتەنا)' },
  { id: 'Qadisiyah', label: 'Qadisiyah (القادسية / قادسیە)' }
];

interface AuthScreenProps {
  locale: AppLanguage;
  onAuthSuccess: (token: string, userProfile: any) => void;
  triggerToast: (msg: string) => void;
}

export default function AuthScreen({ locale, onAuthSuccess, triggerToast }: AuthScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const isRtl = t.dir === 'rtl';

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration form state
  const [name, setName] = useState(''); // Full Name
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('Baghdad');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(''); // Required now
  const [age, setAge] = useState<number | ''>(''); // Required Age
  const [district, setDistrict] = useState(''); // Required District

  const [isLoading, setIsLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      triggerToast(txt('Please fill in all fields.', 'يرجى تعبئة كافة الحقول.', 'تکایە هەموو بڕگەکان پڕبکەرەوە.'));
      return;
    }
    setIsLoading(true);
    try {
      const result = await apiClient.login(identifier, password);
      triggerToast(txt('✨ Logged in successfully.', '✨ تم تسجيل الدخول بنجاح.', '✨ بە سەرکەوتوویی چوویتە ژوورەوە.'));
      
      // Load current user profile immediately after login success
      const profile = await apiClient.getCurrentUser();
      onAuthSuccess(result.token, profile);
    } catch (err: any) {
      triggerToast(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !name || !governorate || !age) {
      triggerToast(txt('Please fill in all required fields (Name, Governorate, Email, Age, Password).', 'يرجى تعبئة كافة الحقول المطلوبة (الاسم الكامل، المحافظة، البريد الإلكتروني، العمر، كلمة المرور).', 'تکایە هەموو بڕگە داواکراوەکان پڕبکەرەوە (ناو، پارێزگا، ئیمەیڵ، تەمەن، وشەی تێپەڕ).'));
      return;
    }
    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 75) {
      triggerToast(txt('Age must be a valid number between 18 and 75.', 'يجب أن يكون العمر رقماً صالحاً بين ١٨ و ٧٥ عاماً.', 'تەمەن دەبێت ژمارەیەکی دروست بێت لە نێوان ١٨ بۆ ٧٥ ساڵدا.'));
      return;
    }
    if (password !== confirmPassword) {
      triggerToast(txt('Passwords do not match.', 'كلمتا المرور غير متطابقتين.', 'وشە نهێنییەکان وەک یەک نين.'));
      return;
    }
    setIsLoading(true);
    try {
      const result = await apiClient.register(name, governorate, "", email, phone ? phone.trim() : undefined, password, parsedAge);
      triggerToast(txt('✨ Account created successfully.', '✨ تم إنشاء الحساب بنجاح.', '✨ هەژمارەکەت بە سەرکەوتوویی دروستکرا.'));
      
      const profile = await apiClient.getCurrentUser();
      onAuthSuccess(result.token, profile);
    } catch (err: any) {
      triggerToast(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerToast(txt('Please provide your email.', 'يرجى إدخال البريد الإلكتروني.', 'تکایە ئیمەیڵەکەت بنووسە.'));
      return;
    }
    setIsLoading(true);
    try {
      const result = await apiClient.forgotPassword(email);
      setForgotSuccess(true);
      triggerToast(result.message);
    } catch (err: any) {
      triggerToast(err.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch instantly into Demo Sandbox Mode
  const enterDemoMode = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('halal_force_real');
      localStorage.setItem('halal_token', 'demo_token_placeholder');
      const profile = await apiClient.getCurrentUser();
      onAuthSuccess('demo_token_placeholder', profile);
      triggerToast(txt('⭐ Sandbox Demo Mode Enabled.', '⭐ تم تفعيل وضع التجربة المحلي.', '⭐ دۆخی تاقیکردنەوەی لۆکاڵی چالاک کرا.'));
    } catch (err: any) {
      triggerToast(err.message || 'Failed to initialize demo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative z-10 text-start" id="auth-container">
      <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/40 shadow-xl transition-all relative">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-24 h-24 bg-accent-coral/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 w-28 h-28 bg-[#40798C]/20 rounded-full blur-xl pointer-events-none" />

        <div className="text-center">
          <h2 className="text-3xl font-serif font-black text-warm-charcoal tracking-tight font-display">
            {mode === 'login' ? t.loginTitle : mode === 'register' ? t.registerTitle : t.forgotPasswordLabel}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B635B] font-medium leading-relaxed max-w-sm mx-auto">
            {mode === 'login' ? t.loginSub : mode === 'register' ? t.registerSub : t.forgotPasswordSub}
          </p>

          {/* Progress / Step messages */}
          {mode === 'register' && (
            <div className="mt-4 inline-flex flex-col items-center gap-1 bg-[#40798C]/10 border border-[#40798C]/15 px-4 py-2.5 rounded-2xl w-full text-center">
              <span className="text-xs font-black text-[#2F5968] uppercase tracking-wider font-mono">
                {txt('Step 1 of 3: Create account', 'الخطوة الأولى من ٣: إنشاء الحساب', 'هەنگاوی ١ لە ٣: دروستکردنی هەژمار')}
              </span>
              <span className="text-[10px] font-bold text-[#40798C]">
                {txt('Marriage profile comes after login', 'ملف الزواج المبارك يكتمل بعد تسجيل الدخول', 'زانیاری پڕۆفایلی هاوسەرگیری لە دوای چوونە ژوورەوە دەبێت')}
              </span>
            </div>
          )}

          {mode === 'login' && (
            <div className="mt-4 inline-flex flex-col items-center gap-1 bg-stone-100 border border-stone-200 px-4 py-2.5 rounded-2xl w-full text-center">
              <span className="text-xs font-black text-stone-700 uppercase tracking-wider font-mono">
                {txt('Log in to your account', 'تسجيل الدخول إلى حسابك', 'چوونە ناو هەژمارەکەت')}
              </span>
              <span className="text-[10px] font-bold text-stone-500">
                {txt('Complete your respectful marriage profile after login', 'استكمل ملف زواجك الوقور بمجرد تسجيل الدخول', 'پڕۆفایلی هاوسەرگیرییە ڕێزدارەکەت دوای چوونە ژوورەوە تەواو بکە')}
              </span>
            </div>
          )}
        </div>

        {mode === 'login' && (
          <form className="mt-8 space-y-5" onSubmit={handleLogin} id="login-form">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Email or Phone Number', 'البريد الإلكتروني أو رقم الهاتف', 'ئیمەیڵ یان ژمارەی مۆبایل')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={txt('email@example.com or phone number', 'البريد الإلكتروني أو رقم الهاتف', 'ئیمەیڵ یان ژمارەی مۆبایل')}
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider">{t.passwordLabel}</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setForgotSuccess(false); }}
                    className="text-xs text-accent-coral hover:underline font-bold"
                  >
                    {t.forgotPasswordLabel}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-coral to-accent-pink hover:opacity-95 shadow-lg shadow-accent-coral/25 focus:outline-none transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.sessionLoading}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>{t.signInBtn}</span>
                </span>
              )}
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-stone-500 font-medium">{t.noAccount}</span>{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-[#40798C] font-black hover:underline"
              >
                {t.signUpBtn}
              </button>
            </div>

            {/* Premium Trust Notes */}
            <div className="mt-6 pt-5 border-t border-stone-200/50 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-[#524B44] font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{txt('Privacy protected: Shari\'a compliant masking', 'الخصوصية محمية: حجب البيانات المتوافق مع الشريعة', 'پارێزگاری لە تایبەتمەندی: شاردنەوەی شەرعی')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#524B44] font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{txt('No public phone numbers: Guardian contacts only', 'لا توجد أرقام هواتف عامة: تواصل أولياء الأمور فقط', 'ژمارەی مۆبایلی گشتی نییە: تەنها بۆ پەیوەندی سەرپەرشتیارەکان')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#524B44] font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{txt('Serious marriage only: Manual verification', 'للزواج الجاد فقط: فحص وتدقيق يدوي وقور', 'تەنها بۆ هاوسەرگیری جدی: پشتڕاستکردنەوەی دەستی')}</span>
              </div>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form className="mt-8 space-y-5" onSubmit={handleRegister} id="register-form">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Full Name', 'الاسم الكامل', 'ناوی تەواو')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={txt('Enter your full name', 'أدخل اسمك الكامل', 'ناوی تەواوی خۆت بنووسە')}
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Governorate', 'المحافظة', 'پارێزگا')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <select
                    required
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-semibold transition animate-fade-in"
                  >
                    {GOVERNORATE_DETAILS.map((gov) => (
                      <option key={gov.id} value={gov.id}>{gov.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">{t.emailLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Phone Number (Optional)', 'رقم الهاتف (اختياري)', 'ژمارەی مۆبایل (ئارەزوومەندانە)')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +964 770..."
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Age', 'العمر', 'تەمەن')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="number"
                    required
                    min={18}
                    max={75}
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 25"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">{t.passwordLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Confirm Password', 'تأكيد كلمة المرور', 'دوپاتکردنەوەی وشەی تێپەڕ')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#40798C] to-[#2D5866] hover:opacity-95 shadow-lg shadow-[#40798C]/20 focus:outline-none transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.sessionLoading}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{t.signUpBtn}</span>
                </span>
              )}
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-stone-500 font-medium">{t.haveAccount}</span>{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-accent-coral font-black hover:underline"
              >
                {t.signInBtn}
              </button>
            </div>

            {/* Premium Trust Notes */}
            <div className="mt-6 pt-5 border-t border-stone-200/50 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-[#524B44] font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{txt('Privacy protected: Shari\'a compliant masking', 'الخصوصية محمية: حجب البيانات المتوافق مع الشريعة', 'پارێزگاری لە تایبەتمەندی: شاردنەوەی شەرعی')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#524B44] font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{txt('No public phone numbers: Guardian contacts only', 'لا توجد أرقام هواتف عامة: تواصل أولياء الأمور فقط', 'ژمارەی مۆبایلی گشتی نییە: تەنها بۆ پەیوەندی سەرپەرشتیارەکان')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#524B44] font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{txt('Serious marriage only: Manual verification', 'للزواج الجاد فقط: فحص وتدقيق يدوي وقور', 'تەنها بۆ هاوسەرگیری جدی: پشتڕاستکردنەوەی دەستی')}</span>
              </div>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form className="mt-8 space-y-5" onSubmit={handleForgot} id="forgot-form">
            {forgotSuccess ? (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200/50 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">
                  {txt('Simulation Sent!', 'تم الإرسال بنجاح (محاكاة)!', 'ناردرا بە سەرکەوتوویی!')}
                </h4>
                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                  {txt(
                    'Instructions to reset your password have been simulated. In sandbox mode, no real emails are sent.',
                    'تمت محاكاة تعليمات استرداد كلمة المرور الخاصة بك. في بيئة التجربة، لا يتم إرسال رسائل بريد إلكتروني حقيقية.',
                    'ڕێنمایی نوێکردنەوەی وشەی تێپەڕ نێردرا. لە ژینگەی تاقیکاری بە شێوەی دروستکراو کاردەکات.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="mt-3 text-xs font-bold text-[#40798C] hover:underline"
                >
                  {txt('Back to login', 'العودة لتسجيل الدخول', 'گەڕانەوە بۆ چوونە ژوور')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">{t.emailLabel}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-stone-900 hover:bg-stone-850 shadow-md transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>{txt('Request Password Reset', 'طلب استعادة كلمة المرور', 'داواکاری وشەی تێپەڕ')}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </span>
                  )}
                </button>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-stone-500 hover:text-warm-charcoal font-bold underline"
                  >
                    {txt('Back to Sign In', 'العودة لتسجيل الدخول', 'گەڕانەوە بۆ چوونە ژوورەوە')}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Local Demo Fallback Link */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-stone-200/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-warm-ivory px-3 text-[10px] text-stone-500 font-mono tracking-wider">
              {txt('OR', 'أو', 'یاخود')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={enterDemoMode}
          disabled={isLoading}
          className="w-full py-3 px-4 border border-stone-200/80 rounded-xl text-xs sm:text-sm font-extrabold text-stone-700 bg-stone-50/60 hover:bg-stone-100/80 transition flex items-center justify-center space-x-2 border-dashed"
        >
          <span>⭐</span>
          <span>{txt('Proceed to Demo Sandbox Mode', 'الدخول الفوري بوضع التجربة والمحاكاة', 'چوونە ژوورەوەی ڕاستەوخۆ بە دۆخی تاقیکاری')}</span>
        </button>

      </div>
    </div>
  );
}
