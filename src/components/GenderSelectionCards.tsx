import React from 'react';
import { TRANSLATIONS } from '../lib/translations';
import { AppLanguage } from '../types';
import { UserCheck } from 'lucide-react';

interface GenderSelectionCardsProps {
  locale: AppLanguage;
  onSelectGender: (gender: 'male' | 'female') => void;
}

export default function GenderSelectionCards({ locale, onSelectGender }: GenderSelectionCardsProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-6 text-start" id="gender-selection-cards">
      {/* Men Selection Card */}
      <div 
        onClick={() => onSelectGender('male')}
        className="group bg-white/40 backdrop-blur-xl border border-white/50 hover:border-accent-coral hover:bg-white/70 p-8 rounded-[2.5rem] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between space-y-6 shadow-lg shadow-[#40798C]/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#40798C]/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-[#FF7F50]/10 transition-colors duration-300" />
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 bg-gradient-to-br from-[#40798C] to-[#599da0] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#40798C]/20 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl select-none">🧔</span>
          </div>
          <span className="text-[10px] font-bold text-[#6B635B] uppercase tracking-wider bg-white/60 px-3 py-1 rounded-full border border-white/40">
            {txt('Exclusive Intentions', 'سعي جاد', 'هەوڵی جدی')}
          </span>
        </div>
        <div className="space-y-2 relative z-10">
          <h4 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal group-hover:text-accent-coral transition-colors">
            {t.iamMan}
          </h4>
          <p className="text-xs sm:text-sm text-[#6B635B] font-medium leading-relaxed">
            {t.iamManDesc}
          </p>
        </div>
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-[#40798C] group-hover:text-accent-coral transition-colors pt-2">
          <UserCheck className="w-4 h-4" />
          <span>{txt('Start Men Onboarding', 'تأسيس حساب الرجال', 'دەستپێکردنی تۆمارکردنی پیاوان')}</span>
        </div>
      </div>

      {/* Women Selection Card */}
      <div 
        onClick={() => onSelectGender('female')}
        className="group bg-white/40 backdrop-blur-xl border border-white/50 hover:border-accent-coral hover:bg-white/70 p-8 rounded-[2.5rem] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between space-y-6 shadow-lg shadow-[#40798C]/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-coral/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-[#FF7F50]/10 transition-colors duration-300" />
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 bg-gradient-to-br from-accent-coral to-accent-pink rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent-coral/20 group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl select-none">🧕</span>
          </div>
          <span className="text-[10px] font-bold text-accent-coral uppercase tracking-wider bg-[#FF7F50]/5 px-3 py-1 rounded-full border border-[#FF7F50]/15">
            {txt('Dignity Guaranteed', 'مصان بالكامل', 'کەرامەتی پارێزراوە')}
          </span>
        </div>
        <div className="space-y-2 relative z-10">
          <h4 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal group-hover:text-accent-coral transition-colors">
            {t.iamWoman}
          </h4>
          <p className="text-xs sm:text-sm text-[#6B635B] font-medium leading-relaxed">
            {t.iamWomanDesc}
          </p>
        </div>
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-bold text-accent-coral group-hover:text-accent-pink transition-colors pt-2">
          <UserCheck className="w-4 h-4" />
          <span>{txt('Start Women Onboarding', 'تأسيس حساب النساء', 'دەستپێکردنی تۆمارکردنی ئافرەتان')}</span>
        </div>
      </div>
    </div>
  );
}
