import React from 'react';
import { Heart, ShieldCheck, User, MessageSquareHeart, Sparkles, Languages } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface HeaderProps {
  currentTab: 'landing' | 'onboarding' | 'explore' | 'chat' | 'philosophy';
  setTab: (tab: 'landing' | 'onboarding' | 'explore' | 'chat' | 'philosophy') => void;
  profileStrength: number;
  userProfileName?: string;
  locale: Language;
  setLocale: (locale: Language) => void;
}

export default function Header({ currentTab, setTab, profileStrength, userProfileName, locale, setLocale }: HeaderProps) {
  const t = TRANSLATIONS[locale];

  return (
    <header className="sticky top-0 z-50 w-full bg-warm-ivory/60 backdrop-blur-md border-b border-white/20 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => setTab('landing')}>
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
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                currentTab === 'landing'
                  ? 'bg-warm-charcoal text-white shadow-md'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              {t.overview}
            </button>
            <button
              onClick={() => setTab('onboarding')}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center space-x-1.5 rtl:space-x-reverse ${
                currentTab === 'onboarding'
                  ? 'bg-accent-coral text-white shadow-md'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.onboarding}</span>
            </button>
            <button
              onClick={() => setTab('explore')}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                currentTab === 'explore'
                  ? 'bg-white/60 text-warm-charcoal shadow-sm border border-white/20'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              {t.explore}
            </button>
            <button
              onClick={() => setTab('chat')}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center space-x-1.5 rtl:space-x-reverse ${
                currentTab === 'chat'
                  ? 'bg-white/60 text-warm-charcoal shadow-sm border border-white/20'
                  : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/40'
              }`}
            >
              <MessageSquareHeart className="w-4 h-4 text-accent-coral" />
              <span>{t.chat}</span>
            </button>
          </nav>

          {/* Right Action Menu: Profile Strength bar */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            
            {/* Profile Info block */}
            <div className="hidden lg:flex flex-col items-end text-right rtl:text-left">
              <span className="text-xs font-semibold text-warm-charcoal flex items-center gap-1">
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
                <span className="text-[10px] text-[#6B635B] font-mono font-bold">{profileStrength}% {t.completeScore}</span>
              </div>
            </div>

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

        {/* Elegant Language Sub-Taskbar Sitting Directly Below Main Row */}
        <div className="bg-gradient-to-r from-white/70 via-white/55 to-white/45 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-[1.5rem] shadow-lg shadow-[#40798C]/5 my-3 flex flex-col sm:flex-row justify-between items-center gap-3 transition-all duration-300">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center border border-white/50 shadow-inner">
              <Languages className="w-3.5 h-3.5 text-[#40798C]" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#6B635B] uppercase tracking-wider">
              {locale === 'en' ? 'Select Language:' : locale === 'ar' ? 'اختر اللغة:' : 'زمان دیاری بکە:'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Arabic Link */}
            <button
              onClick={() => setLocale('ar')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                locale === 'ar'
                  ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-md shadow-accent-coral/20 scale-105'
                  : 'bg-white/50 border border-white/30 text-warm-charcoal hover:bg-white/80 hover:scale-102 hover:shadow-sm'
              }`}
            >
              <span className="text-base select-none">🇮🇶</span>
              <span>العربية</span>
            </button>

            {/* Kurdish Link */}
            <button
              onClick={() => setLocale('ckb')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                locale === 'ckb'
                  ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-md shadow-accent-coral/20 scale-105'
                  : 'bg-white/50 border border-white/30 text-warm-charcoal hover:bg-white/80 hover:scale-102 hover:shadow-sm'
              }`}
            >
              <span className="text-base select-none">☀️</span>
              <span>کوردی</span>
            </button>

            {/* English Link */}
            <button
              onClick={() => setLocale('en')}
              className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                locale === 'en'
                  ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-md shadow-accent-coral/20 scale-105'
                  : 'bg-white/50 border border-white/30 text-warm-charcoal hover:bg-white/80 hover:scale-102 hover:shadow-sm'
              }`}
            >
              <span className="text-base select-none">🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden border-t border-white/20 py-2.5 overflow-x-auto scrollbar-none justify-around items-center text-xs space-x-1 rtl:space-x-reverse">
          <button
            onClick={() => setTab('landing')}
            className={`px-3 py-1.5 font-bold rounded-lg ${
              currentTab === 'landing' ? 'bg-warm-charcoal text-white' : 'text-[#4A443F]/80'
            }`}
          >
            {t.overview}
          </button>
          <button
            onClick={() => setTab('onboarding')}
            className={`px-3 py-1.5 font-bold rounded-lg flex items-center space-x-0.5 rtl:space-x-reverse ${
              currentTab === 'onboarding' ? 'bg-accent-coral text-white' : 'text-[#4A443F]/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Onboarding' : t.onboarding}</span>
          </button>
          <button
            onClick={() => setTab('explore')}
            className={`px-3 py-1.5 font-bold rounded-lg ${
              currentTab === 'explore' ? 'bg-warm-charcoal text-white' : 'text-[#4A443F]/80'
            }`}
          >
            {locale === 'en' ? 'Matches' : t.explore}
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`px-3 py-1.5 font-bold rounded-lg ${
              currentTab === 'chat' ? 'bg-warm-charcoal text-white' : 'text-[#4A443F]/80'
            }`}
          >
            {locale === 'en' ? 'Chats' : t.chat}
          </button>
        </div>
      </div>
    </header>
  );
}
