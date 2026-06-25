import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroImage, AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface HeroProps {
  locale: AppLanguage;
  heroImages: HeroImage[];
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMembers: () => void;
}

export default function Hero({ locale, heroImages, onSelectGender, onExploreMembers }: HeroProps) {
  const t = TRANSLATIONS[locale];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImages = useMemo(
    () => heroImages.filter((image) => image.active).sort((a, b) => a.order - b.order),
    [heroImages]
  );

  useEffect(() => {
    if (activeImages.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % activeImages.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [activeImages.length]);

  return (
    <section className="relative overflow-hidden py-8 sm:py-12" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden border border-stone-200/70 bg-stone-100 shadow-xl shadow-[#40798C]/5">
          {activeImages.map((image, index) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-5">
          <span className="inline-flex items-center bg-white/70 px-4 py-2 rounded-full border border-white/60 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-accent-coral">
            {t.seriousMarriageOnly}
          </span>
          <h1 className="text-3xl sm:text-6xl font-serif text-warm-charcoal tracking-tight leading-tight font-display font-black">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#6B635B] font-medium max-w-2xl mx-auto leading-relaxed">
            {t.heroCleanSub}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-3xl mx-auto pt-2">
            {(['male', 'female'] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => onSelectGender(gender)}
                className="group bg-white/70 border border-white/70 rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6 text-center shadow-lg shadow-stone-200/30 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <span className="block text-3xl sm:text-4xl mb-3">{gender === 'male' ? '🙋‍♂️' : '🙋‍♀️'}</span>
                <span className="block text-sm sm:text-xl font-serif font-black text-warm-charcoal">
                  {gender === 'male' ? t.iamMan : t.iamWoman}
                </span>
                <span className="mt-3 inline-flex items-center justify-center gap-1 rounded-full bg-warm-charcoal text-white px-4 py-2 text-[10px] sm:text-xs font-bold">
            {t.startBtn}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onExploreMembers}
            className="text-xs font-black text-[#40798C] underline underline-offset-4 hover:text-accent-coral transition"
          >
            {t.exploreMembersFirst}
          </button>
        </div>
      </div>
    </section>
  );
}
