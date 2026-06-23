import React from 'react';
import { Heart, ShieldCheck, User, MessageSquareHeart, Sparkles, Languages, Lock, Shield } from 'lucide-react';
import { Language } from '../lib/translations';
import { TRANSLATIONS } from '../lib/translations';
import { HeroImage } from '../types';
import HeroSlideshow from './HeroSlideshow';

interface HeaderProps {
  currentTab: 'landing' | 'onboarding' | 'explore' | 'chat' | 'philosophy' | 'profile' | 'privacy' | 'account' | 'community' | 'admin';
  setTab: (tab: 'landing' | 'onboarding' | 'explore' | 'chat' | 'philosophy' | 'profile' | 'privacy' | 'account' | 'community' | 'admin') => void;
  profileStrength: number;
  userProfileName?: string;
  locale: Language;
  setLocale: (locale: Language) => void;
  isAdmin?: boolean;
  heroImages?: HeroImage[];
}

export default function Header({ 
  currentTab, 
  setTab, 
  profileStrength, 
  userProfileName, 
  locale, 
  setLocale,
  isAdmin = false,
  heroImages = []
}: HeaderProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];

  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-warm-ivory/60 backdrop-blur-md border-b border-white/20 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer animate-fade-in" onClick={() => setTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-coral to-accent-pink flex items-center justify-center shadow-lg shadow-accent-coral/20 shrink-0">
              <span className="text-white font-serif font-bold text-xl">H</span>
            </div>
            <div className="text-start">
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="text-2xl font-serif font-bold tracking-tight text-warm-charcoal">{t.brand}</span>
                <span className="text-[10px] bg-accent-coral/10 text-accent-coral font-bold px-2.5 py-0.5 rounded-full border border-accent-coral/20 tracking-wider">
                  {t.marriageOnly}
                </span>
              </div>
              <p className="text-xs text-[#6B635B] hidden sm:block font-medium">
                {t.slogan}
              </p>
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
              {t.explore}
            </button>
            
            {/* Community tab */}
            <button
              onClick={() => setTab('community')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1 ${
                currentTab === 'community'
                  ? 'bg-[#40798C] text-white shadow-md'
                  : 'text-[#4A443F]/80 hover:text-[#40798C] hover:bg-white/40'
              }`}
            >
              <span>{txt('💬 Forum', '💬 مجتمع الأسرة', '💬 کلتور')}</span>
            </button>

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
            
            {/* Profile Info block */}
            <div className="hidden lg:flex flex-col items-end text-right rtl:text-left">
              <span 
                className="text-xs font-semibold text-warm-charcoal flex items-center gap-1 cursor-pointer hover:text-accent-coral transition-colors"
                onClick={() => setTab('profile')}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#40798C]" />
                {userProfileName ? `${t.welcome}, ${userProfileName}` : t.guestProfile}
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

            {/* Quick settings switches (Dossier, Privacy, Account) */}
            {profileStrength > 0 && (
              <div className="flex items-center gap-1 bg-white/30 p-1 rounded-xl border border-white/40">
                <button
                  onClick={() => setTab('profile')}
                  title="My Dossier"
                  className={`p-2 rounded-lg transition-all ${
                    currentTab === 'profile' 
                      ? 'bg-[#40798C] text-white shadow-sm scale-102' 
                      : 'text-[#6B635B] hover:bg-white/40 hover:text-warm-charcoal'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTab('privacy')}
                  title="Privacy Settings"
                  className={`p-2 rounded-lg transition-all ${
                    currentTab === 'privacy' 
                      ? 'bg-[#FF7F50] text-white shadow-sm scale-102' 
                      : 'text-[#6B635B] hover:bg-white/40 hover:text-warm-charcoal'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTab('account')}
                  title="Account Verification Center"
                  className={`p-2 rounded-lg transition-all ${
                    currentTab === 'account' 
                      ? 'bg-emerald-600 text-white shadow-sm scale-102' 
                      : 'text-[#6B635B] hover:bg-white/40 hover:text-warm-charcoal'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setTab(currentTab === 'onboarding' ? 'explore' : 'onboarding')}
              className="p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border border-accent-coral/20 bg-[#FF7F50]/10 text-accent-coral hover:bg-[#FF7F50]/20 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-[#FF7F50]" />
              <span className="hidden xs:inline">
                {profileStrength > 0 ? t.editDetails : t.onboardNow}
              </span>
            </button>
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

        {/* Beautiful Hero Section Rectangle Banner (Without any overlay text or button) */}
        {currentTab === 'landing' && (
          <div className="w-full mt-1.5 mb-5 animate-fade-in" id="header-hero-banner">
            <HeroSlideshow images={heroImages} />
          </div>
        )}

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
            {txt('Matches', 'البحث', 'گەڕان')}
          </button>
          <button
            onClick={() => setTab('community')}
            className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
              currentTab === 'community' ? 'bg-[#40798C] text-white' : 'text-[#4A443F]/80 bg-[#40798C]/5 border border-[#40798C]/10'
            }`}
          >
            {txt('💬 Forum', '💬 مجتمع الأسرة', '💬 کلتور')}
          </button>
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
          {profileStrength > 0 && (
            <>
              <button
                onClick={() => setTab('profile')}
                className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
                  currentTab === 'profile' ? 'bg-[#40798C] text-white' : 'text-[#4A443F]/80'
                }`}
              >
                {txt('Profile', 'الملف', 'پڕۆفایل')}
              </button>
              <button
                onClick={() => setTab('privacy')}
                className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
                  currentTab === 'privacy' ? 'bg-[#FF7F50] text-[#FF7F50] bg-[#FF7F50]/10' : 'text-[#4A443F]/80'
                }`}
              >
                {txt('Privacy', 'السرية', 'نهێنیپارێزی')}
              </button>
              <button
                onClick={() => setTab('account')}
                className={`px-3 py-1.5 font-bold rounded-lg shrink-0 whitespace-nowrap ${
                  currentTab === 'account' ? 'bg-emerald-600 text-white' : 'text-[#4A443F]/80'
                }`}
              >
                {txt('Verification', 'التوثيق', 'سەلماندن')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
