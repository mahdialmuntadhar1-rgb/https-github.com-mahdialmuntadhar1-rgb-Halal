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
    <section className="relative overflow-hidden py-4 sm:py-10" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Short & Single-Line Header */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-10 text-center">
          <h1 className="text-[15px] min-[360px]:text-[17px] xs:text-[22px] sm:text-[40px] md:text-[50px] font-serif text-warm-charcoal tracking-tight font-display font-black whitespace-nowrap overflow-hidden text-ellipsis selection:bg-[#40798C]/15">
            {locale === 'en' ? 'Halal Matchmaking for Serious Intentions' : locale === 'ar' ? 'زواج حلال لأصحاب النوايا الجادة' : 'هاوسەرگیری حەڵاڵ بۆ کەسانی جدی'}
          </h1>
        </div>

        {/* Two Large Gender Selection Cards (Aligned Side-by-Side on One Row - Raised Up) */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3.5 sm:gap-8 items-stretch mb-8">
          
          {/* Card 1: I am a man */}
          <div 
            onClick={() => onSelectGender('male')}
            className="group cursor-pointer bg-white/40 backdrop-blur-md border border-white/20 hover:border-accent-coral/40 rounded-2xl sm:rounded-[2rem] p-2 sm:p-5 text-center space-y-2 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-coral/5 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            id="select-gender-male"
          >
            {/* Background texture */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#40798C]/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-2 sm:space-y-3">
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" 
                  alt={t.iamMan} 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-1 right-1 rtl:right-auto rtl:left-1 sm:bottom-3 sm:left-3 sm:rtl:left-auto sm:rtl:right-3 text-[6.5px] sm:text-[10px] font-mono font-medium text-white/95 bg-black/45 backdrop-blur-md px-1 py-0.5 sm:px-2.5 sm:py-1 rounded-md whitespace-nowrap">
                  {t.respectPortrayal}
                </span>
              </div>
              <h3 className="text-xs sm:text-xl font-serif font-black text-warm-charcoal text-center leading-tight">
                {t.iamMan}
              </h3>
              <p className="hidden xs:block text-[9px] sm:text-xs text-[#6B635B] max-w-sm mx-auto leading-relaxed font-semibold">
                {t.iamManDesc}
              </p>
            </div>
            
            <div className="pt-1 sm:pt-3">
              <span className="inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse bg-accent-coral text-white text-[7.5px] sm:text-xs font-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md shadow-accent-coral/15 group-hover:bg-[#316070] transition-all">
                <span>{t.startBtn}</span>
                <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
              </span>
            </div>
          </div>

          {/* Card 2: I am a woman */}
          <div 
            onClick={() => onSelectGender('female')}
            className="group cursor-pointer bg-white/40 backdrop-blur-md border border-white/20 hover:border-accent-pink/40 rounded-2xl sm:rounded-[2rem] p-2 sm:p-5 text-center space-y-2 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-pink/5 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            id="select-gender-female"
          >
            {/* Background texture */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-accent-pink/5 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-2 sm:space-y-3">
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" 
                  alt={t.iamWoman} 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-1 right-1 rtl:right-auto rtl:left-1 sm:bottom-3 sm:left-3 sm:rtl:left-auto sm:rtl:right-3 text-[6.5px] sm:text-[10px] font-mono font-medium text-white/95 bg-black/45 backdrop-blur-md px-1 py-0.5 sm:px-2.5 sm:py-1 rounded-md whitespace-nowrap">
                  {t.protectedOptions}
                </span>
              </div>
              <h3 className="text-xs sm:text-xl font-serif font-black text-warm-charcoal text-center leading-tight">
                {t.iamWoman}
              </h3>
              <p className="hidden xs:block text-[9px] sm:text-xs text-[#6B635B] max-w-sm mx-auto leading-relaxed font-semibold">
                {t.iamWomanDesc}
              </p>
            </div>
            
            <div className="pt-1 sm:pt-3">
              <span className="inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse bg-accent-pink text-white text-[7.5px] sm:text-xs font-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md shadow-accent-pink/15 group-hover:opacity-95 transition-all">
                <span>{t.startBtn}</span>
                <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
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
