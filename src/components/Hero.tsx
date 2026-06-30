import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, Sparkles, LogIn, Compass, User } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';
import { AppTab } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  locale: Language;
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMatches: () => void;
  setTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
  userProfileName?: string;
}

const CAROUSEL_SLIDES = [
  {
    localUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    fallbackUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Find a Serious Path to Marriage',
      ar: 'ابدأ طريقاً جاداً نحو الزواج',
      ckb: 'ڕێگایەکی جددی بۆ هاوسەرگیری دەست پێ بکە'
    },
    subtitle: {
      en: 'Dignified, values-first marital matchmaking with complete command over photo security.',
      ar: 'تواصل كريم ومحترم يسعى لبناء عائلة مستقرة مبنية على المودة والرحمة والالتزام.',
      ckb: 'پەیوەندی بەهادار و بەڕێز بۆ پێکهێنانی خێزانێکی بەختەوەر و جێگیر.'
    }
  },
  {
    localUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    fallbackUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'A Sacred Covenant of Trust',
      ar: 'ميثاق غليظ مبني على الثقة والاحترام',
      ckb: 'پەیمانێکی پیرۆز لەسەر متمانە و ڕێزگرتن'
    },
    subtitle: {
      en: 'Every single profile is verified for absolute seriousness and marital intentions.',
      ar: 'كل ملف شخصي يتم توثيقه لضمان الجدية التامة والالتزام بالقيم الأصيلة.',
      ckb: 'هەموو پڕۆفایلەکان پشتڕاست دەکرێنەوە بۆ دڵنیابوون لە جدیبوونی تەواو.'
    }
  },
  {
    localUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
    fallbackUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Dignified Photo Protection',
      ar: 'الخصوصية التامة لصورك التعريفية',
      ckb: 'پاراستنی تەواوی وێنەکانت'
    },
    subtitle: {
      en: 'You fully control who can request and view your portrait, completely on your terms.',
      ar: 'تتحكمين بشكل كامل في من يشاهد صورتك التعريفية، محمية بالكامل حسب شروطك.',
      ckb: 'کۆنترۆڵی تەواو بکە کێ دەتوانێت وێنەکەت ببینێت بەپێی یاساکانی خۆت.'
    }
  },
  {
    localUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200',
    fallbackUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Sincere Matches, Shared Goals',
      ar: 'نوايا صادقة وأهداف عائلية مشتركة',
      ckb: 'نیەتی پاک و ئامانجی هاوبەش'
    },
    subtitle: {
      en: 'Connect based on lifestyle values, courtship timelines, and spiritual compatibility.',
      ar: 'تواصل على أساس التوافق الفكري والروحي، والخط الزمني للزواج، ورؤية الأسرة.',
      ckb: 'پەیوەندی دروست بکە لەسەر بنەمای گونجانی فیکری و بەها هاوبەشەکان.'
    }
  },
  {
    localUrl: 'https://images.unsplash.com/photo-1621616875450-79f22448040e?auto=format&fit=crop&q=80&w=1200',
    fallbackUrl: 'https://images.unsplash.com/photo-1621616875450-79f22448040e?auto=format&fit=crop&q=80&w=1200',
    title: {
      en: 'Blessed Marriage Journey',
      ar: 'عقود مباركة وبيوت مطمئنة',
      ckb: 'هاوسەرگیری حەڵاڵ و ژیانی پڕ خێر'
    },
    subtitle: {
      en: 'Take a secure, respectable path toward sealing a happy, long-lasting household.',
      ar: 'خذ مساراً آمناً ووقوراً نحو تأسيس زواج مستقر وحياة زوجية عامرة بالسعادة.',
      ckb: 'ڕێگايەکی ئارام و بەڕێز بگرەبەر بۆ پێکهێنانی ژیانێکی هاوسەری جێگیر.'
    }
  }
];

