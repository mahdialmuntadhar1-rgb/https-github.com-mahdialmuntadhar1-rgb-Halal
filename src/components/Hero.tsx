import React from 'react';
import { Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface HeroProps {
  locale: Language;
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMatches: () => void;
}

export default function Hero({ locale, onSelectGender, onExploreMatches }: HeroProps) {
  const t = TRANSLATIONS[locale];

  return (
    <section className="relative overflow-hidden py-10 sm:py-16" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Branding Slogan */}
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-xs font-bold tracking-widest uppercase shadow-sm text-accent-coral mb-6">
          <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse"></span>
          <span>{locale === 'en' ? 'Dignified Courtship for Marriage' : locale === 'ar' ? 'خطوبة وقورة للزواج الحلال' : 'خوازبێنی شایستە بۆ هاوسەرگیری'}</span>
        </div>

        {/* Emotionally Connective Header */}
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <h1 className="text-3xl sm:text-6xl font-serif text-warm-charcoal tracking-tight leading-[1.2] sm:leading-[1.1] font-display font-black">
            {locale === 'en' ? 'Private marriage matchmaking for serious people' : locale === 'ar' ? 'زواج حلال وقور لأصحاب النوايا الجادة' : 'کۆبوونەوەی هاوسەرگیری تایبەت بۆ کەسانی جدی'}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#6B635B] pt-2">
            <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
              🚫 {locale === 'en' ? 'No swiping' : locale === 'ar' ? 'بدون تمرير عشوائي' : 'بێ سواپکردن'}
            </span>
            <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
              🛡️ {locale === 'en' ? 'No public exposure' : locale === 'ar' ? 'بدون كشف علني' : 'بێ بڵاوکردنەوەی گشتی'}
            </span>
            <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
              🔏 {locale === 'en' ? 'No family monitoring' : locale === 'ar' ? 'دون رقابة عائلية مُحرجة' : 'بێ چاودێری ناوزڕێنەر'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#40798C] font-mono tracking-wider uppercase mt-4 flex items-center justify-center gap-1.5 bg-[#40798C]/10 w-fit mx-auto px-4.5 py-2 rounded-full border border-[#40798C]/20">
            💬 {locale === 'en' ? 'Only mutual matches can chat.' : locale === 'ar' ? 'المحادثة والدردشة فقط بعد التوافق والقبول الثنائي المتبادل.' : 'تەنها لەگەڵ پەسەندکردنی دوولایەنە دەتوانن دەست بە چات بکەن.'}
          </p>
        </div>

        {/* Two Large Gender Selection Cards (Aligned Side-by-Side on One Row) */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 sm:gap-8 items-stretch mb-10">
          
          {/* Card 1: I am a man */}
          <div 
            onClick={() => onSelectGender('male')}
            className="group cursor-pointer bg-white/40 backdrop-blur-md border hover:border-accent-coral/40 border-white/20 rounded-xl sm:rounded-[2rem] p-3 sm:p-6 text-center space-y-3 sm:space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-coral/5 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
            id="select-gender-male"
          >
            {/* Background texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#40798C]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-[4/3] rounded-lg sm:rounded-2xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600" 
                  alt={t.iamMan} 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 sm:bottom-4 sm:left-4 sm:rtl:left-auto sm:rtl:right-4 text-[7px] sm:text-xs font-mono font-medium text-white/95 tracking-wide uppercase bg-black/35 backdrop-blur-md px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
                  {t.respectPortrayal}
                </span>
              </div>
              <h3 className="text-xs sm:text-2xl font-serif font-black text-warm-charcoal text-center">
                {t.iamMan}
              </h3>
              <p className="text-[9px] sm:text-xs text-[#6B635B] max-w-sm mx-auto leading-relaxed font-medium">
                {t.iamManDesc}
              </p>
            </div>
            
            <div className="pt-2 sm:pt-4">
              <span className="inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse bg-accent-coral text-white text-[8px] sm:text-xs font-bold px-2 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-lg shadow-accent-coral/15 group-hover:opacity-95 transition-all">
                <span>{t.startBtn}</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
              </span>
            </div>
          </div>

          {/* Card 2: I am a woman */}
          <div 
            onClick={() => onSelectGender('female')}
            className="group cursor-pointer bg-white/40 backdrop-blur-md border hover:border-accent-pink/40 border-white/20 rounded-xl sm:rounded-[2rem] p-3 sm:p-6 text-center space-y-3 sm:space-y-5 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-pink/5 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
            id="select-gender-female"
          >
            {/* Background texture */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent-pink/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-[4/3] rounded-lg sm:rounded-2xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600" 
                  alt={t.iamWoman} 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 sm:bottom-4 sm:left-4 sm:rtl:left-auto sm:rtl:right-4 text-[7px] sm:text-xs font-mono font-medium text-white/95 tracking-wide uppercase bg-black/35 backdrop-blur-md px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
                  {t.protectedOptions}
                </span>
              </div>
              <h3 className="text-xs sm:text-2xl font-serif font-black text-warm-charcoal text-center">
                {t.iamWoman}
              </h3>
              <p className="text-[9px] sm:text-xs text-[#6B635B] max-w-sm mx-auto leading-relaxed font-medium">
                {t.iamWomanDesc}
              </p>
            </div>
            
            <div className="pt-2 sm:pt-4">
              <span className="inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse bg-accent-pink text-white text-[8px] sm:text-xs font-bold px-2 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-lg shadow-accent-pink/15 group-hover:opacity-95 transition-all">
                <span>{t.startBtn}</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
              </span>
            </div>
          </div>

        </div>

        {/* Emotionally powerful tagline */}
        <p className="text-xs sm:text-sm font-medium text-warm-charcoal font-serif tracking-wide italic mb-8 max-w-lg mx-auto">
          "{t.tagline}"
        </p>

        {/* Quick entry links */}
        <div className="flex justify-center gap-4 text-xs font-bold">
          <button 
            onClick={onExploreMatches}
            className="text-[#6B635B]/90 hover:text-accent-coral underline transition-all font-sans"
          >
            {t.exploreMatchesBtn}
          </button>
        </div>

      </div>
    </section>
  );
}
