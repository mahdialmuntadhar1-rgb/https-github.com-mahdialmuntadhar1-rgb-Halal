import React, { useState, useMemo } from 'react';
import { AppLanguage, AppTab, MatchProfile, UserProfile } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PhotoPrivacyModule from '../components/PhotoPrivacyModule';
import TrustSafety from '../components/TrustSafety';
import MarriageCafe from '../components/MarriageCafe';
import { INITIAL_MATCHES } from '../data/matches';
import { 
  Check, 
  MapPin, 
  User, 
  Users, 
  GraduationCap, 
  Filter, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  UserCheck,
  X,
  Compass,
  Award,
  Coffee
} from 'lucide-react';

interface LandingScreenProps {
  locale: AppLanguage;
  onSelectGender: (gender: 'male' | 'female') => void;
  onExploreMatches: () => void;
  setTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
  userProfileName?: string;
  userProfile?: UserProfile;
  preSelectedGender?: 'male' | 'female' | null;
}

// 19 Governorates list with English, Arabic, and Kurdish translations
export const GOVERNORATE_OPTIONS = [
  { id: 'Baghdad', en: 'Baghdad (بغداد / بەغداد)', ar: 'بغداد (Baghdad)', ckb: 'بەغداد (Baghdad)' },
  { id: 'Erbil', en: 'Erbil (أربيل / هەولێر)', ar: 'أربيل (Erbil)', ckb: 'هەولێر (Erbil)' },
  { id: 'Sulaymaniyah', en: 'Sulaymaniyah (السليمانية / سلێمانی)', ar: 'السليمانية (Sulaymaniyah)', ckb: 'سلێمانی (Sulaymaniyah)' },
  { id: 'Duhok', en: 'Duhok (دهوك / دهۆک)', ar: 'دهوك (Duhok)', ckb: 'دهۆک (Duhok)' },
  { id: 'Halabja', en: 'Halabja (حلبجة / هەڵەبجە)', ar: 'حلبجة (Halabja)', ckb: 'هەڵەبجە (Halabja)' },
  { id: 'Kirkuk', en: 'Kirkuk (كركوك / کەرکوک)', ar: 'كركوك (Kirkuk)', ckb: 'کەرکوک (Kirkuk)' },
  { id: 'Nineveh', en: 'Nineveh (نينوى / نەینەوا)', ar: 'نينوى (Nineveh)', ckb: 'نەینەوا (Nineveh)' },
  { id: 'Basra', en: 'Basra (البصرة / بەسرە)', ar: 'البصرة (Basra)', ckb: 'بەسرە (Basra)' },
  { id: 'Najaf', en: 'Najaf (النجف / نەجەف)', ar: 'النجف (Najaf)', ckb: 'نەجەف (Najaf)' },
  { id: 'Karbala', en: 'Karbala (كربلاء / کەربەلا)', ar: 'كربلاء (Karbala)', ckb: 'کەربەلا (Karbala)' },
  { id: 'Babil', en: 'Babil (بابل / بابل)', ar: 'بابل (Babel)', ckb: 'بابل (Babel)' },
  { id: 'Anbar', en: 'Anbar (الأنبار / ئەنبار)', ar: 'الأنبار (Anbar)', ckb: 'ئەنبار (Anbar)' },
  { id: 'Diyala', en: 'Diyala (ديالى / دیالە)', ar: 'ديالى (Diyala)', ckb: 'دیالە (Diyala)' },
  { id: 'Salah al-Din', en: 'Salah al-Din (صلاح الدين / سەڵاحەدین)', ar: 'صلاح الدين (Salah al-Din)', ckb: 'سەڵاحەدین (Salah al-Din)' },
  { id: 'Wasit', en: 'Wasit (واسط / واسیت)', ar: 'واسط (Wasit)', ckb: 'واسیت (Wasit)' },
  { id: 'Maysan', en: 'Maysan (ميسان / میسان)', ar: 'ميسان (Maysan)', ckb: 'میسان (Maysan)' },
  { id: 'Dhi Qar', en: 'Dhi Qar (ذي قار / زیقار)', ar: 'ذي قار (Dhi Qar)', ckb: 'زیقار (Dhi Qar)' },
  { id: 'Muthanna', en: 'Muthanna (المثنى / موتەنا)', ar: 'المثنى (Muthanna)', ckb: 'موتەنا (Muthanna)' },
  { id: 'Qadisiyah', en: 'Qadisiyah (القادسية / قادسيە)', ar: 'القادسية (Qadisiyah)', ckb: 'قادسیە (Qadisiyah)' }
];

// System-selected landmarks for the 19 Iraqi governorates
const GOVERNORATE_LANDMARKS: Record<string, { en: string; ar: string; ckb: string; icon: string }> = {
  Baghdad: { en: 'Al-Mutanabbi Street', ar: 'شارع المتنبي التراثي', ckb: 'شەقامی موتەنەبی مێژوویی', icon: '📚' },
  Erbil: { en: 'Erbil Citadel', ar: 'قلعة أربيل الأثرية', ckb: 'قەڵای هەولێری دێرین', icon: '🏰' },
  Sulaymaniyah: { en: 'Salim Street & Azadi Park', ar: 'شارع سالم وحديقة آزادي', ckb: 'شەقامی سالم و باخی دایک', icon: '🌳' },
  Duhok: { en: 'Duhok Dam & Dream City', ar: 'سد دهوك ومدينة الأحلام', ckb: 'بەنداوی دهۆک و دریم سیتی', icon: '🎡' },
  Halabja: { en: 'Sarchinar & Ahmad Awa', ar: 'شلالات أحمد آوا الجميلة', ckb: 'هاوینەهەواری ئەحمەد ئاوا', icon: '🌊' },
  Kirkuk: { en: 'Kirkuk Citadel', ar: 'قلعة كركوك التاريخية', ckb: 'قەڵای کەرکوکی مێژوویی', icon: '🏛️' },
  Nineveh: { en: 'Al-Nuri Mosque & Mosul Woods', ar: 'غابات الموصل والمنارة الحدباء', ckb: 'دارستانەکانی موسڵ', icon: '🕌' },
  Basra: { en: 'Shatt al-Arab Corniche', ar: 'كورنيش شط العرب', ckb: 'کۆڕنیشی شەتل عەرەب', icon: '⛵' },
  Najaf: { en: 'Wadi-us-Salaam & Heritage Bazaar', ar: 'السوق الكبير والتراث النجفي', ckb: 'بازاڕی گەورەی نەجەف', icon: '🕌' },
  Karbala: { en: 'Al-Hussein Area & Lake Milh', ar: 'منطقة الحرمين وبحيرة الملح', ckb: 'ناوچەی حەرەمەین', icon: '🌅' },
  Babil: { en: 'Ancient Ruins of Babylon', ar: 'آثار بابل التاريخية وأسد بابل', ckb: 'شوێنەواری دێرینی بابل', icon: '🦁' },
  Anbar: { en: 'Habbaniyah Lake & Euphrates', ar: 'بحيرة الحبانية ونهر الفرات', ckb: 'دەریاچەی حەبانیە', icon: '🏖️' },
  Diyala: { en: 'Hamrin Hills & Orange Groves', ar: 'بساتين البرتقال وتلال حمرين', ckb: 'باخەکانی پرتەقاڵی دیالە', icon: '🍊' },
  "Salah al-Din": { en: 'Spiral Minaret of Samarra', ar: 'مئذنة الملوية الأثرية في سامراء', ckb: 'منارەی مەلوییەی سامەڕا', icon: '🕌' },
  Wasit: { en: 'Kut Barrage & Tigris Banks', ar: 'سد الكوت وضفاف نهر دجلة', ckb: 'بەنداوی کوت', icon: '🌊' },
  Maysan: { en: 'Amara Marshes & Kahla River', ar: 'أهوار العمارة ونهر الكحلاء', ckb: 'أهوار العمارة ونهر الكحلاء', icon: '🚣' },
  "Dhi Qar": { en: 'Ziggurat of Ur & Chibayish Marshes', ar: 'زقورة أور الأثرية وأهوار الجبايش', ckb: 'زەقوورەی ئۆر و ئەهوارەکان', icon: '🏺' },
  Muthanna: { en: 'Sawa Lake & Warka Ruins', ar: 'بحيرة ساوة وآثار الوركاء', ckb: 'دەریاچەی ساوا', icon: '🏜️' },
  Qadisiyah: { en: 'Nippur Ruins & Diwaniyah River', ar: 'آثار نيبور وضفاف نهر الديوانية', ckb: 'شوێنەواری نیپۆر', icon: '🌾' },
};

