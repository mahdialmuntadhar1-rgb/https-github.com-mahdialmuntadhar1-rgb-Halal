import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, Sparkles, LogIn, Compass, User, MapPin, GraduationCap, Check } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';
import { AppTab, MatchProfile, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { GOVERNORATE_OPTIONS } from '../screens/LandingScreen';
import { CAROUSEL_SLIDES, GENDER_IMAGES } from './heroConfig';

interface HeroProps {
  locale: Language;
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMatches: () => void;
  setTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
  userProfileName?: string;
  selectedGov?: string;
  setSelectedGov?: (gov: string) => void;
  showToast?: (msg: string) => void;
  userProfile?: UserProfile;
  preSelectedGender?: 'male' | 'female' | null;
}



export default function Hero({ locale, onSelectGender, onExploreMatches, setTab, isAuthenticated, userProfileName, selectedGov, setSelectedGov, showToast, userProfile, preSelectedGender }: HeroProps) {
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
          className="relative w-full aspect-square sm:aspect-auto h-auto sm:h-[480px] md:h-[520px] lg:h-[550px] bg-warm-charcoal rounded-none overflow-hidden shadow-2xl border border-white/25 group/carousel"
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
                src={failedImages[currentIndex] ? CAROUSEL_SLIDES[currentIndex].imageUrl : CAROUSEL_SLIDES[currentIndex].imageUrl}
                alt={CAROUSEL_SLIDES[currentIndex].title[locale] || CAROUSEL_SLIDES[currentIndex].title.en}
                onError={() => setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          {/* GRADIENT OVERLAY (Subtle for premium image contrast) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

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

          {/* OVERLAY SLIDE CTAs & INDICATORS (Text removed for a clean background feel) */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-12 md:p-16 text-center flex flex-col items-center justify-end h-full max-w-4xl mx-auto space-y-3 sm:space-y-6">
            
            {/* ADAPTIVE INTERACTIVE CTA BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 sm:pt-6 w-full max-w-lg">
              {isAuthenticated ? (
                <>
                  {/* Authenticated State CTAs */}
                  <button
                    onClick={onExploreMatches}
                    className="flex-1 min-w-[140px] px-6 py-3 rounded-xl sm:rounded-2xl bg-accent-coral hover:bg-[#ff8f66] border border-accent-coral hover:border-[#ff8f66] text-white font-black text-xs sm:text-sm shadow-xl shadow-accent-coral/10 hover:shadow-accent-coral/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                    className="flex-1 min-w-[130px] sm:min-w-[150px] px-5 py-3 rounded-xl sm:rounded-2xl bg-accent-coral hover:bg-[#ff8f66] border border-accent-coral hover:border-[#ff8f66] text-white font-black text-xs sm:text-sm shadow-xl shadow-accent-coral/10 hover:shadow-accent-coral/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                    idx === currentIndex ? 'w-6 bg-accent-coral shadow-sm shadow-accent-coral/50' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  id={`carousel-dot-${idx}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Short & Single-Line Header */}
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <h2 className="text-[16px] min-[360px]:text-[18px] xs:text-[23px] sm:text-[34px] md:text-[42px] font-serif text-warm-charcoal tracking-tight font-display font-black leading-tight selection:bg-[#40798C]/15">
            {locale === 'en' 
              ? 'Zawaaj Al Iraq' 
              : locale === 'ckb'
                ? 'هاوسەرگیری عێراقی'
                : 'الزواج العراقي'}
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-stone-600 font-medium max-w-2xl mx-auto">
            {locale === 'en' 
              ? 'Zawaaj Al Iraq — For serious marriage in a respectful way that fits our society' 
              : locale === 'ckb'
                ? 'هاوسەرگیری عێراقی — بۆ هاوسەرگیری جدی بە شێوازێکی ڕێزدار کە لەگەڵ کۆمەڵگاکەماندا بگونجێت'
                : 'الزواج العراقي — للزواج الجاد بطريقة محترمة تناسب مجتمعنا'}
          </p>
        </div>

        {/* Two Large Gender Selection Cards (Aligned Side-by-Side on One Row) */}
        {(() => {
          const activeG = userProfile?.gender || preSelectedGender;
          const isMaleSelected = activeG === 'male';
          const isFemaleSelected = activeG === 'female';

          return (
            <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3.5 sm:gap-8 items-stretch">
              
              {/* Card 1: I am a man */}
              <div 
                onClick={() => onSelectGender('male')}
                className={`group cursor-pointer bg-white/40 backdrop-blur-md border rounded-2xl sm:rounded-[2rem] p-2 sm:p-5 text-center space-y-2 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-coral/5 flex flex-col justify-between relative overflow-hidden ${
                  isMaleSelected
                    ? 'border-[#0B5C43] ring-2 ring-[#0B5C43]/20 shadow-xl scale-[1.01]'
                    : isFemaleSelected
                      ? 'border-white/10 opacity-40 grayscale hover:opacity-70 hover:grayscale-0'
                      : 'border-white/20 hover:border-accent-coral/40 hover:-translate-y-1'
                }`}
                id="select-gender-male"
              >
                {/* Background texture */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#40798C]/5 rounded-full blur-xl pointer-events-none" />
                
                {isMaleSelected && (
                  <div className="absolute top-2 left-2 z-10 bg-[#0B5C43] text-white text-[8px] sm:text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    <span>
                      {locale === 'en' ? 'Groom (Selected)' : locale === 'ar' ? 'عريس (تم التحديد)' : 'زاوا (دیاریکرا)'}
                    </span>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                    <img 
                      src={GENDER_IMAGES.male} 
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
                  <span className={`inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse text-[7.5px] sm:text-xs font-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all ${
                    isMaleSelected
                      ? 'bg-[#0B5C43] text-white shadow-emerald-950/20'
                      : 'bg-accent-coral text-white shadow-accent-coral/15 group-hover:bg-[#316070]'
                  }`}>
                    <span>{isMaleSelected ? (locale === 'en' ? 'Sincere Groom Profile' : locale === 'ar' ? 'ملف عريس جاد' : 'پڕۆفایلی زاوای جدی') : t.startBtn}</span>
                    <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
                  </span>
                </div>
              </div>

              {/* Card 2: I am a woman */}
              <div 
                onClick={() => onSelectGender('female')}
                className={`group cursor-pointer bg-white/40 backdrop-blur-md border rounded-2xl sm:rounded-[2rem] p-2 sm:p-5 text-center space-y-2 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-pink/5 flex flex-col justify-between relative overflow-hidden ${
                  isFemaleSelected
                    ? 'border-accent-pink ring-2 ring-accent-pink/20 shadow-xl scale-[1.01]'
                    : isMaleSelected
                      ? 'border-white/10 opacity-40 grayscale hover:opacity-70 hover:grayscale-0'
                      : 'border-white/20 hover:border-accent-pink/40 hover:-translate-y-1'
                }`}
                id="select-gender-female"
              >
                {/* Background texture */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-accent-pink/5 rounded-full blur-xl pointer-events-none" />

                {isFemaleSelected && (
                  <div className="absolute top-2 right-2 z-10 bg-accent-pink text-white text-[8px] sm:text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    <span>
                      {locale === 'en' ? 'Bride (Selected)' : locale === 'ar' ? 'عروس (تم التحديد)' : 'بووک (دیاریکرا)'}
                    </span>
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
                    <img 
                      src={GENDER_IMAGES.female} 
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
                  <span className={`inline-flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse text-[7.5px] sm:text-xs font-black px-2.5 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all ${
                    isFemaleSelected
                      ? 'bg-accent-pink text-white shadow-pink-950/20'
                      : 'bg-accent-pink text-white shadow-accent-pink/15 group-hover:opacity-95'
                  }`}>
                    <span>{isFemaleSelected ? (locale === 'en' ? 'Sincere Bride Profile' : locale === 'ar' ? 'ملف عروس جاد' : 'پڕۆفایلی بووکی جدی') : t.startBtn}</span>
                    <ArrowRight className="w-2 h-2 sm:w-3.5 sm:h-3.5 transform rtl:rotate-180" />
                  </span>
                </div>
              </div>

            </div>
          );
        })()}

        {/* Search & Governorate Selection Card directly below Gender Cards */}
        <div className="max-w-2xl mx-auto w-full bg-white/70 backdrop-blur-md border border-[#E6DCC3]/80 rounded-[2rem] p-6 sm:p-8 shadow-xl text-center space-y-4 relative overflow-hidden" id="homepage-search-card">
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-serif font-black text-warm-charcoal">
              {locale === 'en' ? 'Search Matches across Iraq' : locale === 'ar' ? 'البحث عن شريك العمر في العراق' : 'گەڕان بەدوای هاوسەری گونجاو لە عێراقدا'}
            </h3>
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
              {locale === 'en' 
                ? 'Select a governorate or search across all of Iraq to explore matching brides or grooms.' 
                : locale === 'ar' 
                  ? 'اختر محافظة محددة أو ابحث في كل العراق لاستكشاف شريكك المتوافق شرعياً ووقاراً.' 
                  : 'پارێزگایەک هەڵبژێرە یان لە هەموو عێراقدا بگەڕێ بۆ دۆزینەوەی هاوبەشی گونجاو.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            {/* Governorate Select Dropdown with All Iraq Option */}
            <div className="relative w-full sm:w-56">
              <select
                value={selectedGov || 'all'}
                onChange={(e) => {
                  if (setSelectedGov) {
                    setSelectedGov(e.target.value);
                  }
                  if (showToast) {
                    const name = e.target.value === 'all' 
                      ? (locale === 'en' ? 'All Iraq' : locale === 'ar' ? 'كل العراق' : 'هەموو عێراق')
                      : (GOVERNORATE_OPTIONS.find(g => g.id === e.target.value) 
                        ? (locale === 'en' ? GOVERNORATE_OPTIONS.find(g => g.id === e.target.value)!.en : locale === 'ckb' ? GOVERNORATE_OPTIONS.find(g => g.id === e.target.value)!.ckb : GOVERNORATE_OPTIONS.find(g => g.id === e.target.value)!.ar)
                        : e.target.value);
                    showToast(locale === 'en' ? `Selected location: ${name}` : locale === 'ar' ? `الموقع المختار: ${name}` : `ناوچەی هەڵبژێردراو: ${name}`);
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs sm:text-sm font-black outline-none cursor-pointer shadow-inner hover:border-accent-coral/30 transition"
              >
                <option value="all" className="text-warm-charcoal font-black">
                  {locale === 'en' ? 'All Iraq (كل العراق)' : locale === 'ar' ? 'كل العراق (All Iraq)' : 'هەموو عێراق (All Iraq)'}
                </option>
                {GOVERNORATE_OPTIONS.map((gov) => (
                  <option key={gov.id} value={gov.id} className="text-warm-charcoal font-bold">
                    {locale === 'en' ? gov.en : locale === 'ckb' ? gov.ckb : gov.ar}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-coral" />
            </div>

            {/* Clear Action Button: Explore / Search Matches */}
            <button
              onClick={onExploreMatches}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-accent-coral to-[#E05345] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-accent-coral/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              id="homepage-explore-cta-btn"
            >
              <Compass className="w-4 h-4 text-white animate-spin-slow" />
              <span>
                {locale === 'en' ? 'Search Matches' : locale === 'ar' ? 'ابحث عن شريك العمر' : 'گەڕان بەدوای هاوبەشدا'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white transform rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Dynamic Gender/Partner Matching Guidance Banner */}
        <div className="max-w-4xl mx-auto" id="gender-matching-guidance-banner">
          <div className="bg-[#FAF8F5] border border-[#E6DCC3] rounded-2xl p-4 sm:p-5 text-center space-y-1.5 shadow-sm">
            {(() => {
              const activeG = userProfile?.gender || preSelectedGender;
              if (activeG === 'male') {
                return (
                  <>
                    <p className="text-xs sm:text-sm font-black text-[#0B5C43] flex items-center justify-center gap-1.5">
                      💍 {locale === 'en' 
                        ? "We will show you suitable women for marriage." 
                        : locale === 'ar' 
                          ? "سوف نقوم بعرض النساء والعرائس الصالحات للزواج الشرعي لك." 
                          : "ئێمە کچانی شیاو بۆ هاوسەرگیری شەرعی بە تۆ پیشان دەدەین."}
                    </p>
                    <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                      {locale === 'en'
                        ? "Registered as Groom. The search automatically displays verified brides seeking a pious marital household."
                        : locale === 'ar'
                          ? "مسجل كعريس. يقوم البحث تلقائياً بعرض العرائس الموثقات اللواتي يبحثن عن شريك حياة صالح لتأسيس بيت مسلم."
                          : "وەک زاوا تۆمارکراویت. گەڕانەکە خۆکارانە بووکە پشتڕاستکراوەکان پیشان دەدات کە بەدوای هاوسەرێکی چاکدا دەگەڕێن."}
                    </p>
                  </>
                );
              } else if (activeG === 'female') {
                return (
                  <>
                    <p className="text-xs sm:text-sm font-black text-accent-pink flex items-center justify-center gap-1.5">
                      💍 {locale === 'en' 
                        ? "We will show you suitable men for marriage." 
                        : locale === 'ar' 
                          ? "سوف نقوم بعرض الرجال العرسان الصالحين للزواج الشرعي لك." 
                          : "ئێمە پیاوانی شیاو بۆ هاوسەرگیری شەرعی بە تۆ پیشان دەدەین."}
                    </p>
                    <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                      {locale === 'en'
                        ? "Registered as Bride. The search automatically displays verified grooms seeking a traditional marital union."
                        : locale === 'ar'
                          ? "مسجلة كعروس. يقوم البحث تلقائياً بعرض العرسان الرجال الموثقين الذين يبحثون عن شريكة حياة صالحة لتأسيس أسرة كريمة."
                          : "وەک بووک تۆمارکراویت. گەڕانەکە خۆکارانە زاوا پشتڕاستکراوەکان پیشان دەدات کە بەدوای هاوسەرێکی شیاودا دەگەڕێن."}
                    </p>
                  </>
                );
              } else {
                return (
                  <>
                    <p className="text-xs sm:text-sm font-black text-[#0B5C43] flex items-center justify-center gap-1.5">
                      ⚖️ {locale === 'en'
                        ? "Halal Marital Selection: This is who I am"
                        : locale === 'ar'
                          ? "الاختيار الشرعي للزواج: أنا رجل / أنا امرأة"
                          : "دیاریکردنی شەرعی بۆ هاوسەرگیری: من پیاوم / من ژنم"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                      {locale === 'en'
                        ? "Choosing a button specifies your own gender. The application automatically filters and connects you with the opposite gender to ensure a traditional, serious marital search."
                        : locale === 'ar'
                          ? "اختيار الزر يحدد جنسك الحقيقي (هويتك). يقوم التطبيق تلقائياً بالبحث وعرض الجنس الآخر لضمان زواج شرعي جاد وتقليدي ومحترم."
                          : "دیاریکردنی دوگمەکە ڕەگەزی ڕاستەقینەی خۆت دیاریدەکات. ئەپڵیکەیشنەکە خۆکارانە فلتەر دەکات و دەتگەیەنێت بە ڕەگەزی بەرامبەر بۆ هاوسەرگیرییەکی شەرعی."}
                    </p>
                  </>
                );
              }
            })()}
          </div>
        </div>
 
         {/* HORIZONTAL CANDIDATES SCROLL ROW */}
         {(() => {
           let pool = (!selectedGov || selectedGov.toLowerCase() === 'all' || selectedGov.toLowerCase() === 'all iraq')
             ? INITIAL_MATCHES
             : INITIAL_MATCHES.filter(m => m.governorate.toLowerCase() === selectedGov.toLowerCase());
           
           const activeG = userProfile?.gender || preSelectedGender;
           if (activeG) {
             const opposite = activeG === 'male' ? 'female' : 'male';
             pool = pool.filter(m => m.gender === opposite);
           }
          
          const localFilteredMatches = pool.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
            
          const getGovDisplayNameLocal = (govId: string) => {
            if (!govId || govId.toLowerCase() === 'all' || govId.toLowerCase() === 'all iraq') {
              return locale === 'en' ? 'All Iraq' : locale === 'ar' ? 'كل العراق' : 'هەموو عێراق';
            }
            const gov = GOVERNORATE_OPTIONS.find(g => g.id === govId);
            if (!gov) return govId;
            return locale === 'en' ? gov.en : locale === 'ckb' ? gov.ckb : gov.ar;
          };

          const handleLocalProfileClick = (candidate: any) => {
            if (!isAuthenticated) {
              if (showToast) {
                showToast(
                  locale === 'en'
                    ? "💍 Please login or create an account to view deep lifestyle values & send requests!"
                    : locale === 'ar'
                      ? "💍 يرجى تسجيل الدخول أو إنشاء حساب لاستكشاف تفاصيل القيم العائلية والتواصل الجاد!"
                      : "💍 تکایە سەرەتا بچۆ ژوورەوە یان پڕۆفایل دروست بکە بۆ دیتنی بەهاکان!"
                );
              }
              setTab('onboarding');
            } else {
              onExploreMatches();
            }
          };

          return (
            <div className="max-w-4xl mx-auto space-y-4 pt-8 pb-4 text-start" id="governorate-horizontal-scroll-row">
              <div className="flex justify-between items-end border-b border-[#E8DCC4]/40 pb-2">
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-black text-warm-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-accent-coral" />
                    <span>
                      {locale === 'en' 
                        ? 'Candidates Nearby' 
                        : locale === 'ar' 
                          ? 'المرشحون القريبون منك' 
                          : 'کاندیدەکانی نزیک لە تۆ'}
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
                    {locale === 'en' 
                      ? `Active profiles from ${getGovDisplayNameLocal(selectedGov || 'Baghdad')}` 
                      : locale === 'ar' 
                        ? `الملفات النشطة والجادة في محافظة ${getGovDisplayNameLocal(selectedGov || 'Baghdad')}` 
                        : `پڕۆفایلە چالاکەکان لە پارێزگای ${getGovDisplayNameLocal(selectedGov || 'Baghdad')}`}
                  </p>
                </div>
                
                <button
                  onClick={onExploreMatches}
                  className="text-[10px] sm:text-xs font-black text-[#40798C] hover:text-accent-coral transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>
                    {locale === 'en' 
                      ? 'View All' 
                      : locale === 'ar' 
                        ? 'عرض الكل' 
                        : 'بینینی هەموو'}
                  </span>
                  <ArrowRight className="w-3 h-3 transform rtl:rotate-180" />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent snap-x">
                {localFilteredMatches.length > 0 ? (
                  localFilteredMatches.map((candidate) => {
                    const isFemale = candidate.gender === 'female';
                    return (
                      <div
                        key={`hero-scroll-${candidate.id}`}
                        onClick={() => handleLocalProfileClick(candidate)}
                        className="flex-shrink-0 w-44 bg-white/70 backdrop-blur-md border border-[#E6DCC3] hover:border-accent-coral/40 rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 snap-start text-start relative overflow-hidden group select-none"
                      >
                        <div className="space-y-3">
                          {/* Avatar Image */}
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-inner bg-stone-100 flex items-center justify-center">
                            {isFemale ? (
                              <>
                                <img
                                  src={candidate.avatarUrl}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover blur-lg scale-110 select-none pointer-events-none opacity-85"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[4px] flex flex-col items-center justify-center text-center p-2">
                                  <div className="w-9 h-9 rounded-full bg-white border border-accent-pink/20 shadow-sm flex items-center justify-center text-accent-pink font-serif font-black text-xs">
                                    {candidate.name.charAt(0)}
                                  </div>
                                  <span className="mt-1.5 text-[8px] font-bold text-stone-700 bg-white/90 border border-stone-200 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                    🔒 {locale === 'en' ? 'Protected' : locale === 'ar' ? 'محمية' : 'پارێزراو'}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  src={candidate.avatarUrl}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                              </>
                            )}
                            
                            {candidate.verified && (
                              <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-sm">
                                <ShieldCheck className="w-3 h-3" />
                              </span>
                            )}

                            <span className="absolute bottom-1.5 left-1.5 text-[7px] sm:text-[8px] font-mono font-extrabold text-[#40798C] bg-white/90 px-1.5 py-0.5 rounded-md">
                              💖 {candidate.compatibilityScore}%
                            </span>
                          </div>

                          {/* Name & Basic details */}
                          <div className="space-y-0.5">
                            <h5 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal group-hover:text-[#40798C] transition-colors truncate">
                              {isFemale ? (locale === 'en' ? candidate.name : locale === 'ckb' ? (candidate as any).nameCkb || candidate.name : (candidate as any).nameAr || candidate.name) : candidate.name}, <span className="font-sans font-medium text-stone-500">{candidate.age}</span>
                            </h5>
                            <p className="text-[9px] font-extrabold text-stone-500 flex items-center gap-0.5 truncate">
                              <GraduationCap className="w-3 h-3 text-[#40798C] shrink-0" />
                              <span className="truncate">{candidate.profession}</span>
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[8px] font-bold">
                          <span className="text-stone-400">
                            📍 {candidate.city}
                          </span>
                          <span className="text-[#40798C] group-hover:text-accent-coral transition-colors flex items-center gap-0.5">
                            <span>{locale === 'en' ? 'View' : locale === 'ar' ? 'عرض' : 'بینین'}</span>
                            <ArrowRight className="w-2.5 h-2.5 transform rtl:rotate-180" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full py-8 text-center text-xs font-semibold text-stone-400 bg-white/50 rounded-2xl border border-dashed border-[#E6DCC3]/80">
                    {locale === 'en' 
                      ? 'No candidates in this governorate yet.' 
                      : locale === 'ar' 
                        ? 'لا يوجد مرشحون في هذه المحافظة حالياً.' 
                        : 'هیچ کاندیدێک لەم پارێزگایەدا نییە تا ئێستا.'}
                  </div>
                )}
              </div>
            </div>
          );
        })()}


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
