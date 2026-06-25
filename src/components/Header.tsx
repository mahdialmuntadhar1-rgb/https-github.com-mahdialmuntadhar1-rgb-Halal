import React from 'react';
import { HeaderLanguageSelector } from '../i18n';
import { Heart, Languages, LogOut, MessageCircle, ShieldCheck, Sparkles, User, UsersRound, MessageCircleQuestion, SlidersHorizontal } from 'lucide-react';
import { AppTab } from '../types';
import { Language, TRANSLATIONS } from '../lib/translations';
import { LANGUAGE_OPTIONS } from '../i18n/translations';

interface HeaderProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  profileStrength: number;
  userProfileName?: string;
  locale: Language;
  setLocale: (locale: Language) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({
  currentTab,
  setTab,
  profileStrength,
  userProfileName,
  locale,
  setLocale,
  isAdmin,
  onLogout
}: HeaderProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;

  const navItems: Array<{ tab: AppTab; label: string; icon?: React.ReactNode }> = [
    { tab: 'landing', label: t.overview },
    { tab: 'onboarding', label: t.onboarding, icon: <Sparkles className="w-4 h-4" /> },
    { tab: 'explore', label: t.exploreMembers, icon: <UsersRound className="w-4 h-4" /> },
    { tab: 'chat', label: t.chat, icon: <MessageCircle className="w-4 h-4" /> },
    { tab: 'community', label: t.communityQuestions, icon: <MessageCircleQuestion className="w-4 h-4" /> }
  ];

  if (isAdmin) {
    navItems.push({ tab: 'admin', label: t.admin, icon: <SlidersHorizontal className="w-4 h-4" /> });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-warm-ivory/80 backdrop-blur-md border-b border-white/50 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => setTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-coral to-accent-pink flex items-center justify-center shadow-lg shadow-accent-coral/15 shrink-0">
              <Heart className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div className="text-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-bold tracking-tight text-warm-charcoal">{t.brand}</span>
                <span className="text-[10px] bg-accent-coral/10 text-accent-coral font-bold px-2.5 py-0.5 rounded-full border border-accent-coral/20 tracking-wider">
                  {t.marriageOnly}
                </span>
              </div>
              <p className="text-xs text-[#6B635B] hidden sm:block font-medium">{t.seriousMarriageOnly}</p>
            </div>
          </div>

          <nav className="hidden lg:flex gap-1 bg-white/45 p-1 rounded-full border border-white/60 shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => setTab(item.tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  currentTab === item.tab
                    ? 'bg-warm-charcoal text-white shadow-md'
                    : 'text-[#4A443F]/80 hover:text-warm-charcoal hover:bg-white/70'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('profile')}
              className="hidden md:flex items-center gap-2 rounded-xl border border-[#40798C]/15 bg-white/60 px-3 py-2 text-xs font-bold text-warm-charcoal"
            >
              <ShieldCheck className="w-4 h-4 text-[#40798C]" />
              <span>{profileStrength}% {t.completeScore}</span>
            </button>
            <button
              onClick={() => setTab('onboarding')}
              className="p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-accent-coral/20 bg-[#FF7F50]/10 text-accent-coral hover:bg-[#FF7F50]/20 flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{userProfileName ? t.editDetails : t.onboardNow}</span>
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-xs font-bold border border-stone-200 bg-white/60 text-[#6B635B] hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex lg:hidden gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => setTab(item.tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
                  currentTab === item.tab ? 'bg-warm-charcoal text-white' : 'bg-white/50 text-[#4A443F]/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ms-auto bg-white/50 p-1 rounded-xl border border-white/60">
            <Languages className="w-3.5 h-3.5 text-[#40798C] hidden sm:block" />
            {LANGUAGE_OPTIONS.map((language) => (
              <button
                key={language.code}
                onClick={() => setLocale(language.code)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                  locale === language.code ? 'bg-[#40798C] text-white' : 'text-warm-charcoal hover:bg-white'
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </div>
          <div className="px-3 py-2"><HeaderLanguageSelector /></div>
    </header>
  );
}