export default function LandingScreen({ locale, onSelectGender, onExploreMatches, setTab, isAuthenticated, userProfileName, userProfile, preSelectedGender }: LandingScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS['ar'];
  const isEn = locale === 'en';
  const isCkb = locale === 'ckb';

  const isProfileIncomplete = useMemo(() => {
    return isAuthenticated && (
      !userProfile || !userProfile.age || userProfile.age === 0 || !userProfile.education || !userProfile.profession
    );
  }, [isAuthenticated, userProfile]);

  // State management for governorate filtering
  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(55);
  
  // Set default gender preference based on user profile or default
  const defaultGenderPref = useMemo(() => {
    const activeG = userProfile?.gender || preSelectedGender;
    return activeG ? (activeG === 'male' ? 'female' : 'male') : 'all';
  }, [userProfile, preSelectedGender]);

  const [genderPref, setGenderPref] = useState<'all' | 'female' | 'male'>(defaultGenderPref);

  // Synchronize default gender preference when profile changes
  React.useEffect(() => {
    const activeG = userProfile?.gender || preSelectedGender;
    if (activeG) {
      setGenderPref(activeG === 'male' ? 'female' : 'male');
    }
  }, [userProfile, preSelectedGender]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'brides' | 'grooms' | 'professionals'>('all');
  const [selectedStory, setSelectedStory] = useState<MatchProfile | null>(null);
  const [homeTab, setHomeTab] = useState<'discover' | 'cafe'>('cafe');
  
  // Local toast notification system
  const [localToast, setLocalToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 4000);
  };

  // Filter matches dynamically (we guarantee at least 10 men and 10 women per governorate in INITIAL_MATCHES)
  const filteredMatches = useMemo(() => {
    let result = (selectedGov.toLowerCase() === 'all' || selectedGov.toLowerCase() === 'all iraq')
      ? INITIAL_MATCHES
      : INITIAL_MATCHES.filter(m => m.governorate.toLowerCase() === selectedGov.toLowerCase());
    
    // Filter by age range
    result = result.filter(m => m.age >= minAge && m.age <= maxAge);
    
    // Filter by gender preference
    if (genderPref !== 'all') {
      result = result.filter(m => m.gender === genderPref);
    } else {
      const activeG = userProfile?.gender || preSelectedGender;
      if (activeG) {
        const opposite = activeG === 'male' ? 'female' : 'male';
        result = result.filter(m => m.gender === opposite);
      } else {
        // If not logged in, apply category pills (brides / grooms)
        if (activeCategory === 'brides') {
          result = result.filter(m => m.gender === 'female');
        } else if (activeCategory === 'grooms') {
          result = result.filter(m => m.gender === 'male');
        }
      }
    }
    
    if (activeCategory === 'professionals') {
      result = result.filter(m => 
        m.education.toLowerCase().includes('bachelor') || 
        m.education.toLowerCase().includes('doctor') || 
        m.education.toLowerCase().includes('degree') || 
        m.profession.toLowerCase().includes('engineer') || 
        m.profession.toLowerCase().includes('architect') || 
        m.profession.toLowerCase().includes('pharmacist') || 
        m.profession.toLowerCase().includes('cardiologist')
      );
    }
    
    // Return sorted by compatibility score or verification
    const sorted = result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    return sorted;
  }, [selectedGov, activeCategory, userProfile, isProfileIncomplete, minAge, maxAge, genderPref, preSelectedGender]);

  // Featured Active Candidates (filtered active profiles who have been online)
  const featuredCandidates = useMemo(() => {
    const activeG = userProfile?.gender || preSelectedGender;
    
    // Pick 4 outstanding profiles from diverse regions
    const baghdadGroom = INITIAL_MATCHES.find(m => m.governorate === 'Baghdad' && m.gender === 'male' && m.id === 'm1');
    const erbilGroom = INITIAL_MATCHES.find(m => m.governorate === 'Erbil' && m.gender === 'male' && m.id === 'm2');
    const slemaniBride = INITIAL_MATCHES.find(m => m.governorate === 'Sulaymaniyah' && m.gender === 'female' && m.id === 'f1');
    const baghdadBride = INITIAL_MATCHES.find(m => m.governorate === 'Baghdad' && m.gender === 'female' && m.id === 'f2');
    
    const candidates: MatchProfile[] = [];
    
    if (activeG === 'male') {
      // User is male, show brides only
      if (slemaniBride) candidates.push(slemaniBride);
      if (baghdadBride) candidates.push(baghdadBride);
    } else if (activeG === 'female') {
      // User is female, show grooms only
      if (erbilGroom) candidates.push(erbilGroom);
      if (baghdadGroom) candidates.push(baghdadGroom);
    } else {
      // Not selected yet, show both
      if (slemaniBride) candidates.push(slemaniBride);
      if (erbilGroom) candidates.push(erbilGroom);
      if (baghdadBride) candidates.push(baghdadBride);
      if (baghdadGroom) candidates.push(baghdadGroom);
    }
    
    return candidates;
  }, [userProfile, preSelectedGender]);

  // Nearby location candidates based on selected governorate or user's own profile location
  const nearbyMatches = useMemo(() => {
    const userGov = userProfile?.governorate || 'Baghdad';
    const hasFilter = selectedGov && selectedGov !== 'all';

    if (hasFilter) {
      // User explicitly filtered by governorate
      let result = INITIAL_MATCHES.filter(m => m.governorate.toLowerCase() === selectedGov.toLowerCase());
      if (genderPref !== 'all') {
        result = result.filter(m => m.gender === genderPref);
      } else {
        const activeG = userProfile?.gender || preSelectedGender;
        if (activeG) {
          result = result.filter(m => m.gender === (activeG === 'male' ? 'female' : 'male'));
        }
      }
      return result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } else {
      // No explicit governorate filter: show user's governorate first, then make public whoever is available in Iraq
      let nearbyResult = INITIAL_MATCHES.filter(m => m.governorate.toLowerCase() === userGov.toLowerCase());
      let otherResult = INITIAL_MATCHES.filter(m => m.governorate.toLowerCase() !== userGov.toLowerCase());

      let targetGender = genderPref;
      if (targetGender === 'all') {
        const activeG = userProfile?.gender || preSelectedGender;
        if (activeG) {
          targetGender = activeG === 'male' ? 'female' : 'male';
        }
      }

      if (targetGender !== 'all') {
        nearbyResult = nearbyResult.filter(m => m.gender === targetGender);
        otherResult = otherResult.filter(m => m.gender === targetGender);
      }

      nearbyResult = nearbyResult.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      otherResult = otherResult.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      return [...nearbyResult, ...otherResult];
    }
  }, [selectedGov, userProfile, genderPref, preSelectedGender]);

  const getGovDisplayName = (govId: string) => {
    const gov = GOVERNORATE_OPTIONS.find(g => g.id === govId);
    if (!gov) return govId;
    return isEn ? gov.en : isCkb ? gov.ckb : gov.ar;
  };

  const txt = (en: string, ar: string, ckb: string) => {
    return isEn ? en : isCkb ? ckb : ar;
  };

  const handleProfileClick = (candidate: MatchProfile) => {
    if (!isAuthenticated) {
      showToast(txt(
        "💍 Please login or create an account to view deep lifestyle values & send requests!",
        "💍 يرجى تسجيل الدخول أو إنشاء حساب لاستكشاف تفاصيل القيم العائلية والتواصل الجاد!",
        "💍 تکایە سەرەتا بچۆ ژوورەوە یان پڕۆفایل دروست بکە بۆ دیتنی بەهاکان!"
      ));
      setTab('onboarding');
    } else {
      onExploreMatches();
    }
  };

  return (
    <div className="animate-fade-in space-y-10 relative" id="landing-screen">
      
      {/* LOCAL TOAST NOTIFICATION */}
      {localToast && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm bg-warm-charcoal text-white text-xs sm:text-sm p-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-500/25 animate-slide-in">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="font-bold">{localToast}</p>
        </div>
      )}

      {/* HERO SECTION */}
      <Hero
        locale={locale}
        onSelectGender={onSelectGender}
        onExploreMatches={onExploreMatches}
        setTab={setTab}
        isAuthenticated={isAuthenticated}
        userProfileName={userProfileName}
        selectedGov={selectedGov}
        setSelectedGov={setSelectedGov}
        showToast={showToast}
        userProfile={userProfile}
        preSelectedGender={preSelectedGender}
      />

      {/* BUSINESS HERO SECTION (Stunning professional sub-header representing authority, trust, and premium certified Iraqi matrimonial services) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2" id="business-hero-section">
        <div className="bg-gradient-to-br from-[#1C2541] via-[#2F3E46] to-[#1C2541] border border-[#E8DCC4]/30 rounded-[2rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle golden branding lines */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Business Hero Left Column */}
            <div className="lg:col-span-8 text-start space-y-4">
              <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{txt("OFFICIAL PREMIUM DIVISION", "البوابة المهنية الرسمية المعتمدة", "بەشی فەرمی و سەرەکی")}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
                {txt("Licensed, Chaperoned Courtship Services", "الوساطة المهنية المعتمدة للزواج الوقور في العراق", "خزمەتگوزاری فەرمی هاوسەرگیری بەپێی بەها کۆمەڵایەتییەکان")}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed max-w-3xl">
                {txt(
                  "We bridge tradition and modernity. Each applicant undergoes rigorous ID validation and manual lifestyle assessment to guarantee the most sincere, family-supported match pool in all 19 Iraqi governorates.",
                  "نجمع بين الأصالة والحداثة بأسلوب آمن. يخضع كل متقدم لعملية تدقيق وتوثيق شاملة لضمان جدية النوايا وحفظ كرامة وخصوصية العائلات الكريمة في عموم محافظات العراق.",
                  "ئێمە مۆدێرنە و دابونەریت کۆدەکەینەوە بە شێوازێکی بێوەی. هەموو پڕۆفایلەکان پشتڕاست دەکرێنەوە بۆ دڵنیابوون لە ڕاستگۆیی کارەکان لە ١٩ پارێزگاکەی عێراق."
                )}
              </p>

              {/* Core Features list with clean styling */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-semibold text-stone-100">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-lg">💼</span>
                  <div>
                    <p className="font-extrabold text-amber-300">{txt("100% Manual Vetting", "تدقيق بشري كامل", "پداچوونەوەی دەستی ١٠٠٪")}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{txt("Employment & ID checks", "توثيق الهوية والعمل", "پشتڕاستکردنەوەی کار")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <p className="font-extrabold text-amber-300">{txt("Privacy Secured", "خصوصية مصونة", "پاراستنی تەواوی نهێنی")}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{txt("Blur portraits on demand", "تمويه الصور للعرائس", "لێڵکردنی وێنە بەپێی خواست")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-lg">🤝</span>
                  <div>
                    <p className="font-extrabold text-amber-300">{txt("Wali Involvement", "إشراك أولياء الأمور", "ئاگادارکردنەوەی سەرپەرشتیار")}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{txt("Chaperoned introductions", "خطوبة وقورة وعائلية", "پڕۆسەی فەرمی و عائلی")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hero Right Column: stats widget */}
            <div className="lg:col-span-4 bg-white/10 border border-white/15 rounded-2xl p-5 text-center space-y-4 shadow-xl backdrop-blur-md">
              <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest block">
                ⭐ {txt("IRAQ STATISTICS", "مؤشرات النجاح المبارك", "ئامارەکانی سەرکەوتن")}
              </span>
              <div className="grid grid-cols-2 gap-2 text-start">
                <div className="bg-black/20 p-3 rounded-xl">
                  <span className="block text-[8px] font-mono text-stone-400 uppercase">{txt("Verified Applicants", "الأعضاء الموثقون", "کاندیدەکان")}</span>
                  <span className="text-lg font-serif font-black text-white">24,580+</span>
                </div>
                <div className="bg-black/20 p-3 rounded-xl">
                  <span className="block text-[8px] font-mono text-stone-400 uppercase">{txt("Blessed Marriages", "زيجات مباركة", "هاوسەرگیری سەرکەوتوو")}</span>
                  <span className="text-lg font-serif font-black text-emerald-400">1,412+</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-200 font-semibold leading-relaxed text-start flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <p>{txt(
                  "Join our verified circle and discover candidates based on profound cultural, religious, and lifestyle alignment.",
                  "انضم لصفوتنا المباركة واكتشف الشريك الأنسب المتوافق معك عقائدياً وثقافياً واجتماعياً.",
                  "ببەرە ئەندام لە خێزانی پیرۆزمان بۆ دۆزینەوەی شیاوترین هاوسەر."
                )}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- HOME NAVIGATION TABS ----------------- */}
      <section className="sticky top-0 md:top-20 z-40 bg-warm-ivory/95 backdrop-blur-md py-4 border-b border-[#E8DCC4]/50 shadow-xs" id="home-navigation-tabs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF8F5]/80 border border-[#E8DCC4] rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 flex gap-2 shadow-inner">
            
            {/* Tab 1: Marriage Cafe */}
            <button
              onClick={() => {
                setHomeTab('cafe');
                showToast(txt("Entering Marriage Cafe social feed...", "جاري الانتقال لمقهى الزواج التفاعلي...", "چوونە ناو کافێی هاوسەرگیری..."));
              }}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                homeTab === 'cafe'
                  ? 'bg-gradient-to-r from-accent-coral to-accent-pink text-white shadow-lg shadow-accent-coral/25'
                  : 'bg-transparent text-stone-500 hover:text-warm-charcoal hover:bg-stone-50/50'
              }`}
            >
              <Coffee className={`w-4 h-4 sm:w-5 sm:h-5 ${homeTab === 'cafe' ? 'animate-pulse' : ''}`} />
              <span>{txt("Marriage Cafe", "مقهى الزواج", "کافێی هاوسەرگیری")}</span>
              <span className="hidden sm:inline bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-extrabold animate-pulse">
                LIVE FEED
              </span>
            </button>

            {/* Tab 2: Explore Members */}
            <button
              onClick={() => {
                setHomeTab('discover');
                showToast(txt("Opening candidate explorer filters...", "جاري فتح مستكشف الأعضاء...", "کردنەوەی گەڕانی ئەندامان..."));
              }}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                homeTab === 'discover'
                  ? 'bg-gradient-to-r from-[#40798C] to-[#2F5866] text-white shadow-lg shadow-[#40798C]/25'
                  : 'bg-transparent text-stone-500 hover:text-warm-charcoal hover:bg-stone-50/50'
              }`}
            >
              <Compass className={`w-4 h-4 sm:w-5 sm:h-5 ${homeTab === 'discover' ? 'animate-spin-slow' : ''}`} />
              <span>{txt("Explore Members", "استكشاف الأعضاء", "گەڕان بەدوای ئەنداماندا")}</span>
            </button>

          </div>
        </div>
      </section>

      {/* ----------------- DYNAMIC TAB RENDERING ----------------- */}
      {homeTab === 'discover' ? (
        <section className="py-2 space-y-8" id="governorate-matrimonial-portal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* NEARBY CANDIDATES SECTION (BY LOCATION) */}
            <div className="bg-[#FAF7F2] border border-[#E8DCC4] rounded-[2rem] p-5 sm:p-7 space-y-4 shadow-sm text-start">
              <div className="flex justify-between items-center flex-wrap gap-2 text-start">
                <div>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {txt("Active Nearby Candidates", "نشطون بالقرب منك الآن", "کاندیدە چالاکەکانی نزیکت")}
                  </span>
                  <h4 className="text-sm sm:text-lg font-serif font-black text-warm-charcoal flex items-center gap-1 mt-1">
                    <span>📍 {txt(`Candidates Nearby in ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)}`, `عروض مقيمة في ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)}`, `کاندیدە نزیکەکانی ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)}`)}</span>
                  </h4>
                </div>
                <p className="text-[10px] text-stone-500 font-bold max-w-sm">
                  📌 {txt("Based on selected governorate or your profile location.", "تلقائياً حسب موقعك الحالي أو خيار المحافظة المفعّل.", "بەپێی شوێنی دیاریکراو یان پڕۆفایلەکەت.")}
                </p>
              </div>

              {nearbyMatches.length > 0 ? (
                /* Swiper horizontal wrapper styled elegantly for mobile */
                <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin snap-x scroll-smooth">
                  {nearbyMatches.slice(0, 8).map((candidate) => {
                    const isFemale = candidate.gender === 'female';
                    return (
                      <div
                        key={`nearby-${candidate.id}`}
                        onClick={() => handleProfileClick(candidate)}
                        className="snap-start shrink-0 w-64 bg-white hover:bg-[#FCFBF9] border border-stone-200/80 hover:border-accent-coral/30 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between space-y-3 relative group shadow-xs hover:shadow-md cursor-pointer text-start"
                      >
                        <div className="space-y-2">
                          {/* Compact portrait with privacy constraints */}
                          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                            {isFemale ? (
                              <>
                                <img
                                  src={candidate.avatarUrl}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover blur-md scale-110 opacity-90 select-none pointer-events-none"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[4px] flex flex-col items-center justify-center p-2 text-center">
                                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-accent-pink/30 flex items-center justify-center text-accent-pink font-serif font-black text-xs shadow-sm">
                                    {candidate.name.charAt(0)}
                                  </div>
                                  <span className="mt-1 text-[8px] font-bold text-stone-800 bg-white/95 px-1.5 py-0.5 rounded-full shadow-inner">
                                    🔒 {txt("Photo Protected", "الصورة محمية", "وێنە پارێزراوە")}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  src={candidate.avatarUrl}
                                  alt={candidate.name}
                                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 transition duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono font-extrabold text-white bg-black/45 px-1.5 py-0.5 rounded-md">
                                  {txt("Verified", "حساب موثق", "پشتڕاستکراوە")}
                                </span>
                              </>
                            )}

                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                          </div>

                          {/* Candidate basic data */}
                          <div>
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal truncate">
                                {isFemale ? txt(candidate.name, candidate.nameAr, candidate.nameCkb) : candidate.name}
                                <span className="text-[10px] text-stone-400 font-mono"> ({candidate.age})</span>
                              </h5>
                              <span className="text-[8px] font-mono font-black text-[#40798C] bg-[#40798C]/10 px-1.5 py-0.5 rounded">
                                {candidate.compatibilityScore}%
                              </span>
                            </div>
                            <p className="text-[9.5px] font-semibold text-stone-500 truncate flex items-center gap-0.5 mt-0.5">
                              💼 {candidate.profession}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] font-bold text-[#40798C]">
                          <span>📍 {getGovDisplayName(candidate.governorate)}</span>
                          <span className="text-accent-coral flex items-center gap-0.5">
                            <span>{txt("View ➔", "تفاصيل ➔", "بینین ➔")}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E6DCC3]/80">
                  <Users className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-400">
                    {txt(
                      `No active profiles registered in ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)} yet. Try adjusting your gender filter.`,
                      `لا يوجد عرسان أو عرائس مسجلون في ${getGovDisplayName(selectedGov === 'all' ? (userProfile?.governorate || 'Baghdad') : selectedGov)} حالياً.`,
                      `هیچ کاندیدێک لەم شوێنە نییە.`
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-accent-coral/10 text-accent-coral px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              <span>{txt("Governorate Matrimonial Portal", "بوابة المحافظات العراقية للزواج الحلال", "دەروازەی هاوسەرگیری پارێزگاکان")}</span>
            </span>
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black text-warm-charcoal tracking-tight">
              {txt("Find Serious Candidates by Governorate", "ابحث عن شريك العمر حسب المحافظة", "هاوبەشی گونجاو بەپێی پارێزگا بدۆزەوە")}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
              {txt(
                "Select any of the 19 Iraqi governorates to discover serious, verified candidates living nearby. Use our precise filters to explore compatible lifestyles.",
                "اختر أي من المحافظات الـ ١٩ في العراق لاستعراض ملفات جادة وموثقة مقيمة بالقرب منك، واكتشف مدى التوافق الاجتماعي والثقافي.",
                "یەکێک لە ١٩ پارێزگاکەی عێراق دیاری بکە بۆ دۆزینەوەی کەسانی جدی و پشتڕاستکراوە کە لە نزیکتەوە دەژین."
              )}
            </p>
          </div>

          {/* PORTAL INTERACTION BOX */}
          <div className="bg-white/60 backdrop-blur-md border border-[#E8DCC4] rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6 text-start">
            
            {/* CLEAN FILTER AREA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-[#FAF8F5] border border-[#E6DCC3] rounded-3xl p-5 sm:p-6 mb-6">
              
              {/* 1. Governorate Filter */}
              <div className="space-y-2 text-start">
                <label className="block text-xs font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider">
                  📍 {txt("Governorate / Location", "المحافظة أو الموقع", "پارێزگا یان شوێن")}
                </label>
                <div className="relative">
                  <select
                    value={selectedGov || 'all'}
                    onChange={(e) => {
                      setSelectedGov(e.target.value);
                      const name = e.target.value === 'all' 
                        ? txt("All Iraq", "كل العراق", "هەموو عێراق")
                        : getGovDisplayName(e.target.value);
                      showToast(txt(`Location updated: ${name}`, `تم تحديد الموقع: ${name}`, `شوێن دیاریکرا: ${name}`));
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs sm:text-sm font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                  >
                    <option value="all" className="text-warm-charcoal font-black">
                      {txt("🌍 All Iraq", "🌍 كل العراق", "🌍 هەموو عێراق")}
                    </option>
                    {GOVERNORATE_OPTIONS.map((gov) => (
                      <option key={gov.id} value={gov.id} className="text-warm-charcoal font-bold">
                        {locale === 'en' ? gov.en : locale === 'ckb' ? gov.ckb : gov.ar}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-coral" />
                </div>
              </div>

              {/* 2. Age Range Filter */}
              <div className="space-y-2 text-start md:col-span-2">
                <label className="block text-xs font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider flex items-center justify-between">
                  <span>👥 {txt("Required Age Range", "فئة العمر المطلوبة", "تەمەنی داواکراو")}</span>
                  <span className="text-accent-coral font-sans font-extrabold bg-accent-coral/10 px-2 py-0.5 rounded-md text-[10px]">
                    {minAge} - {maxAge} {txt("years old", "سنة", "ساڵ")}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <select
                      value={minAge}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= maxAge) {
                          setMinAge(val);
                        } else {
                          setMinAge(val);
                          setMaxAge(Math.min(80, val + 5));
                        }
                      }}
                      className="w-full pl-8 pr-3 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                    >
                      {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                        <option key={`min-${age}`} value={age} className="font-bold">
                          {txt(`From ${age}`, `من عمر ${age}`, `لە تەمەنی ${age}`)}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={maxAge}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= minAge) {
                          setMaxAge(val);
                        } else {
                          setMaxAge(val);
                          setMinAge(Math.max(18, val - 5));
                        }
                      }}
                      className="w-full pl-8 pr-3 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                    >
                      {Array.from({ length: 53 }, (_, i) => i + 18).map((age) => (
                        <option key={`max-${age}`} value={age} className="font-bold">
                          {txt(`To ${age}`, `إلى عمر ${age}`, `تا تەمەنی ${age}`)}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* 3. Gender / Match Preference Column */}
              <div className="space-y-2 text-start">
                <label className="block text-xs font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider">
                  💖 {txt("I am looking for", "أنا أبحث عن", "من دەگەڕێم بەدوای")}
                </label>
                <div className="relative">
                  <select
                    value={genderPref}
                    onChange={(e) => {
                      setGenderPref(e.target.value as any);
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-white text-warm-charcoal border border-[#E6DCC3] rounded-xl text-xs sm:text-sm font-black outline-none cursor-pointer hover:border-accent-coral/30 transition shadow-inner"
                  >
                    <option value="all" className="font-bold">{txt("All Candidates", "الكل (عرسان وعرائس)", "هەموو کاندیدەکان")}</option>
                    <option value="female" className="font-bold">👰 {txt("Bride (Woman)", "زوجة صالحة (عروس)", "بووک (کچ)")}</option>
                    <option value="male" className="font-bold">🤵 {txt("Groom (Man)", "زوج صالح (عريس)", "زاوا (کوڕ)")}</option>
                  </select>
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-pink" />
                </div>
              </div>

            </div>

            {/* BIG SEARCH EXPLORE ACTION ROW */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-stone-50 to-[#FCFBF9] border border-stone-150 rounded-2xl mb-6">
              <div className="text-start space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-[#40798C] bg-[#40798C]/10 px-2 py-0.5 rounded-full uppercase">
                  ⚡ {txt("Instant Live Filtering", "تصفية حية وفورية للملفات", "پاڵاوتنی ڕاستەوخۆ")}
                </span>
                <p className="text-xs text-stone-600 font-bold leading-snug">
                  {txt(
                    "Displaying real matches below. Click search button below to unlock deep values inside full search page.",
                    "نعرض لك الملفات المتوافقة مع خياراتك بالأسفل مباشرة. اضغط للبحث الكامل لاستكشاف مرشحات إضافية.",
                    "هاوتا ڕاستەقینەکان لە خوارەوە پیشان دەدرێن. بۆ بینینی هەموو فلتەرەکان کلیک بکە."
                  )}
                </p>
              </div>
              
              <button
                onClick={() => {
                  // Save filters into localStorage so they pre-populate the MatchExplorerScreen perfectly
                  localStorage.setItem('home_filter_governorate', selectedGov);
                  localStorage.setItem('home_filter_minAge', String(minAge));
                  localStorage.setItem('home_filter_maxAge', String(maxAge));
                  localStorage.setItem('home_filter_gender', genderPref);
                  
                  // Notify and navigate
                  showToast(txt(
                    "🔍 Opening the advanced matchmaking pool with your filters...",
                    "🔍 جاري فتح بوابة البحث المبارك بالمرشحات التي اخترتها...",
                    "🔍 کردنەوەی دەروازەی هاوسەرگیری بە فلتەرەکانتەوە..."
                  ));
                  
                  setTimeout(() => {
                    onExploreMatches();
                  }, 600);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#40798C] to-[#2F5866] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-[#40798C]/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                id="homepage-main-search-explore-btn"
              >
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
                <span>
                  {txt("Search & Explore Matches", "البحث واستكشاف العروض", "گەڕان و بینینی کاندیدەکان")}
                </span>
                <ArrowRight className="w-4 h-4 text-white transform rtl:rotate-180" />
              </button>
            </div>

            {/* PROFILE INCOMPLETE ALERT BANNER */}
            {isProfileIncomplete && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs animate-fade-in text-start mb-6" id="complete-profile-banner">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <h4 className="text-base sm:text-lg font-serif font-black text-amber-900">
                      {txt("Complete Your Marriage Profile", "أكمل ملف الزواج المبارك", "پڕۆفایلی هاوسەرگیریەکەت تەواو بکە")}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                      {txt("Onboarding Pending", "الملف الشخصي معلّق", "پڕۆفایل چاوەڕوانکراوە")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-800 font-medium leading-relaxed max-w-2xl">
                    {txt(
                      "You can search and explore matches freely. However, to express serious marital interest, send postcards, or build custom serious connections, you must complete your full marriage profile form.",
                      "يمكنك البحث واستكشاف الشركاء بحرية كاملة، ولكن لإرسال طلبات التعارف الجادة والبطاقات البريدية وبدء تواصل وقور، يرجى ملء استمارة ملفك الشخصي بالكامل.",
                      "دەتوانیت کاندیدەکان بە سەربەستی ببینی و بگەڕێیت، بەڵام بۆ دەربڕینی نیەتی جدی هاوسەرگیری یان ناردنی نامەی پێشەکی، دەبێت پڕۆفایلی خۆت بە تەواوی پڕبکەیتەوە."
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setTab('onboarding')}
                  className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/10 active:scale-95 transition shrink-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{txt("Complete Form Now", "أكمل الاستمارة الآن", "ئێستا پڕۆفایلەکە تەواو بکە")}</span>
                </button>
              </div>
            )}

            {/* RESULTS MATCHES GRID */}
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredMatches.slice(0, 8).map((candidate) => {
                  const isFemale = candidate.gender === 'female';

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => handleProfileClick(candidate)}
                      className="group cursor-pointer bg-[#FCFBF9] hover:bg-white border border-[#E6DCC3]/80 hover:border-accent-coral/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4 text-start relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        {/* Avatar photo with forced privacy constraint */}
                        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-inner bg-stone-100 flex items-center justify-center">
                          {isFemale ? (
                            <>
                              {/* FROSTED BLUR FEMALE PORTRAIT - strictly private constraint */}
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.name}
                                className="w-full h-full object-cover blur-lg scale-110 select-none pointer-events-none opacity-85"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[6px] flex flex-col items-center justify-center text-center p-3">
                                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-accent-pink/30 shadow-md flex items-center justify-center text-accent-pink font-serif font-black text-sm">
                                  {candidate.name.charAt(0)}
                                </div>
                                <span className="mt-2.5 text-[9px] font-bold text-stone-800 bg-[#FAF7F2]/90 border border-[#E8DCC4] px-2 py-1 rounded-full shadow-inner tracking-tight">
                                  🔒 {txt("Photo Protected", "الصورة محمية", "وێنە پارێزراوە")}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* REALISTIC IRAQI-LOOKING MALE PORTRAITS - unmodified */}
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.name}
                                className="w-full h-full object-cover grayscale-[12%] group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                              <span className="absolute bottom-2.5 left-2.5 text-[8px] sm:text-[9px] font-mono font-extrabold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                                {txt("Verified Groom", "شاب جاد للزواج", "زاوا پشتڕاستکراوە")}
                              </span>
                            </>
                          )}
                          
                          {/* Top floating badges */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                            {candidate.verified && (
                              <span className="bg-emerald-500 text-white p-1 rounded-full shadow-sm" title="Identity Verified">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Basic details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif font-black text-sm sm:text-base text-warm-charcoal group-hover:text-[#40798C] transition-colors flex items-center gap-1">
                              <span>{isFemale ? txt(candidate.name, candidate.nameAr, candidate.nameCkb) : candidate.name}</span>
                              <span className="text-xs text-[#6B635B] font-medium font-mono">({candidate.age})</span>
                            </h4>
                            <span className="text-[10px] font-mono font-black text-[#40798C] bg-[#40798C]/10 px-2 py-0.5 rounded-md">
                              💖 {candidate.compatibilityScore}%
                            </span>
                          </div>
                          
                          {/* Profession & Education */}
                          <p className="text-[10.5px] font-extrabold text-stone-500 flex items-center gap-1 truncate">
                            <GraduationCap className="w-3.5 h-3.5 text-[#40798C] shrink-0" />
                            <span className="truncate">{candidate.profession}</span>
                          </p>
                          <p className="text-[9.5px] text-stone-400 font-semibold truncate">
                            {candidate.education}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer tags */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-stone-400 font-mono tracking-wider">
                          📍 {txt(candidate.city, candidate.city, candidate.city)}
                        </span>
                        
                        <span className="text-[9.5px] font-bold text-[#40798C] group-hover:text-accent-coral flex items-center gap-0.5 font-sans">
                          <span>{txt("View Sincere Intention", "تفاصيل نية الزواج", "بینینی مەبەست")}</span>
                          <ArrowRight className="w-3 h-3 transform rtl:rotate-180" />
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-[#FAF8F5] rounded-3xl border border-dashed border-[#E6DCC3]/80">
                <Users className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-xs font-bold text-stone-400">
                  {txt("No serious candidates match these categories in this governorate yet.", "لا يوجد عرسان أو عرائس يطابقون هذا التصنيف في هذه المحافظة حالياً.", "کاندیدێک بۆ ئەم جۆرە پۆلێنکردنە لەم پارێزگایەدا نەدۆزرایەوە.")}
                </p>
              </div>
            )}

            {/* CTAs banner to enter search */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <p className="text-start leading-snug">
                💍 {txt(
                  "To protect photos and prevent casual swipe culture, only mutual, serious matches with completed profiles can initiate chaperoned discussion.",
                  "لحماية الخصوصية ومنع المراسلات العشوائية العابرة، يمكن فقط للملفات الحقيقية والمكتملة البدء بالتواصل الوقور تحت إشراف شرعي.",
                  "بۆ پاراستنی وێنەکان، تەنها ئەو کەسانەی پڕۆفایلەکەیان تەواو کردووە دەتوانن پەیوەندی بکەن."
                )}
              </p>
              <button
                onClick={onExploreMatches}
                className="w-full sm:w-auto px-6 py-3 bg-[#40798C] hover:bg-[#316070] text-white font-black text-xs rounded-xl shrink-0 transition active:scale-95 shadow-md shadow-[#40798C]/10 cursor-pointer"
              >
                {txt("Explore Compatibility Pool", "استكشاف مصفوفة التوافق الكاملة", "گەڕان بەدوای هاوشێوەکاندا")}
              </button>
            </div>

          </div>

        </div>
      </section>
      ) : (
        /* Marriage Café Social Media Feed active tab */
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 animate-fade-in" id="marriage-cafe-social-hub">
          <MarriageCafe
            locale={locale}
            triggerToast={showToast}
            onNavigateToTab={setTab}
            isAuthenticated={isAuthenticated}
            userProfileName={userProfileName}
            userProfileGovernorate={userProfile?.governorate || 'Baghdad'}
          />
        </section>
      )}

      {/* FEATURED ACTIVE CANDIDATES PORTRAITS SLIDER (CHALLENGE REQUIREMENT) */}
      <section className="bg-[#FAF7F2] border border-[#E8DCC4] rounded-[2.5rem] py-10" id="featured-active-candidates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-start">
            <div>
              <h4 className="text-base sm:text-xl font-serif font-black text-warm-charcoal flex items-center gap-1.5">
                <UserCheck className="w-5 h-5 text-accent-coral" />
                <span>{txt("Featured Active Candidates", "أعضاء متميزون ونشطون اليوم", "کاندیدە چالاکە دیارەکان")}</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium leading-relaxed">
                {txt(
                  "These active members are looking for lifelong marriage right now. Women's photos are automatically blurred, and men are authentic Iraqi applicants.",
                  "هؤلاء الأعضاء متصلون ويبحثون بنية جادة عن شريك الحياة حالياً. صور النساء محمية بالتمويه تلقائياً، والرجال متقدمون عراقيون أصيلون.",
                  "ئەم ئەندامانە ئێستا چالاکن و بەدوای هاوسەرگیری دەگەڕێن. وێنەی کچان لێڵکراوە بۆ پاراستن و کوڕانیش کاندیدی ڕاستەقینەی عێراقین."
                )}
              </p>
            </div>
            <span className="text-[10px] bg-accent-coral/10 text-accent-coral px-3 py-1 rounded-full font-mono font-extrabold uppercase shrink-0">
              ⚡ {txt("Active Today", "نشطون اليوم", "ئەمڕۆ چالاک بوون")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCandidates.map((candidate) => {
              const isFemale = candidate.gender === 'female';

              return (
                <div 
                  key={candidate.id}
                  onClick={() => handleProfileClick(candidate)}
                  className="bg-white border border-stone-150 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 cursor-pointer hover:shadow-lg transition duration-200 relative group"
                >
                  {/* Photo area */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white bg-stone-100 shadow-md">
                    {isFemale ? (
                      <>
                        <img 
                          src={candidate.avatarUrl} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover blur-md scale-110 select-none pointer-events-none" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[4px] flex items-center justify-center">
                          <span className="text-accent-pink font-serif font-black text-xs">{candidate.name.charAt(0)}</span>
                        </div>
                      </>
                    ) : (
                      <img 
                        src={candidate.avatarUrl} 
                        alt={candidate.name} 
                        className="w-full h-full object-cover grayscale-[10%]" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    {/* Live status dot */}
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Online now" />
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-serif font-black text-xs sm:text-sm text-warm-charcoal group-hover:text-accent-coral transition-colors flex items-center justify-center gap-1">
                      <span>{isFemale ? txt(candidate.name, candidate.nameAr, candidate.nameCkb) : candidate.name}</span>
                      <span className="text-[10px] text-stone-400">({candidate.age})</span>
                    </h5>
                    <p className="text-[9px] font-mono text-stone-500 bg-[#FAF7F2] border border-[#E8DCC4]/50 px-2 py-0.5 rounded-md inline-block">
                      📍 {txt(candidate.governorate, candidate.governorateAr, candidate.governorateCkb)}
                    </p>
                    <p className="text-[10px] font-extrabold text-stone-400 truncate max-w-[140px] mx-auto">
                      {candidate.profession}
                    </p>
                  </div>

                  <span className="text-[8.5px] uppercase font-mono font-extrabold text-[#40798C] bg-[#40798C]/10 px-2 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                    ✨ {txt("Compatible", "متوافق", "هاوتا")}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks locale={locale} />
      
      {/* PHOTO PRIVACY PROTECTION MODULE */}
      <PhotoPrivacyModule locale={locale} />
      
      {/* TRUST AND SAFETY PRINCIPLES */}
      <TrustSafety locale={locale} />

      {/* CORE PHILOSOPHY SECTION */}
      <section className="bg-transparent py-12" id="core-philosophy">
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
                  className="px-8 py-4 rounded-2xl bg-white text-warm-charcoal font-bold hover:bg-warm-ivory transition active:scale-95 shadow-lg shadow-black/10 text-xs sm:text-sm cursor-pointer"
                >
                  {t.philBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA STYLE SQUARE STORY VIEWER MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 bg-[#1C1A17]/85 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#FAF8F5] border border-[#E8DCC4] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col justify-between h-[480px]">
            
            {/* Top progress bar lines simulating Instagram/Snapchat stories */}
            <div className="absolute top-3 left-4 right-4 flex gap-1.5 z-20">
              <div className="h-1 flex-grow bg-accent-coral rounded-full overflow-hidden">
                <div className="h-full bg-white/40 w-full animate-pulse" />
              </div>
              <div className="h-1 flex-grow bg-stone-300 rounded-full" />
              <div className="h-1 flex-grow bg-stone-300 rounded-full" />
            </div>

            {/* Story Header */}
            <div className="pt-7 px-4 pb-3 bg-gradient-to-b from-[#FAF8F5] to-transparent border-b border-stone-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-accent-coral via-accent-pink to-[#40798C]">
                  <div className="w-full h-full rounded-full overflow-hidden border border-white bg-stone-100 flex items-center justify-center">
                    {selectedStory.gender === 'female' ? (
                      <span className="text-accent-pink font-serif font-black text-xs">{selectedStory.name.charAt(0)}</span>
                    ) : (
                      <img src={selectedStory.avatarUrl} alt={selectedStory.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="text-start">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-sm text-warm-charcoal">
                      {selectedStory.name}
                    </span>
                    <span className="text-xs text-stone-500 font-mono font-bold">({selectedStory.age})</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    {txt("Online Now", "نشط الآن بنية جادة", "ئێستا چالاکە")}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedStory(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 text-start scrollbar-thin">
              
              {/* Serious Intention Display */}
              <div className="bg-[#40798C]/5 border border-[#40798C]/15 rounded-2xl p-4 space-y-2 relative">
                <span className="absolute -top-2.5 left-4 bg-[#40798C] text-white text-[8px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  💍 {txt("Serious Marital Intention", "نية الزواج الجادة", "مەبەستی هاوسەرگیری")}
                </span>
                <p className="text-xs sm:text-sm font-serif font-black text-warm-charcoal leading-relaxed pt-1 italic">
                  "{selectedStory.intention || txt("To build a pious and quiet home based on mutual consultation and respect.", "تأسيس بيت صالح وقائم على المودة والرحمة والاحترام المتبادل.", "دروستکردنی خێزانێکی بەختەوەر لەسەر بنەمای ڕێز.")}"
                </p>
              </div>

              {/* About Me & Hobbies */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-[#9C7F59] uppercase tracking-wider">
                    👤 {txt("About Me", "نبذة تعريفية شخصية", "دەربارەی من")}
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed font-semibold mt-1">
                    {selectedStory.aboutMe}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-stone-50 border border-stone-100 rounded-xl p-2.5">
                    <span className="block text-[8px] font-mono font-extrabold text-[#9C7F59] uppercase">
                      💼 {txt("Profession", "المهنة", "پیشە")}
                    </span>
                    <span className="text-[10.5px] font-bold text-warm-charcoal truncate block">
                      {selectedStory.profession}
                    </span>
                  </div>
                  <div className="bg-stone-50 border border-stone-100 rounded-xl p-2.5">
                    <span className="block text-[8px] font-mono font-extrabold text-[#9C7F59] uppercase">
                      📍 {txt("Location", "السكن والموقع", "شوێنی نیشتەجێبوون")}
                    </span>
                    <span className="text-[10.5px] font-bold text-[#40798C] truncate block">
                      {selectedStory.city}, {getGovDisplayName(selectedStory.governorate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Badge / Privacy Guard Note */}
              <div className="bg-[#40798C]/5 border border-emerald-500/10 rounded-xl p-3 flex gap-2.5 items-start">
                <ShieldCheck className="w-4 h-4 text-[#40798C] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-black text-stone-800">
                    {txt("Chaperoned Protocol", "بروتوكول الخطوبة الشرعي", "پڕۆتۆکۆلی شەرعی")}
                  </span>
                  <p className="text-[9px] text-stone-500 font-medium leading-normal">
                    {txt("Profiles are strictly identity-verified. Casual messaging is blocked. Connection occurs under guardian (Wali) supervision.", "الملفات موثقة بالكامل بالهوية الوطنية. لا توجد دردشة عشوائية، التواصل يتم بوقار وتحت إشراف عائلي.", "پڕۆفایلەکان بە تەواوی موثق کراون. چاتی عشوایی قەدەغەیە.")}
                  </p>
                </div>
              </div>

            </div>

            {/* Story Footer actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-3">
              <button
                onClick={() => setSelectedStory(null)}
                className="flex-1 py-3 border border-[#E6DCC3] rounded-xl text-xs font-black text-stone-500 hover:bg-stone-100 transition active:scale-98 cursor-pointer"
              >
                {txt("Go Back", "رجوع", "گەڕانەوە")}
              </button>
              <button
                onClick={() => {
                  setSelectedStory(null);
                  if (!isAuthenticated) {
                    showToast(txt(
                      "💍 Please log in or register to request chaperoned contact.",
                      "💍 يرجى تسجيل الدخول أو إنشاء حساب لطلب تواصل وقور وعائلي.",
                      "💍 تکایە سەرەتا بچۆ ژوورەوە بۆ ناردنی داواکاری."
                    ));
                    setTab('onboarding');
                  } else {
                    showToast(txt(
                      `💍 Intention Match request sent successfully to ${selectedStory.gender === 'female' ? selectedStory.name : selectedStory.name}'s guardian.`,
                      `💍 تم إرسال طلب نية التعارف الشرعي بنجاح إلى ولي أمر الطرف الآخر لمراجعته متبادلاً.`,
                      `💍 داواکارییەکە بە سەرکەوتوویی نێردرا.`
                    ));
                  }
                }}
                className="flex-2 py-3 bg-gradient-to-r from-accent-coral to-accent-pink hover:opacity-95 text-white rounded-xl text-xs font-black shadow-md shadow-accent-coral/10 transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-white" />
                <span>{txt("Send Serious Intention", "إرسال رغبة جادة", "ناردنی مەبەستی جدی")}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
