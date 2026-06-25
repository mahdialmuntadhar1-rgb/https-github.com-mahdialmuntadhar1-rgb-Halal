import React, { useState } from 'react';
import { Mail, Lock, User, Shield, Sparkles, CheckCircle, ArrowRight, Phone, Globe2, MapPin } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { apiClient } from '../services/apiClient';

interface AuthScreenProps {
  locale: AppLanguage;
  onAuthSuccess: (token: string, userProfile: any) => void;
  triggerToast: (msg: string) => void;
}

export default function AuthScreen({ locale, onAuthSuccess, triggerToast }: AuthScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const isRtl = t.dir === 'rtl';

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Iraq');
  const [governorate, setGovernorate] = useState('Baghdad');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  const countryOptions = [
    { value: 'Iraq', en: 'Iraq', ar: '??????', ckb: '?????' },
    { value: 'Other', en: 'Other', ar: '???? ????', ckb: '??????? ??' }
  ];

  const governorateOptions = [
    { value: 'Baghdad', en: 'Baghdad', ar: '?????', ckb: '?????' },
    { value: 'Basra', en: 'Basra', ar: '??????', ckb: '?????' },
    { value: 'Nineveh', en: 'Nineveh', ar: '?????', ckb: '???????' },
    { value: 'Erbil', en: 'Erbil', ar: '?????', ckb: '??????' },
    { value: 'Sulaymaniyah', en: 'Sulaymaniyah', ar: '??????????', ckb: '???????' },
    { value: 'Duhok', en: 'Duhok', ar: '????', ckb: '????' },
    { value: 'Halabja', en: 'Halabja', ar: '?????', ckb: '???????' },
    { value: 'Kirkuk', en: 'Kirkuk', ar: '?????', ckb: '???????' },
    { value: 'Najaf', en: 'Najaf', ar: '?????', ckb: '?????' },
    { value: 'Karbala', en: 'Karbala', ar: '??????', ckb: '???????' },
    { value: 'Babil', en: 'Babil', ar: '????', ckb: '????' },
    { value: 'Wasit', en: 'Wasit', ar: '????', ckb: '?????' },
    { value: 'Diyala', en: 'Diyala', ar: '?????', ckb: '?????' },
    { value: 'Anbar', en: 'Anbar', ar: '???????', ckb: '????????' },
    { value: 'Salah al-Din', en: 'Salah al-Din', ar: '???? ?????', ckb: '?????????' },
    { value: 'Maysan', en: 'Maysan', ar: '?????', ckb: '??????' },
    { value: 'Dhi Qar', en: 'Dhi Qar', ar: '?? ???', ckb: '?????' },
    { value: 'Muthanna', en: 'Muthanna', ar: '??????', ckb: '????????' },
    { value: 'Al-Qadisiyah', en: 'Al-Qadisiyah', ar: '????????', ckb: '??????' }
  ];

  const optionText = (option: { en: string; ar: string; ckb: string }) =>
    locale === 'en' ? option.en : locale === 'ckb' ? option.ckb : option.ar;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast(txt('Please fill in all fields.', 'يرجى تعبئة كافة الحقول.', 'تکایە هەموو بڕگەکان پڕبکەرەوە.'));
      return;
    }
    setIsLoading(true);
    try {
      localStorage.setItem('halal_force_real', 'true');
      const result = await apiClient.login(email.trim(), password);
      triggerToast(txt('✨ Logged in successfully.', '✨ تم تسجيل الدخول بنجاح.', '✨ بە سەرکەوتوویی چوویتە ژوورەوە.'));
      
      // Load current user profile immediately after login success
      const profile = await apiClient.getCurrentUser();
      onAuthSuccess(result.token, profile);
    } catch (err: any) {
      localStorage.removeItem('halal_token');
      localStorage.removeItem('halal_force_real');
      triggerToast(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !name || !phone || !country || !governorate) {
      triggerToast(txt('Please fill in all fields.', '???? ????? ???? ??????.', '????? ????? ??????? ?????????.'));
      return;
    }

    if (password.length < 6) {
      triggerToast(txt('Password must be at least 6 characters.', '??? ?? ???? ???? ?????? 6 ???? ??? ?????.', '???? ????? ????? ??????? ? ??? ???.'));
      return;
    }

    setIsLoading(true);

    try {
      localStorage.setItem('halal_force_real', 'true');

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const cleanPhone = phone.trim();

      const result = await apiClient.register(
        cleanEmail,
        password,
        cleanName,
        cleanPhone,
        country,
        governorate,
        gender
      );

      let profile: any = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        country,
        governorate,
        gender,
        age: 0,
        religion: 'islam',
        ethnicity: 'arab',
        education: '',
        profession: '',
        languages: [],
        timeline: '',
        wantsChildren: '',
        relocation: '',
        communicationPreference: '',
        values: [],
        photoPrivacy: gender === 'female' ? 'hidden_by_default' : 'visible',
        savedMatches: []
      };

      try {
        const existingProfile = await apiClient.getCurrentUser();
        profile = {
          ...profile,
          ...existingProfile,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          country,
          governorate,
          gender
        };
      } catch (profileErr) {
        console.warn('Profile read after registration failed; using registration profile fallback.', profileErr);
      }

      try {
        const savedProfile = await apiClient.updateCurrentUserProfile({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          country,
          governorate,
          gender
        } as any);

        profile = {
          ...profile,
          ...savedProfile,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          country,
          governorate,
          gender
        };
      } catch (saveErr) {
        console.warn('Saving basic profile fields after registration failed; backend may already store them.', saveErr);
      }

      triggerToast(txt(
        '? Account created. Please complete your onboarding profile.',
        '? ?? ????? ??????. ???? ????? ????? ????? ??????.',
        '? ?????????? ????????. ????? ????????????? ??????????? ????? ???.'
      ));

      onAuthSuccess(result.token, profile);
    } catch (err: any) {
      localStorage.removeItem('halal_token');
      localStorage.removeItem('halal_force_real');
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
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-coral to-accent-pink flex items-center justify-center shadow-lg shadow-accent-coral/20 mb-4">
            <span className="text-white font-serif font-bold text-2xl">H</span>
          </div>
          
          <h2 className="text-3xl font-serif font-black text-warm-charcoal tracking-tight font-display">
            {mode === 'login' ? t.loginTitle : mode === 'register' ? t.registerTitle : t.forgotPasswordLabel}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B635B] font-medium leading-relaxed max-w-sm mx-auto">
            {mode === 'login' ? t.loginSub : mode === 'register' ? t.registerSub : t.forgotPasswordSub}
          </p>
        </div>

        {mode === 'login' && (
          <form className="mt-8 space-y-5" onSubmit={handleLogin} id="login-form">
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
          </form>
        )}

        {mode === 'register' && (
          <form className="mt-8 space-y-5" onSubmit={handleRegister} id="register-form">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Full Name', '????? ??????', '???? ?????')}
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
                    placeholder={t.enterName}
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
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
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">{t.passwordLabel}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="????????"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                  {txt('Phone Number', '??? ??????', '?????? ??????')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+964 7xx xxx xxxx"
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                    {txt('Country', '??????', '????')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Globe2 className="h-4.5 w-4.5" />
                    </div>
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                    >
                      {countryOptions.map((option) => (
                        <option key={option.value} value={option.value}>{optionText(option)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warm-charcoal uppercase tracking-wider mb-1.5">
                    {txt('Governorate', '????????', '???????')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <select
                      required
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-xl text-warm-charcoal focus:outline-none focus:ring-2 focus:ring-accent-coral/20 focus:border-accent-coral text-sm font-medium transition"
                    >
                      {governorateOptions.map((option) => (
                        <option key={option.value} value={option.value}>{optionText(option)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-stone-500 font-medium">
                {txt(
                  'After registration, you will complete onboarding and choose the remaining marriage profile details.',
                  '??? ??????? ????? ????? ????? ?????? ?????? ???? ?????? ??????.',
                  '???? ?????????? ?????????? ??????? ????? ?????? ? ????????????? ?????????? ????? ??????.'
                )}
              </p>
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
