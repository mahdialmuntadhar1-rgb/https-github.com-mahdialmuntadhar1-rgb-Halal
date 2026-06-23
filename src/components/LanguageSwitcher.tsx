import React from 'react';
import { Languages } from 'lucide-react';
import { AppLanguage } from '../types';

interface LanguageSwitcherProps {
  locale: AppLanguage;
  setLocale: (lang: AppLanguage) => void;
}

export default function LanguageSwitcher({ locale, setLocale }: LanguageSwitcherProps) {
  return (
    <div className="bg-gradient-to-r from-white/70 via-white/55 to-white/45 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-[1.5rem] shadow-lg shadow-[#40798C]/5 my-3 flex flex-col sm:flex-row justify-between items-center gap-3 transition-all duration-300 w-full">
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
  );
}
