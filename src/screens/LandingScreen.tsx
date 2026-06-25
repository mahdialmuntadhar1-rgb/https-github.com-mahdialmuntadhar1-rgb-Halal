import React from 'react';
import { AppLanguage, AppTab, HeroImage } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PhotoPrivacyModule from '../components/PhotoPrivacyModule';
import TrustSafety from '../components/TrustSafety';
import { Check } from 'lucide-react';

interface LandingScreenProps {
  locale: AppLanguage;
  heroImages: HeroImage[];
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMatches: () => void;
  setTab: (tab: AppTab) => void;
}

export default function LandingScreen({ locale, heroImages, onSelectGender, onExploreMatches, setTab }: LandingScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];

  return (
    <div className="animate-fade-in space-y-4" id="landing-screen">
      <Hero
        locale={locale}
        heroImages={heroImages}
        onSelectGender={onSelectGender}
        onExploreMembers={onExploreMatches}
      />
      <HowItWorks locale={locale} />
      <PhotoPrivacyModule locale={locale} />
      <TrustSafety locale={locale} />

      {/* In-Depth Core Philosophy Section (Chunk 12) */}
      <section className="bg-transparent py-16" id="core-philosophy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-accent-coral to-accent-pink rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
            
            <div className="max-w-2xl space-y-6 relative z-10 text-start">
              <span className="text-[10px] uppercase bg-white/20 px-3 py-1 rounded-full font-mono font-bold tracking-widest">
                {t.philSub}
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-tight font-display">
                {t.philTitle}
              </h3>
              <p className="text-sm sm:text-base text-[#FDEDEC] font-medium leading-relaxed">
                {t.philDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-semibold text-white/90">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>{t.philPoint1}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>{t.philPoint2}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>{t.philPoint3}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>{t.philPoint4}</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setTab('onboarding')}
                  className="px-8 py-4 rounded-2xl bg-white text-warm-charcoal font-bold hover:bg-warm-ivory transition active:scale-95 shadow-lg shadow-black/10 text-xs sm:text-sm"
                >
                  {t.philBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
