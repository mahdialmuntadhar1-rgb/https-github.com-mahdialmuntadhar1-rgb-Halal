import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, User, MessageSquareHeart, Sparkles, Languages, Lock, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { Language } from '../lib/translations';
import { TRANSLATIONS } from '../lib/translations';
import { HeroImage, AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  profileStrength: number;
  userProfileName?: string;
  isAuthenticated?: boolean;
  locale: Language;
  setLocale: (locale: Language) => void;
  isAdmin?: boolean;
  heroImages?: HeroImage[];
  onLogout?: () => void;
  onRequestAuth?: (mode: 'login' | 'register') => void;
}

export default function Header({ 
  currentTab, 
  setTab, 
  profileStrength, 
  userProfileName, 
  isAuthenticated = false,
  locale, 
  setLocale,
  isAdmin = false,
  heroImages = [],
  onLogout,
  onRequestAuth
}: HeaderProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [currentTab, isAuthenticated]);

  const goAccount = (tab: AppTab) => {
    setAccountMenuOpen(false);
    setTab(tab);
  };

  const handleLogoutClick = () => {
    setAccountMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="relative md:sticky top-0 z-50 w-full bg-warm-ivory/60 backdrop-blur-md border-b border-white/20 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Slogan */}
          <div className="flex items-center cursor-pointer animate-fade-in" onClick={() => setTab('landing')}>
            <div className="text-start">
              <div className="flex flex-row items-baseline space-x-2 sm:space-x-3 rtl:space-x-reverse">
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-warm-charcoal whitespace-nowrap">{t.brand}</span>
                <p className="text-[10px] sm:text-xs text-[#6B635B] font-medium hidden xs:block whitespace-nowrap">
                  <span className="text-[#40798C] mx-1 sm:mx-2">•</span> {t.slogan}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 rtl:space-x-reverse bg-white/30 backdrop-blur-sm p-1 rounded-full border border-white/30 shadow-inner">
            <button
              onClick={() => setTab('landing')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                currentTab === 'landing'
                  ? 'bg-warm-charcoal text-white shadow-md'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              {t.overview}
            </button>
            <button
              onClick={() => setTab('onboarding')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center space-x-1.5 rtl:space-x-reverse ${
                currentTab === 'onboarding'
                  ? 'bg-accent-coral text-white shadow-md'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{t.onboarding}</span>
            </button>
            <button
              onClick={() => setTab('explore')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                currentTab === 'explore'
                  ? 'bg-white/60 text-warm-charcoal shadow-sm border border-white/20'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              {txt('Members', 'الأعضاء', 'ئەندامان')}
            </button>
            
            {/* Marriage Café / Community tab hidden (CONTRACT-01): client /community/* has no Worker routes. */}

            <button
              onClick={() => setTab('chat')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center space-x-1.5 rtl:space-x-reverse ${
                currentTab === 'chat'
                  ? 'bg-white/60 text-warm-charcoal shadow-sm border border-white/20'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              <MessageSquareHeart className="w-4 h-4 text-accent-coral" />
              <span>{t.chat}</span>
            </button>

            {/* Postbox Tab */}
            <button
              onClick={() => setTab('postcards')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center space-x-1.5 rtl:space-x-reverse ${
                currentTab === 'postcards'
                  ? 'bg-[#40798C] text-white shadow-md'
                  : 'text-[#4A443F]/80 hover:text-[#40798C] hover:bg-white/40'
              }`}
            >
              <span>✉️ {txt('Postbox', 'صندوق البريد', 'سندوقی پۆستە')}</span>
            </button>

            {/* Admin control panel tab */}
            {isAdmin && (
              <button
                onClick={() => setTab('admin')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1 border border-stone-200 ${
                  currentTab === 'admin'
                    ? 'bg-stone-800 text-white shadow-md font-bold scale-102'
                    : 'bg-white/60 text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>🛡️ {txt('Admin Panel', 'لوحة التحكم', 'بەشی بەڕێوەبەر')}</span>
              </button>
            )}
          </nav>

          {/* Right Action Menu: Profile Strength bar & Shortcuts */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            
            {isAuthenticated ? (
              <>
                <div className="hidden lg:flex flex-col items-end text-right rtl:text-left">
                  <span 
                    className="text-xs font-semibold text-warm-charcoal flex items-center gap-1 cursor-pointer hover:text-accent-coral transition-colors"
                    onClick={() => setTab('profile')}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#40798C]" />
                    {userProfileName
                      ? `${t.welcome}, ${userProfileName}`
                      : txt('Welcome', 'أهلاً بك', 'بەخێربێیت')}
                  </span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                    <div className="w-20 bg-white/40 border border-white/20 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#40798C] to-[#599da0] h-full transition-all duration-500"
                        style={{ width: `${profileStrength}%` }}
                      />
                    </div>
                    <span 
                      className="text-[10px] text-[#6B635B] font-mono font-bold cursor-pointer hover:text-[#40798C] transition-colors"
                      onClick={() => setTab('profile')}
                    >
                      {profileStrength}% {t.completeScore}
                    </span>
                  </div>
                </div>

                {/* Account / Profile menu */}
                <div className="relative" ref={accountMenuRef}>
                  <button
                    type="button"
                    id="header-account-menu-btn"
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                    onClick={() => setAccountMenuOpen((open) => !open)}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 border border-[#40798C]/25 bg-white/70 text-warm-charcoal hover:bg-white shadow-sm flex items-center gap-1.5"
                  >
                    <UserCircle className="w-4 h-4 text-[#40798C]" />
                    <span>{txt('Account', 'الحساب', 'هەژمار')}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountMenuOpen && (
                    <div
                      role="menu"
                      id="header-account-menu"
                      className="absolute end-0 mt-2 w-52 rounded-2xl border border-stone-200/80 bg-white shadow-xl shadow-stone-900/10 py-1.5 z-60 overflow-hidden"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => goAccount('profile')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-warm-charcoal hover:bg-[#40798C]/8 text-start"
                      >
                        <User className="w-3.5 h-3.5 text-[#40798C]" />
                        {txt('My Profile', 'ملفي الشخصي', 'پڕۆفایلی من')}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => goAccount('onboarding')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-warm-charcoal hover:bg-[#40798C]/8 text-start"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-accent-coral" />
                        {txt('Edit Profile', 'تعديل الملف', 'دەستکاری پڕۆفایل')}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => goAccount('account')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-warm-charcoal hover:bg-[#40798C]/8 text-start"
                      >
                        <Settings className="w-3.5 h-3.5 text-emerald-600" />
                        {txt('Settings', 'الإعدادات', 'ڕێکخستنەکان')}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => goAccount('privacy')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-warm-charcoal hover:bg-[#40798C]/8 text-start"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#9333EA]" />
                        {txt('Privacy', 'الخصوصية', 'نهێنیپارێزی')}
                      </button>
                      <div className="my-1 border-t border-stone-100" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 text-start"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {txt('Logout', 'تسجيل الخروج', 'چوونە دەرەوە')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2" id="header-auth-actions">
                <button
                  type="button"
                  id="header-sign-in-btn"
                  onClick={() => onRequestAuth?.('login')}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-warm-charcoal bg-white/80 border border-stone-200/80 hover:border-[#40798C]/30 hover:bg-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#40798C]" />
                  <span>{txt('Sign In', 'تسجيل الدخول', 'چوونە ژوورەوە')}</span>
                </button>
                <button
                  type="button"
                  id="header-register-btn"
                  onClick={() => onRequestAuth?.('register')}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-accent-coral to-accent-pink hover:opacity-95 shadow-md shadow-accent-coral/10 transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{txt('Register', 'إنشاء حساب', 'دروستکردنی هەژمار')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Beautiful Elegant Language Sub-Taskbar sitting directly below Main Row */}
        <div className="bg-gradient-to-r from-white/90 via-white/80 to-white/70 backdrop-blur-2xl border border-[#40798C]/15 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-lg shadow-[#40798C]/5 my-2.5 sm:my-3.5 flex flex-row justify-between items-center gap-2.5 transition-all duration-300">
          <div className="hidden xs:flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-7 h-7 rounded-xl bg-[#40798C]/10 flex items-center justify-center border border-[#40798C]/20 shadow-inner">
              <Languages className="w-3.5 h-3.5 text-[#40798C]" />
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-[9px] font-mono font-bold text-[#6B635B] uppercase tracking-wider leading-tight">
                Language / زمان / اللغة
              </span>
              <span className="text-[11px] font-black text-warm-charcoal">
                {locale === 'en' ? 'Gateway Interface' : locale === 'ar' ? 'واجهة المنصة' : 'ڕووکاری سەرەکی'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5 sm:space-x-3 rtl:space-x-reverse w-full xs:w-auto justify-around xs:justify-end">
            {/* Arabic Link */}
            <button
              onClick={() => setLocale('ar')}
              className={`flex flex-col items-center justify-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[9px] sm:text-[11px] font-black transition-all duration-300 min-w-[65px] sm:min-w-[80px] cursor-pointer ${
                locale === 'ar'
                  ? 'bg-gradient-to-br from-[#40798C] to-[#316070] text-white shadow-md shadow-[#40798C]/15 border border-[#40798C]/40 scale-102'
                  : 'bg-white/80 border border-stone-200/50 text-warm-charcoal hover:bg-white hover:border-[#40798C]/20 hover:scale-101 hover:shadow-xs'
              }`}
            >
              <span className="text-lg sm:text-xl select-none mb-0.5 filter drop-shadow">🇮🇶</span>
              <span className="tracking-wide">العربية</span>
            </button>

            {/* Kurdish Link */}
            <button
              onClick={() => setLocale('ckb')}
              className={`flex flex-col items-center justify-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[9px] sm:text-[11px] font-black transition-all duration-300 min-w-[65px] sm:min-w-[80px] cursor-pointer ${
                locale === 'ckb'
                  ? 'bg-gradient-to-br from-[#40798C] to-[#316070] text-white shadow-md shadow-[#40798C]/15 border border-[#40798C]/40 scale-102'
                  : 'bg-white/80 border border-stone-200/50 text-warm-charcoal hover:bg-white hover:border-[#40798C]/20 hover:scale-101 hover:shadow-xs'
              }`}
            >
              <span className="text-lg sm:text-xl select-none mb-0.5 filter drop-shadow">☀️</span>
              <span className="tracking-wide">کوردی</span>
            </button>

            {/* English Link */}
            <button
              onClick={() => setLocale('en')}
              className={`flex flex-col items-center justify-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[9px] sm:text-[11px] font-black transition-all duration-300 min-w-[65px] sm:min-w-[80px] cursor-pointer ${
                locale === 'en'
                  ? 'bg-gradient-to-br from-[#40798C] to-[#316070] text-white shadow-md shadow-[#40798C]/15 border border-[#40798C]/40 scale-102'
                  : 'bg-white/80 border border-stone-200/50 text-warm-charcoal hover:bg-white hover:border-[#40798C]/20 hover:scale-101 hover:shadow-xs'
              }`}
            >
              <span className="text-lg sm:text-xl select-none mb-0.5 filter drop-shadow">🇬🇧</span>
              <span className="tracking-wide">English</span>
            </button>
          </div>
        </div>



        {/* Mobile Navigation Row */}
        <div className="flex md:hidden border-t border-white/20 py-2.5 overflow-x-auto scrollbar-none justify-start sm:justify-around items-center text-xs space-x-1 rtl:space-x-reverse px-2 gap-1">
          <button
            onClick={() => setTab('landing')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
              currentTab === 'landing' ? 'bg-warm-charcoal text-white' : 'text-[#4A443F]/80'
            }`}
          >
            {t.overview}
          </button>
          <button
            onClick={() => setTab('onboarding')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap flex items-center space-x-0.5 rtl:space-x-reverse ${
              currentTab === 'onboarding' ? 'bg-accent-coral text-white' : 'text-[#4A443F]/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="shrink-0">{txt('Onboarding', 'التسجيل', 'تۆمارکردن')}</span>
          </button>
          <button
            onClick={() => setTab('explore')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
              currentTab === 'explore' ? 'bg-warm-charcoal text-white' : 'text-[#4A443F]/80'
            }`}
          >
            {txt('Members', 'الأعضاء', 'ئەندامان')}
          </button>
          {/* Marriage Café / Community tab hidden (CONTRACT-01): no Worker /community routes. */}
          <button
            onClick={() => setTab('chat')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
              currentTab === 'chat' ? 'bg-warm-charcoal text-white' : 'text-[#4A443F]/80'
            }`}
          >
            {txt('Chats', 'الدردشات', 'گفتوگۆکان')}
          </button>
          {isAdmin && (
            <button
              onClick={() => setTab('admin')}
              className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap border ${
                currentTab === 'admin' ? 'bg-stone-850 text-white' : 'text-stone-700 bg-stone-100'
              }`}
            >
              🛡️ {txt('Admin', 'التحكم', 'بەڕێوەبەر')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