export default function Hero({ locale, onSelectGender, onExploreMatches, setTab, isAuthenticated, userProfileName }: HeroProps) {
  const t = TRANSLATIONS[locale];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    startTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
    startTimer();
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  return (
    <section className="relative overflow-hidden py-4 sm:py-8" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        
        {/* PREMIUM ROMANTIC CAROUSEL */}
        <div 
          className="relative w-full h-[380px] sm:h-[480px] md:h-[550px] lg:h-[580px] bg-warm-charcoal rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/25 group/carousel"
          id="romantic-carousel-container"
        >
          {/* SLIDING IMAGES */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={failedImages[currentIndex] ? CAROUSEL_SLIDES[currentIndex].fallbackUrl : CAROUSEL_SLIDES[currentIndex].localUrl}
                alt={CAROUSEL_SLIDES[currentIndex].title[locale] || CAROUSEL_SLIDES[currentIndex].title.en}
                onError={() => setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          {/* GRADIENT OVERLAY (Guarantees high-contrast readability) */}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-charcoal/95 via-warm-charcoal/50 to-warm-charcoal/30 z-10" />

          {/* INTERACTIVE CONTROLS: LEFT ARROW */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md text-white transition-all cursor-pointer opacity-80 hover:opacity-100 active:scale-90"
            aria-label="Previous slide"
            id="carousel-btn-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* INTERACTIVE CONTROLS: RIGHT ARROW */}
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md text-white transition-all cursor-pointer opacity-80 hover:opacity-100 active:scale-90"
            aria-label="Next slide"
            id="carousel-btn-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* OVERLAY SLIDE TEXT & CTAs */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-12 md:p-16 text-center flex flex-col items-center justify-end h-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
            
            {/* Decent badge */}
            <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-neon-pink/20 border border-neon-pink/40 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold text-white tracking-widest uppercase shadow-inner shadow-neon-pink/30">
              <Heart className="w-3.5 h-3.5 text-neon-pink fill-neon-pink animate-pulse" />
              <span>{locale === 'en' ? 'Zawaj Al Araqi' : locale === 'ar' ? 'منصة الزواج العراقي' : 'هاوسەریری حەڵاڵ'}</span>
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight font-display font-black leading-tight max-w-3xl drop-shadow-md">
              {CAROUSEL_SLIDES[currentIndex].title[locale] || CAROUSEL_SLIDES[currentIndex].title.en}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-warm-ivory/90 font-medium max-w-xl mx-auto leading-relaxed drop-shadow-xs">
              {CAROUSEL_SLIDES[currentIndex].subtitle[locale] || CAROUSEL_SLIDES[currentIndex].subtitle.en}
            </p>

            {/* ADAPTIVE INTERACTIVE CTA BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 sm:pt-6 w-full max-w-lg">
              {isAuthenticated ? (
                <>
                  {/* Authenticated State CTAs */}
                  <button
                    onClick={onExploreMatches}
                    className="flex-1 min-w-[140px] px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90 border border-neon-pink/30 text-white font-black text-xs sm:text-sm shadow-xl shadow-neon-pink/20 hover:shadow-neon-pink/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="carousel-cta-browse"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{t.browseMatchesBtn}</span>
                  </button>
                  <button
                    onClick={() => setTab('profile')}
                    className="flex-1 min-w-[140px] px-6 py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs sm:text-sm backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="carousel-cta-profile"
                  >
                    <User className="w-4 h-4 text-warm-ivory" />
                    <span>{locale === 'en' ? `My Portfolio (${userProfileName || 'Member'})` : locale === 'ar' ? `ملفي الشخصي (${userProfileName || 'عضو'})` : `پڕۆفایلەکەم (${userProfileName || 'ئەندام'})`}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Unauthenticated State CTAs */}
                  <button
                    onClick={() => setTab('onboarding')}
                    className="flex-1 min-w-[130px] sm:min-w-[150px] px-5 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple hover:opacity-90 border border-neon-pink/30 text-white font-black text-xs sm:text-sm shadow-xl shadow-neon-pink/20 hover:shadow-neon-pink/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="carousel-cta-create"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>{t.createAccountBtn}</span>
                  </button>
                  <button
                    onClick={() => setTab('onboarding')}
                    className="flex-1 min-w-[130px] sm:min-w-[150px] px-5 py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs sm:text-sm backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="carousel-cta-login"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.loginBtn}</span>
                  </button>
                  <button
                    onClick={onExploreMatches}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-transparent hover:bg-white/5 border border-white/10 text-white/90 font-black text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="carousel-cta-explore"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{t.browseMatchesBtn}</span>
                  </button>
                </>
              )}
            </div>

            {/* MANUAL SLIDE INDICATOR DOTS */}
            <div className="flex space-x-2 rtl:space-x-reverse pt-2 z-20 pointer-events-auto">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-neon-pink shadow-sm shadow-neon-pink/50' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  id={`carousel-dot-${idx}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Short & Single-Line Header */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[15px] min-[360px]:text-[17px] xs:text-[22px] sm:text-[32px] md:text-[40px] font-serif text-warm-charcoal tracking-tight font-display font-black leading-tight selection:bg-[#40798C]/15">
            {locale === 'en' ? 'Zawaj Al Araqi for Serious Intentions' : locale === 'ar' ? 'الزواج العراقي للزواج الجاد' : 'هاوسەرگیری حەڵاڵ بۆ کەسانی جدی'}
          </h2>
        </div>

        {/* Two Large Gender Selection Cards (Aligned Side-by-Side on One Row) */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3.5 sm:gap-8 items-stretch">
          
          {/* Card 1: I am a man */}
          <div 
            onClick={() => onSelectGender('male')}
            className="group cursor-pointer bg-white/40 backdrop-blur-md border border-white/20 hover:border-neon-purple/40 rounded-2xl sm:rounded-[2rem] p-2 sm:p-5 text-center space-y-2 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-neon-purple/10 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            id="select-gender-male"
          >
            {/* Background texture */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl pointer-events-none" />
            
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
              <h3 className="text-xs sm:text-xl font-serif font-black text-deep-charcoal text-center leading-tight">
                {t.iamMan}
              </h3>
              <p className="hidden xs:block text-[9px] sm:text-xs text-dark-gray max-w-sm mx-auto leading-relaxed font-semibold">
                {t.iamManDesc}
              </p>
            </div>
            
            <div className="pt-1 sm:pt-3">
              <span className="inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse bg-neon-purple text-white text-[7.5px] sm:text-xs font-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md shadow-neon-purple/20 group-hover:opacity-90 transition-all">
                <span>{t.startBtn}</span>
                <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
              </span>
            </div>
          </div>

          {/* Card 2: I am a woman */}
          <div 
            onClick={() => onSelectGender('female')}
            className="group cursor-pointer bg-white/40 backdrop-blur-md border border-white/20 hover:border-neon-pink/40 rounded-2xl sm:rounded-[2rem] p-2 sm:p-5 text-center space-y-2 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-neon-pink/10 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            id="select-gender-female"
          >
            {/* Background texture */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-neon-pink/10 rounded-full blur-xl pointer-events-none" />

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
              <h3 className="text-xs sm:text-xl font-serif font-black text-deep-charcoal text-center leading-tight">
                {t.iamWoman}
              </h3>
              <p className="hidden xs:block text-[9px] sm:text-xs text-dark-gray max-w-sm mx-auto leading-relaxed font-semibold">
                {t.iamWomanDesc}
              </p>
            </div>
            
            <div className="pt-1 sm:pt-3">
              <span className="inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse bg-neon-pink text-white text-[7.5px] sm:text-xs font-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md shadow-neon-pink/20 group-hover:opacity-90 transition-all">
                <span>{t.startBtn}</span>
                <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
              </span>
            </div>
          </div>

        </div>

        {/* Emotionally powerful tagline */}
        <p className="text-xs sm:text-sm font-medium text-warm-charcoal font-serif tracking-wide italic text-center max-w-lg mx-auto">
          "{t.tagline}"
        </p>

        {/* Quick entry links */}
        <div className="flex justify-center gap-4 text-xs font-bold">
          <button 
            onClick={onExploreMatches}
            className="text-[#6B635B]/90 hover:text-accent-coral underline transition-all font-sans cursor-pointer"
          >
            {t.exploreMatchesBtn}
          </button>
        </div>

      </div>
    </section>
  );
}




