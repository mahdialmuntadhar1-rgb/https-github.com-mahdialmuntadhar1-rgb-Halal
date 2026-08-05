import React, { useState, useEffect, useMemo } from 'react';
import { MatchProfile, SearchFilters, AppLanguage, UserProfile } from '../types';
import { apiClient } from '../services/apiClient';
import FilterPanel from '../components/FilterPanel';
import MatchCard from '../components/MatchCard';
import MarriageCafeFeed from '../components/MarriageCafeFeed';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import TodayInZawaj from '../components/TodayInZawaj';
import { 
  ShieldCheck, MapPin, Award, BookOpen, User, Star, Book, Heart, Lock, 
  CheckCircle, X, HelpCircle, Languages, AlertCircle, Fingerprint, 
  MessageSquare, ThumbsUp, ThumbsDown, RefreshCw, Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchExplorerScreenProps {
  locale: AppLanguage;
  matches: MatchProfile[];
  onSendRequest: (id: string) => void;
  onInitiateChat: (id: string) => void;
  userGender: 'male' | 'female';
  userGovernorate?: string;
  savedMatchIds?: string[];
  onToggleSaveMatch: (id: string) => void;
  userProfile: UserProfile;
  onUpdateUserProfile: (updated: Partial<UserProfile>) => void;
  onNavigateToTab?: (tab: any) => void;
}

export default function MatchExplorerScreen({
  locale,
  matches,
  onSendRequest,
  onInitiateChat,
  userGender,
  userGovernorate,
  savedMatchIds = [],
  onToggleSaveMatch,
  userProfile,
  onUpdateUserProfile,
  onNavigateToTab
}: MatchExplorerScreenProps) {
  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [blockedMatchIds, setBlockedMatchIds] = useState<string[]>([]);
  const [reportedMatchIds, setReportedMatchIds] = useState<string[]>([]);
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);
  const [blockSuccessMessage, setBlockSuccessMessage] = useState<string | null>(null);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('unserious');

  // Interactive Preference States
  const [activeExplorerTab, setActiveExplorerTab] = useState<'members' | 'cafe'>('members');
  const [browsingMode, setBrowsingMode] = useState<'grid' | 'swipe' | 'saved'>('grid');
  const [passedMatchIds, setPassedMatchIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('passedMatchIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [interestedMatchIds, setInterestedMatchIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('interestedMatchIds');
    return saved ? JSON.parse(saved) : [];
  });

  const handlePass = (id: string) => {
    setPassedMatchIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem('passedMatchIds', JSON.stringify(next));
      return next;
    });
  };

  const handleToggleInterested = (id: string) => {
    setInterestedMatchIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('interestedMatchIds', JSON.stringify(next));
      return next;
    });
  };

  const handleResetPasses = () => {
    setPassedMatchIds([]);
    localStorage.removeItem('passedMatchIds');
  };

  // Default user location is Baghdad if not provided
  const userGov = userGovernorate || 'Baghdad';

  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Bring all matches by default as requested to ensure navigation brings all matches
    const savedMinAge = localStorage.getItem('home_filter_minAge');
    const savedMaxAge = localStorage.getItem('home_filter_maxAge');
    const savedGender = localStorage.getItem('home_filter_gender');

    // Clean up temporary local storage keys to keep them fresh
    localStorage.removeItem('home_filter_governorate');
    localStorage.removeItem('home_filter_minAge');
    localStorage.removeItem('home_filter_maxAge');
    localStorage.removeItem('home_filter_gender');

    const mappedGov = 'All Iraq'; // Force all matches across Iraq initially
    const initialGender = (savedGender as 'male' | 'female' | 'all') || (userGender === 'male' ? 'female' : userGender === 'female' ? 'male' : 'all');

    return {
      gender: initialGender,
      minAge: savedMinAge ? Number(savedMinAge) : 18,
      maxAge: savedMaxAge ? Number(savedMaxAge) : 55,
      locationSearchPreference: 'Across all Iraq',
      governorate: mappedGov,
      city: 'All Cities',
      religion: 'all',
      sect: 'all',
      ethnicity: 'all',
      education: 'All Education Levels',
      profession: 'All Professions',
      seriousness: 'All Seriousness Levels',
      familyValues: 'All Values Styles',
      wantsChildren: 'All',
      smoking: 'All',
      photoVisibility: 'All',
      verifiedOnly: false,
      timeline: 'all',
      sortBy: 'compatibility'
    };
  });

  const handleResetFilters = () => {
    setFilters({
      gender: userGender === 'male' ? 'female' : userGender === 'female' ? 'male' : 'all',
      minAge: 18,
      maxAge: 45,
      locationSearchPreference: 'Across all Iraq',
      governorate: 'All Iraq',
      city: 'All Cities',
      religion: 'all',
      sect: 'all',
      ethnicity: 'all',
      education: 'All Education Levels',
      profession: 'All Professions',
      seriousness: 'All Seriousness Levels',
      familyValues: 'All Values Styles',
      wantsChildren: 'All',
      smoking: 'All',
      photoVisibility: 'All',
      verifiedOnly: false,
      timeline: 'all',
      sortBy: 'compatibility'
    });
  };

  // Enforce gender filter integrity dynamically against user's registered gender
  useEffect(() => {
    if (userGender === 'male' && filters.gender !== 'female') {
      setFilters(prev => ({ ...prev, gender: 'female' }));
    } else if (userGender === 'female' && filters.gender !== 'male') {
      setFilters(prev => ({ ...prev, gender: 'male' }));
    }
  }, [userGender, filters.gender]);

  // Helper to score profile completeness
  const getCompleteness = (m: MatchProfile): number => {
    let score = 0;
    if (m.name) score += 10;
    if (m.age) score += 10;
    if (m.aboutMe) score += 20;
    if (m.intention) score += 15;
    if (m.education) score += 10;
    if (m.profession) score += 10;
    if (m.languages && m.languages.length > 0) score += 10;
    if (m.valuesSummary && m.valuesSummary.length > 0) score += 10;
    if (m.verified) score += 5;
    return score;
  };

  // States for backend pagination and filtering
  const [loadedMatches, setLoadedMatches] = useState<MatchProfile[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async (currentPage: number, currentFilters: SearchFilters, append: boolean = false) => {
    if (currentPage === 1) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const result = await apiClient.getMatches(currentFilters, currentPage, limit);
      if (append) {
        setLoadedMatches((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = result.matches.filter((m) => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setLoadedMatches(result.matches);
      }
      setHasMore(result.hasMore);
    } catch (err: any) {
      console.error("Failed to load matches:", err);
      setError(err.message || "Failed to load candidates");
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  // Reset page and fetch matches on filters change
  useEffect(() => {
    setPage(1);
    fetchMatches(1, filters, false);
  }, [filters]);

  // Sync prop updates (e.g., when request status changes)
  useEffect(() => {
    if (matches && matches.length > 0) {
      setLoadedMatches((prev) => {
        if (prev.length === 0) return matches;
        return prev.map((localMatch) => {
          const propMatch = matches.find((m) => m.id === localMatch.id);
          return propMatch ? { ...localMatch, ...propMatch } : localMatch;
        });
      });
    }
  }, [matches]);

  const isProfileIncomplete = useMemo(() => {
    return !userProfile.age || userProfile.age === 0 || !userProfile.education || !userProfile.profession;
  }, [userProfile]);

  const [dismissProfileReminder, setDismissProfileReminder] = useState(false);

  useEffect(() => {
    // Re-show reminder if profile becomes incomplete again after edits
    if (!isProfileIncomplete) setDismissProfileReminder(false);
  }, [isProfileIncomplete]);

  const incompleteMatches = useMemo(() => {
    const women = matches.filter(m => m.gender === 'female').slice(0, 2);
    const men = matches.filter(m => m.gender === 'male').slice(0, 2);
    return [...women, ...men];
  }, [matches]);

  // Derived matches after applying client-side bookmark filtering and passes if requested
  const displayedMatches = useMemo(() => {
    return (browsingMode === 'saved'
      ? loadedMatches.filter((m) => savedMatchIds.includes(m.id))
      : loadedMatches
    ).filter((m) => !blockedMatchIds.includes(m.id) && !passedMatchIds.includes(m.id));
  }, [loadedMatches, browsingMode, savedMatchIds, blockedMatchIds, passedMatchIds]);

  // Saved portfolios match list (unfiltered by passes)
  const savedMatches = useMemo(() => {
    return loadedMatches.filter((m) => 
      savedMatchIds.includes(m.id) && !blockedMatchIds.includes(m.id)
    );
  }, [loadedMatches, savedMatchIds, blockedMatchIds]);

  // Active swipe matches remaining (unpassed, unblocked)
  const swipeMatches = useMemo(() => {
    return loadedMatches.filter((m) => 
      !blockedMatchIds.includes(m.id) && !passedMatchIds.includes(m.id)
    );
  }, [loadedMatches, blockedMatchIds, passedMatchIds]);

  // Synchronized view for selected match to capture live state changes
  const activeSelectedMatch = selectedMatch 
    ? loadedMatches.find(m => m.id === selectedMatch.id) || selectedMatch
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="match-explorer-screen">
      
      {/* Unified Hero Section - stays persistent at the top */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-5">
        <div className="space-y-1 text-start">
          <span className="text-[10px] tracking-[0.2em] font-extrabold text-[#9c9389] uppercase block font-sans">
            {txt("HALAL ZAWAJ ISLAMIC PORTAL", "زواج حلال توافق حلال", "هاوسەرگیری حەڵاڵ گونجانی حەڵاڵ")}
          </span>
          <h1 className="text-2xl sm:text-4.5xl font-black text-[#22201E] font-serif tracking-tight">
            {activeExplorerTab === 'members' 
              ? txt("Recommended Partners", "الشركاء الموصى بهم", "هاوبەشە پێشنیارکراوەکان")
              : txt("Marriage Café", "كافيه الزواج وقور", "کافێی هاوسەرگیری")}
          </h1>
          <p className="text-stone-500 text-xs sm:text-[13px] font-medium leading-relaxed max-w-3xl">
            {activeExplorerTab === 'members'
              ? txt(
                  "These verified profiles correspond to your religious, family, and educational goals. Select \"View Profile\" to understand their full biography before initiating any formal contact.",
                  "تتطابق هذه الملفات الشخصية الموثقة مع أهدافك الدينية والعائلية والتعليمية. اختر \"عرض الملف الشخصي\" لفهم سيرتهم الذاتية الكاملة قبل بدء أي اتصال رسمي.",
                  "ئەم پڕۆفایلە پشتڕاستکراوانە لەگەڵ ئامانجە ئاینی و خێزانی و پەروەردەییەکانت دەگونجێن. \"بینینی پڕۆفایل\" دیاریبکە بۆ تێگەیشتن لە ژیاننامەی تەواویان پێش دەستپێکردنی هەر پەیوەندییەکی فەرمی."
                )
              : txt(
                  "A warm, respectful, and family-friendly public space where serious Iraqi members share thoughts, ask questions, and discuss marriage with pure matrimonial intentions.",
                  "مساحة عامة دافئة ومحترمة ومناسبة للعائلات حيث يشارك الأعضاء العراقيون الجادون أفكارهم ويطرحون الأسئلة ويناقشون الزواج بنوايا شريفة.",
                  "شوێنێکی گشتی گەرم، بەڕێز و گونجاو بۆ خێزانەکان کە تێیدا ئەندامە جدییەکان بیروڕاکانیان بڵاودەکەنەوە و باس لە هاوسەرگیری دەکەن بە شێوازێکی شەرعی."
                )}
          </p>
        </div>

        {/* Outer Tab switch controllers */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200/40 shrink-0 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveExplorerTab('members')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 ${
              activeExplorerTab === 'members'
                ? 'bg-white text-[#22201E] shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>{txt("Members", "الأعضاء", "ئەندامان")}</span>
          </button>
          <button
            onClick={() => setActiveExplorerTab('cafe')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition duration-200 ${
              activeExplorerTab === 'cafe'
                ? 'bg-white text-[#22201E] shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{txt("Marriage Café", "كافيه الزواج", "کافێی زواج")}</span>
            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0">
              New
            </span>
          </button>
        </div>
      </div>

      {activeExplorerTab === 'cafe' ? (
        <MarriageCafeFeed 
          locale={locale}
          userProfile={userProfile}
        />
      ) : (
        <>
          {/* Search Filters Config Panel */}
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            handleResetFilters={handleResetFilters}
            filteredCount={
              browsingMode === 'saved' ? savedMatches.length :
              browsingMode === 'swipe' ? swipeMatches.length :
              displayedMatches.length
            }
            locale={locale}
            userGender={userGender}
            hideHeader={true}
          />

      {/* Demo Warning Label */}
      {apiClient.isDemoMode() ? (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl p-3.5 text-center text-xs flex flex-col sm:flex-row items-center justify-center gap-2 font-mono">
          <span className="font-bold flex items-center gap-1 shrink-0">
            ⚠️ {locale === 'en' ? 'Demo profiles only' : locale === 'ar' ? 'ملفات تجريبية فقط' : 'تەنها پڕۆفایلی تاقیکاری'}
          </span>
          <span className="opacity-80">
            {locale === 'en' 
              ? 'Connecting to virtual simulation sandbox. Toggle to force real backend mode in Account settings.' 
              : locale === 'ar' 
              ? 'متصل ببيئة المحاكاة الافتراضية. يمكنك تغيير وضع التشغيل من إعدادات الحساب.' 
              : 'پەیوەستە بە دۆخی تاقیکاری بەڕێوەبردن. دەتوانیت دۆخی کارکردن لە ڕێکخستنەکانی هەژمارەکە بگۆڕیت.'}
          </span>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl p-3.5 text-center text-xs flex flex-col sm:flex-row items-center justify-center gap-2 font-mono">
          <span className="font-bold flex items-center gap-1 shrink-0">
            🛡️ {locale === 'en' ? 'Live Matches Mode Active' : locale === 'ar' ? 'وضع البحث المباشر نشط' : 'دۆخی گەڕانی ڕاستەوخۆ چالاکە'}
          </span>
          <span className="opacity-80">
            {locale === 'en' 
              ? 'Browsing real active users from the backend production database.' 
              : locale === 'ar' 
              ? 'تتصفح حالياً حسابات حقيقية ونشطة من قاعدة بيانات الإنتاج.' 
              : 'ئێستا پڕۆفایلە ڕاستەقینە و چالاکەکان دەبینیت لە بنکەی زانیاریيەکانی سێرڤەر.'}
          </span>
        </div>
      )}

      {/* Non-blocking profile completion reminder — browse remains available */}
      {isProfileIncomplete && !dismissProfileReminder ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs animate-fade-in text-start" id="complete-profile-banner">
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-serif font-black text-amber-900">
              {txt("Complete your profile to improve your matches.", "أكمل ملفك الشخصي لتحسين نتائج التوافق.", "پڕۆفایلەکەت تەواو بکە بۆ باشترکردنی هاوتاکان.")}
            </h4>
            <p className="text-xs sm:text-sm text-amber-800/90 font-medium leading-relaxed max-w-2xl">
              {txt(
                "You can keep browsing recommended partners. Completing your profile helps better matching when you are ready.",
                "يمكنك متابعة تصفح الشركاء الموصى بهم. إكمال الملف يحسّن التوافق عندما تكون جاهزاً.",
                "دەتوانیت بەردەوام بیت لە بینینی هاوبەشەکان. تەواوکردنی پڕۆفایل هاوتاکردن باشتر دەکات کاتێک ئامادە بیت."
              )}
            </p>
          </div>
          <div className="flex w-full md:w-auto flex-col sm:flex-row gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToTab && onNavigateToTab('onboarding')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/10 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-300 animate-pulse fill-amber-300" />
              <span>{txt("Complete Profile", "أكمل الملف", "پڕۆفایل تەواو بکە")}</span>
            </button>
            <button
              type="button"
              onClick={() => setDismissProfileReminder(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/80 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm hover:bg-white active:scale-95 transition cursor-pointer"
            >
              {txt("Later", "لاحقاً", "دواتر")}
            </button>
          </div>
        </div>
      ) : !isProfileIncomplete ? (
        <ProfileCompletionCard
          locale={locale}
          userProfile={userProfile}
          onUpdateProfile={onUpdateUserProfile}
        />
      ) : null}

      {/* Governorate Selector Reminder Notice */}
      {filters.governorate === 'All Iraq' && (
        <div className="bg-gradient-to-r from-purple-500/10 via-accent-pink/5 to-transparent border border-purple-500/25 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-start shadow-[0_0_15px_rgba(147,51,234,0.1)] animate-fade-in" id="governorate-narrow-reminder">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 text-accent-pink text-lg">
              📍
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                {txt(
                  "All Matches Loaded Across Iraq",
                  "تم عرض كافة العروض في جميع محافظات العراق",
                  "هەموو هاوتاکان لە سەرتاسەری عێراق نیشاندراون"
                )}
              </p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {txt(
                  "Showing all 19 governorates. We recommend using the governorate selector dropdown in the filters panel to find candidates closest to you.",
                  "يتم حالياً عرض كافة المحافظات الـ 19. ننصحك باستخدام منتقي المحافظات في لوحة التصفية بالأعلى لتضييق البحث حسب منطقتك.",
                  "ئێستا هەموو ١٩ پارێزگاکە پیشان دەدرێن. پێشنیار دەکەین فلتەری پارێزگاکان لە سەرەوە بەکاربهێنیت بۆ دیاریکردنی ناوچەکەت."
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-accent-pink hover:opacity-95 text-white font-black text-xs rounded-xl transition shrink-0 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>⚙️</span>
            <span>{txt("Select Governorate", "تحديد المحافظة", "دیاریکردنی پارێزگا")}</span>
          </button>
        </div>
      )}



      {/* Browsing modes tabs (Grid vs Swipe Deck vs Saved portfolios) */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-stone-200 text-left">
        <button
          onClick={() => {
            setBrowsingMode('grid');
            setShowSavedOnly(false);
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
            browsingMode === 'grid'
              ? 'bg-warm-charcoal text-white shadow-sm'
              : 'bg-stone-50 border text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>📋 {txt('Grid Feed', 'شبكة العرض', 'تۆڕی نیشاندان')}</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-center shrink-0">
            {displayedMatches.length}
          </span>
        </button>

        <button
          onClick={() => {
            setBrowsingMode('swipe');
            setShowSavedOnly(false);
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
            browsingMode === 'swipe'
              ? 'bg-accent-coral text-white shadow-sm font-black'
              : 'bg-stone-50 border text-accent-coral hover:bg-stone-100'
          }`}
          id="interactive-swipe-deck-tab"
        >
          <span>⚡ {txt('Interactive Swipe Matcher', 'مُطابق بطاقات التعارف', 'مۆدی دەستکاریکردنی خێرا')}</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-center shrink-0 animate-pulse">
            {swipeMatches.length}
          </span>
        </button>

        <button
          onClick={() => {
            setBrowsingMode('saved');
            setShowSavedOnly(true);
          }}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
            browsingMode === 'saved'
              ? 'bg-[#40798C] text-white shadow-sm'
              : 'bg-stone-50 border text-[#40798C] hover:bg-stone-100'
          }`}
          id="saved-portfolios-tab"
        >
          <span>⭐ {txt('Saved Portfolios', 'المدونات المحفوظة', 'پارێزراوەکان')}</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-center shrink-0">
            {savedMatches.length}
          </span>
        </button>
      </div>

      {/* Grid of Match Dossier Cards or Loading/Error/Empty States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse" id="matches-loading-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/60 border border-stone-200 rounded-[2rem] p-5 h-[340px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-200 mx-auto" />
                <div className="h-4 bg-stone-200 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-stone-200 rounded w-1/2 mx-auto" />
              </div>
              <div className="h-8 bg-stone-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-6 text-center max-w-lg mx-auto space-y-3" id="matches-error-state">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-bold text-base">{txt('Failed to load matches', 'فشل في تحميل الملفات المطابقة', 'کێشە لە بارکردنی پڕۆفایلەکان')}</h3>
          <p className="text-xs text-stone-500">{error}</p>
          <button
            onClick={() => fetchMatches(page, filters, false)}
            className="px-4 py-2 bg-[#40798C] text-white font-bold rounded-xl text-xs hover:bg-[#346271] transition"
          >
            {txt('Try Again', 'إعادة المحاولة', 'دووبارە هەوڵ بدەرەوە')}
          </button>
        </div>
      ) : browsingMode === 'swipe' ? (
        swipeMatches.length === 0 ? (
          <EmptyState
            title={txt('All Candidates Reviewed', 'اكتملت مراجعة جميع بطاقات المترشحين', 'هەموو بەربژێرەکان بینران')}
            description={txt(
              'You have reviewed all available candidate portfolios in this region. You can reset your passed candidates to start over, or expand your filters above.',
              'لقد تصفحت كامل الخيارات المتاحة حالياً وفقاً لمعاييرك المحددة. يمكنك تصفير الملفات التي تجاوزتها والبدء من جديد، أو توسيع نطاق البحث.',
              'تۆ سەیری هەموو پڕۆفایلە بەردەستەکانت کردووە. دەتوانیت لیستەکە نوێ بکەیتەوە بۆ دەستپێکردنەوە.'
            )}
            actionText={txt('Reset Passed Candidates ↺', 'تصفير الملفات المتجاوزة ↺', 'نوێکردنەوەی پڕۆفایلەکان ↺')}
            onAction={handleResetPasses}
          />
        ) : (
          <div className="max-w-md mx-auto space-y-4" id="swipe-matcher-deck">
            {/* Header progress stats */}
            <div className="text-center font-mono text-[10px] uppercase tracking-widest text-stone-500 font-bold bg-stone-100/60 py-1.5 px-3 rounded-full inline-block mx-auto">
              ⚡ {txt(`Candidate 1 of ${swipeMatches.length} available`, `المترشح الأول من أصل ${swipeMatches.length} متاحين`, `بەربژێری یەکەم لە کۆی ${swipeMatches.length}`)}
            </div>

            {/* Visual Polaroid Physical Stack container */}
            <div className="relative pt-2 pb-6">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={swipeMatches[0].id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(event, info) => {
                    const topMatch = swipeMatches[0];
                    if (info.offset.x > 140) {
                      // Marked as interested, and pass/remove from active stack
                      if (!interestedMatchIds.includes(topMatch.id)) {
                        handleToggleInterested(topMatch.id);
                      }
                      handlePass(topMatch.id);
                    } else if (info.offset.x < -140) {
                      // Pass candidate
                      handlePass(topMatch.id);
                    }
                  }}
                  whileDrag={{ scale: 1.02, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative cursor-grab active:cursor-grabbing bg-white border border-[#E3D6C0] rounded-[2.5rem] p-5 shadow-xl select-none z-10"
                >
                  {/* Visual direction stamp overlays while dragging */}
                  <div className="absolute top-6 left-6 -rotate-12 pointer-events-none opacity-0 hover:opacity-10 transition-opacity">
                    <span className="border-4 border-dashed border-red-500 text-red-500 font-black text-xs px-2.5 py-1 uppercase rounded tracking-widest">PASS</span>
                  </div>
                  <div className="absolute top-6 right-6 rotate-12 pointer-events-none opacity-0 hover:opacity-10 transition-opacity">
                    <span className="border-4 border-dashed border-emerald-500 text-emerald-500 font-black text-xs px-2.5 py-1 uppercase rounded tracking-widest">INTEREST</span>
                  </div>

                  <MatchCard
                    match={swipeMatches[0]}
                    locale={locale}
                    onSendRequest={onSendRequest}
                    onInitiateChat={onInitiateChat}
                    onOpenDetails={(profile) => setSelectedMatch(profile)}
                    savedMatchIds={savedMatchIds}
                    onToggleSaveMatch={onToggleSaveMatch}
                    isInterested={interestedMatchIds.includes(swipeMatches[0].id)}
                    onToggleInterested={handleToggleInterested}
                    onPass={handlePass}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Stack effect background layers */}
              {swipeMatches.length > 1 && (
                <div className="absolute top-4 inset-x-4 h-[95%] bg-stone-50 border border-stone-200/50 rounded-[2rem] shadow-sm transform rotate-1 scale-98 pointer-events-none -z-10" />
              )}
              {swipeMatches.length > 2 && (
                <div className="absolute top-6 inset-x-8 h-[90%] bg-stone-100/50 border border-stone-200/20 rounded-[2rem] shadow-2xs transform -rotate-1 scale-96 pointer-events-none -z-25" />
              )}
            </div>

            {/* Drag helper guide line */}
            <p className="text-[10px] text-center font-serif text-stone-400 italic">
              💡 {txt('Tip: Drag card left to Pass, right to express Interest!', 'تلميح: اسحب البطاقة لليسار للتجاوز، ولليمين للتعبير عن الاهتمام!', 'تێبینی: ڕاکێشانی کارت بۆ لای چەپ بۆ تێپەڕاندنە، بۆ ڕاست بۆ ئارەزوومەندییە!')}
            </p>
          </div>
        )
      ) : displayedMatches.length === 0 ? (
        browsingMode === 'saved' ? (
          <EmptyState
            title={txt('Your Bookmarks are Empty', 'لا توجد محفوظات عائلية حالياً', 'هیچ پڕۆفایلێکی پاشەکەوتکراو نییە')}
            description={txt(
              'Click the gold Star icon on any candidate’s card while browsing to save their portfolio here for careful reflection.',
              'انقر رمز النجمة الذهبية في زاوية ملف أي عائلات لتجدها مؤرشفة هنا للتدبر اللاحق والتأمل الوقور.',
              'کلیک لەسەر ئەستێرەی زێڕین بکە لەسەر پڕۆفایلەکان بۆ پاشەکەوتکردنیان لێرە.'
            )}
            actionText={txt('Browse All Candidates', 'عرض كامل الأعضاء', 'بابەتە جیاوازەکان ببینی')}
            onAction={() => {
              setBrowsingMode('grid');
              setShowSavedOnly(false);
            }}
          />
        ) : (
          <EmptyState
            title={locale === 'en' ? 'No compatible dossiers found' : 'لم يتم العثور على ملفات متوافقة'}
            description={locale === 'en' ? 'Try adjusting your filters (Age, Governorate, Marital Status) to find compatible matches.' : 'حاول تعديل خيارات التصفية (العمر، المحافظة، الحالة الاجتماعية) للعثور على عروض متوافقة.'}
          />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="members-grid-container">
          {displayedMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              locale={locale}
              onSendRequest={onSendRequest}
              onInitiateChat={onInitiateChat}
              onOpenDetails={(profile) => setSelectedMatch(profile)}
              savedMatchIds={savedMatchIds}
              onToggleSaveMatch={onToggleSaveMatch}
            />
          ))}
        </div>
      )}      {/* Premium Structured Courtship Portfolio detail modal (Highly customized for Zawaj Al Araqi) */}
      <AnimatePresence>
        {activeSelectedMatch && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E2F]/65 backdrop-blur-md overflow-y-auto" 
            id="premium-courtship-modal-overlay"
          >
            {/* Click backdrop to close */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={() => {
                setSelectedMatch(null);
                setReportSuccessMessage(null);
                setBlockSuccessMessage(null);
                setShowReportDialog(false);
              }} 
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-4xl bg-white border border-[#C77DFF]/40 rounded-[2rem] shadow-[0_15px_50px_rgba(157,77,255,0.18)] relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
              id="premium-courtship-modal-container"
            >
              {/* Header Bar */}
              <div className="bg-gradient-to-r from-[#F8F5FF] to-white border-b border-[#C77DFF]/20 px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-start">
                  <div className="w-2 h-2 rounded-full bg-[#FF4FD8] animate-ping" />
                  <h3 className="text-lg font-serif font-black text-[#1E1E2F]">
                    {txt(`${activeSelectedMatch.name}'s Courtship Portfolio`, `الملف التعريفي للخطوبة: ${activeSelectedMatch.name}`, `پۆرتفۆلیۆی هاوسەرگیری تێر و تەسەلی ${activeSelectedMatch.name}`)}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setSelectedMatch(null);
                    setReportSuccessMessage(null);
                    setBlockSuccessMessage(null);
                    setShowReportDialog(false);
                  }}
                  className="p-2 rounded-full bg-white hover:bg-[#F8F5FF] border border-[#C77DFF]/30 text-[#9D4DFF] hover:text-[#FF4FD8] transition-all duration-300 shadow-sm cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left custom-scrollbar flex-1 bg-gradient-to-b from-[#F8F5FF]/40 to-white">
                
                {/* Feedback Banners for Block/Report actions */}
                {blockSuccessMessage && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2.5 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{blockSuccessMessage}</span>
                  </div>
                )}

                {reportSuccessMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5 animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{reportSuccessMessage}</span>
                  </div>
                )}

                {/* Main Profile Showcase Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Polaroid Image Frame & Online Status */}
                  <div className="md:col-span-5 flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white shadow-lg border border-[#C77DFF]/30 rounded-2xl w-full max-w-[280px] hover:scale-[1.02] transition-all duration-300 relative">
                      
                      {/* Photo Canvas */}
                      <div className="aspect-[4/5] w-full bg-stone-100 rounded-xl overflow-hidden relative shadow-inner">
                        {activeSelectedMatch.photoStatus === 'hidden' && activeSelectedMatch.requestStatus !== 'accepted' ? (
                          <div className="w-full h-full bg-gradient-to-br from-[#ECE8E1] via-[#E1DDD5] to-[#D5CFB9] flex flex-col items-center justify-center p-4 text-center">
                            <Lock className="w-8 h-8 text-[#9D4DFF] mb-2 animate-bounce" />
                            <p className="text-xs text-[#1E1E2F] font-black uppercase tracking-wider">
                              {txt('Photo Hidden', 'الصورة مخفية', 'وێنە شاراوەیە')}
                            </p>
                            <p className="text-[10px] text-stone-500 mt-1">
                              {txt('Unlocked upon match approval', 'تظهر عند الموافقة المتبادلة', 'دەکرێتەوە دوای پەسەندکردنی دوولایەنە')}
                            </p>
                          </div>
                        ) : activeSelectedMatch.photoStatus === 'initials' && activeSelectedMatch.requestStatus !== 'accepted' ? (
                          <div className="w-full h-full bg-gradient-to-br from-[#F8F5FF] via-[#EBE5FF] to-[#DFD5FF] flex flex-col items-center justify-center p-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-[#9D4DFF] font-serif font-black text-3xl border border-[#C77DFF]/30 mb-2">
                              {activeSelectedMatch.name ? activeSelectedMatch.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <p className="text-xs text-stone-600 font-bold uppercase tracking-wider">
                              {txt('Protected Initials', 'حماية خصوصية الهوية', 'پاراستنی ناونیشانی سەرەتایی')}
                            </p>
                          </div>
                        ) : (
                          <>
                            <img
                              src={activeSelectedMatch.avatarUrl}
                              alt={activeSelectedMatch.name}
                              className={`w-full h-full object-cover transition-all duration-700 ${
                                activeSelectedMatch.photoStatus === 'blurred' && activeSelectedMatch.requestStatus !== 'accepted' ? 'filter blur-[16px]' : ''
                              }`}
                              referrerPolicy="no-referrer"
                            />
                            {activeSelectedMatch.photoStatus === 'blurred' && activeSelectedMatch.requestStatus !== 'accepted' && (
                              <div className="absolute inset-0 bg-[#1E1E2F]/40 flex flex-col items-center justify-center p-4 text-center">
                                <div className="bg-white/95 p-2 rounded-full shadow-md mb-2 border border-[#C77DFF]/30">
                                  <Lock className="w-5 h-5 text-[#FF4FD8]" />
                                </div>
                                <p className="text-xs text-white font-extrabold uppercase tracking-widest bg-stone-900/40 px-2 py-0.5 rounded backdrop-blur-xs">
                                  {txt('Photo Protected', 'صورة شخصية مصانة', 'وێنەی پارێزراو')}
                                </p>
                                <p className="text-[10px] text-white/90 mt-1 max-w-[160px] leading-tight">
                                  {txt('Unlocks automatically upon mutual request acceptance.', 'تنفك الحماية تلقائياً فور القبول المشترك للطلب.', 'بە شێوەیەکی ئۆتۆماتیکی دەکرێتەوە لەکاتی وەرگرتنی داواکاری لەلایەن هەردوولاوە.')}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Live Online Status */}
                        {activeSelectedMatch.isOnline && (
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{txt('Active Now', 'متصل الآن', 'ئێستا چالاکە')}</span>
                          </div>
                        )}
                      </div>

                      {/* Handwritten-Style Label */}
                      <div className="pt-3 text-center border-t border-dashed border-[#C77DFF]/20 mt-2">
                        <span className="font-serif font-black text-lg text-[#1E1E2F] block tracking-tight">
                          {activeSelectedMatch.name}, <span className="font-sans text-stone-500 font-normal">{activeSelectedMatch.age}</span>
                        </span>
                        <span className="text-xs font-medium text-stone-500 block mt-0.5 flex items-center justify-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#9D4DFF]" />
                          <span>{activeSelectedMatch.city}, {activeSelectedMatch.governorate}</span>
                        </span>
                      </div>

                    </div>

                    {/* Dynamic Privacy Setting Badge */}
                    <div className="p-3 bg-[#F8F5FF] border border-[#C77DFF]/30 rounded-xl text-xs w-full max-w-[280px]">
                      <div className="flex items-center gap-1.5 font-bold text-[#9D4DFF] mb-1">
                        <span>🔒</span>
                        <span>{txt('Privacy Level', 'مستوى الخصوصية', 'ئاستی تایبەتمەندی')}</span>
                      </div>
                      <p className="text-[#1E1E2F] font-semibold text-[11px]">
                        {activeSelectedMatch.privacyLevel || txt('Standard (Verified Members Only)', 'اعتيادي (للأعضاء الموثقين فقط)', 'ئاسایی (بۆ ئەندامانی سەلمێنراو تەنها)')}
                      </p>
                    </div>

                    {/* Sharia Contact Privacy Notice */}
                    <div className="p-3 bg-rose-50/50 border border-[#FF4FD8]/20 rounded-xl text-[10px] leading-relaxed text-[#1E1E2F]/80 w-full max-w-[280px]">
                      <p className="font-bold text-[#FF4FD8] mb-1 flex items-center gap-1">
                        <span>🛡️</span> {txt('Islamic Privacy Shield', 'درع الخصوصية الشرعي', 'مەڵبەندی پاراستنی تایبەتمەندی')}
                      </p>
                      {txt(
                        'Direct contact channels (phone, email, WhatsApp, wali details) are strictly masked. Communication is only authorized via secure app chat upon mutual consent.',
                        'قنوات الاتصال المباشرة (رقم الهاتف، واتساب، معلومات ولي الأمر) مخفية تماماً. التواصل متاح فقط عبر الدردشة الآمنة في التطبيق بعد قبول الطلب شرعياً.',
                        'پەیوەندی ڕاستەوخۆ (ژمارەی مۆبایل، واتسئەپ، زانیاری ولی الامر) بە تەواوی شاردراوەتەوە. تەنها لە ڕێگەی چاتی پارێزراوی ئەپەکەوە دەبێت دوای پەسەندکردنی داواکاری.'
                      )}
                    </div>
                  </div>

                  {/* Right Column: In-Depth Biography & Credentials */}
                  <div className="md:col-span-7 space-y-4">
                    
                    {/* Section 1: Demographics & Spiritual Identity */}
                    <div className="bg-white border border-[#C77DFF]/35 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#9D4DFF]/5 rounded-bl-full pointer-events-none" />
                      <h4 className="text-xs font-black text-[#9D4DFF] uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-[#C77DFF]/15 pb-1.5">
                        <User className="w-4 h-4 text-[#FF4FD8]" />
                        <span>{txt('Spiritual & Personal Status', 'الهوية الشخصية والمذهب', 'ناسنامەی کەسی و مەزهەبی')}</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Religion', 'الديانة', 'ئاین')}</span>
                          <span className="font-bold text-[#1E1E2F] capitalize">{activeSelectedMatch.religion === 'islam' ? txt('Islam', 'الإسلام', 'ئیسلام') : txt('Other', 'ديانة أخرى', 'ئایینی تر')}</span>
                        </div>
                        {activeSelectedMatch.sect && (
                          <div>
                            <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Islamic Sect', 'المذهب الإسلامي', 'مەزهەبی ئیسلامی')}</span>
                            <span className="font-bold text-[#9D4DFF] capitalize">
                              {activeSelectedMatch.sect === 'sunni' ? txt('Sunni', 'أهل السنة', 'سوننە') : txt('shiaa', 'الشيعة', 'شیعە')}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Ethnicity', 'القومية', 'نەتەوە')}</span>
                          <span className="font-bold text-[#FF4FD8] capitalize">
                            {activeSelectedMatch.ethnicity === 'arab' ? txt('Arab', 'عربي', 'عەرەب') : activeSelectedMatch.ethnicity === 'kurdish' ? txt('Kurdish', 'كوردي', 'کورد') : txt('Others', 'قوميات أخرى', 'هیتر')}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Marital Status', 'الحالة الاجتماعية', 'بارودۆخی خێزانی')}</span>
                          <span className="font-bold text-[#1E1E2F] capitalize">{activeSelectedMatch.maritalStatus || txt('Never Married', 'أعزب/لم يسبق له الزواج', 'هاوسەرگیری نەکردووە')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Biography & Intention (Full details) */}
                    <div className="bg-white border border-[#C77DFF]/35 rounded-2xl p-4 shadow-sm space-y-3">
                      <h4 className="text-xs font-black text-[#FF4FD8] uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-[#C77DFF]/15 pb-1.5">
                        <BookOpen className="w-4 h-4 text-[#9D4DFF]" />
                        <span>{txt('About & Marriage Expectations', 'التعريف ورؤية الزواج المتبادلة', 'ناساندن و ڕوانینی هاوسەرگیری')}</span>
                      </h4>
                      <div className="space-y-3.5">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono mb-1">{txt('Personal Message Note', 'رسالة التعريف الشخصية', 'نامەی ناساندنی کەسي')}</span>
                          <p className="text-xs leading-relaxed text-[#1E1E2F] bg-[#F8F5FF] p-3.5 rounded-xl border border-[#C77DFF]/20 italic font-serif">
                            "{activeSelectedMatch.aboutMe}"
                          </p>
                        </div>
                        {activeSelectedMatch.intention && (
                          <div>
                            <span className="text-stone-400 block text-[9px] uppercase font-mono mb-1">{txt('Marital Intentions', 'أهداف ومآرب الزواج', 'خواستەکانی هاوسەرگیری')}</span>
                            <p className="text-xs leading-relaxed text-[#1E1E2F] bg-rose-50/40 p-3.5 rounded-xl border border-rose-100 italic font-sans">
                              "{activeSelectedMatch.intention}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Professional & Intellectual Dossier */}
                    <div className="bg-white border border-[#C77DFF]/35 rounded-2xl p-4 shadow-sm space-y-3">
                      <h4 className="text-xs font-black text-[#1E1E2F] uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-[#C77DFF]/15 pb-1.5">
                        <Award className="w-4 h-4 text-[#FF4FD8]" />
                        <span>{txt('Professional & Intellectual Dossier', 'المستوى العلمي والعملي', 'ئاستی زانستی و کارکردن')}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Education level', 'التحصيل الأكاديمي', 'ئاستی خوێندن')}</span>
                          <span className="font-bold text-[#1E1E2F]">{activeSelectedMatch.education}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Profession / Career', 'المهنة والوظيفة', 'پیشە و کار')}</span>
                          <span className="font-bold text-[#9D4DFF]">{activeSelectedMatch.profession}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-stone-400 block text-[9px] uppercase font-mono mb-1">{txt('Spoken Languages', 'اللغات المتقنة', 'زمانە قسەکراوەکان')}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeSelectedMatch.languages.map((l) => (
                              <span key={l} className="bg-[#F8F5FF] border border-[#C77DFF]/20 text-[#9D4DFF] font-mono px-2 py-0.5 rounded text-[10px] font-bold">
                                {l}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Courtship & Marriage Preferences */}
                    <div className="bg-white border border-[#C77DFF]/35 rounded-2xl p-4 shadow-sm space-y-3">
                      <h4 className="text-xs font-black text-[#1E1E2F] uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-[#C77DFF]/15 pb-1.5">
                        <HelpCircle className="w-4 h-4 text-[#9D4DFF]" />
                        <span>{txt('Courtship Preferences & Requirements', 'خيارات ومحددات الارتباط', 'هەڵبژاردنەکانی هاوسەرگیری')}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Preferred Age Range', 'المدى العمري المفضل لشريك الحياة', 'تەمەنی گونجاوی هاوسەر')}</span>
                          <span className="font-bold text-[#FF4FD8] block mt-0.5">{activeSelectedMatch.preferredAgeRange || txt('Compatible age', 'عمر متوافق ومتناسب', 'تەمەنی گونجاو')}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Timeline Expectation', 'المدة المطلوبة لإتمام العقد', 'ماوەی دڵخواز بۆ مارەکردن')}</span>
                          <span className="font-bold text-[#1E1E2F] block mt-0.5">{activeSelectedMatch.timeline}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Wants Children?', 'الموقف من الإنجاب', 'ویستی منداڵبوون')}</span>
                          <span className="font-bold text-[#1E1E2F] block mt-0.5">{activeSelectedMatch.wantsChildren}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Relocation Preference', 'قابلية الانتقال والسكن', 'ئامادەیی گواستنەوەی نیشتەجێبوون')}</span>
                          <span className="font-bold text-[#1E1E2F] block mt-0.5">{activeSelectedMatch.relocation || txt('Prefer staying in current governorate', 'يفضل الاستقرار في نفس المحافظة', 'پێی باشە لە هەمان پارێزگادا بێت')}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Communication preference', 'أسلوب تواصل العائلة', 'شێوازی پەیوەندی خێزانی')}</span>
                          <span className="font-bold text-[#9D4DFF] block mt-0.5">{activeSelectedMatch.communicationPreference || txt('Family involvement from the first step', 'إشراك الأهل منذ البداية', 'خێزان ئاگادارە لە یەکەم هەنگاوەوە')}</span>
                        </div>
                        {activeSelectedMatch.familyValues && (
                          <div className="sm:col-span-2">
                            <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Family Core Values & Lifestyle', 'القيم العائلية الأساسية ونمط الحياة', 'بەها خێزانییە گرنگەکان و شێوازی ژیان')}</span>
                            <div className="mt-1 space-y-1">
                              <span className="font-bold text-[#1E1E2F] block italic text-xs">"{activeSelectedMatch.familyValues}"</span>
                              {activeSelectedMatch.lifestyle && (
                                <span className="text-[11px] text-[#9D4DFF] block font-medium">✨ {activeSelectedMatch.lifestyle}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 5: Strict Dealbreakers */}
                    {activeSelectedMatch.dealbreakers && activeSelectedMatch.dealbreakers.length > 0 && (
                      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 space-y-2">
                        <h5 className="text-[10px] font-black text-red-700 uppercase tracking-wider font-mono">
                          🚫 {txt('Absolute Dealbreakers & Red Lines', 'الخطوط الحمراء القاطعة', 'هێڵە سوورە بڕاوەکان')}
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSelectedMatch.dealbreakers.map((db) => (
                            <span key={db} className="bg-white text-red-700 border border-red-200 rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold shadow-3xs">
                              No {db}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 6: Compatibility Explanation Box */}
                    <div className="bg-[#9D4DFF]/5 border border-[#C77DFF]/20 rounded-2xl p-4 space-y-2">
                      <h5 className="text-[10px] font-black text-[#9D4DFF] uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#FF4FD8] fill-[#FF4FD8]/20 animate-spin-slow" />
                        <span>{txt('Compatibility Match Analysis', 'تحليل التوافق الشرعي والاجتماعي', 'شیکردنەوەی گونجانی شەرعی و کۆمەڵایەتی')}</span>
                      </h5>
                      <p className="text-xs text-[#1E1E2F]/90 leading-relaxed font-semibold">
                        {txt(
                          `Based on your spiritual and familial parameters, you share a strong compatibility index of ${activeSelectedMatch.compatibilityScore}%. Your alignment on religious principles, family involvement, and marital timeline expectation (${activeSelectedMatch.timeline.toLowerCase()}) demonstrates a highly harmonious courtship potential.`,
                          `بناءً على معاييرك الدينية والاجتماعية، تشترك مع هذا الملف في مؤشر توافق قوي يبلغ ${activeSelectedMatch.compatibilityScore}%. توافقكما حول القيم الدينية وإشراك الأسرة والتوقعات الزمنية (${activeSelectedMatch.timeline.toLowerCase()}) يعكس إمكانية زواج ناجحة جداً.`,
                          `بەگوێرەی پێوەرە ئاینی و کۆمەڵایەتییەکانت، ڕێژەی گونجانی باشتان هەیە کە گەیشتووەتە ${activeSelectedMatch.compatibilityScore}%. هاوتەریبی هاوبەشتان لەسەر بەها گرنگەکان و کاتی هاوسەرگیری دڵخواز (${activeSelectedMatch.timeline.toLowerCase()}) دەرخەری پەیوەندییەکی باشە.`
                        )}
                      </p>
                    </div>

                    {/* Section 7: Safety, Trust Status & Support Verification */}
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-2.5 text-start">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <strong className="block text-stone-700 font-bold">{txt('Verification Level: Active', 'درجة التوثيق: نشط وموثق', 'ئاستی سەلماندن: چالاک')}</strong>
                          <span className="text-stone-500 text-[10px] block mt-0.5">
                            {activeSelectedMatch.verified
                              ? txt('Identity verified via official Iraq civil registry. This profile is secure.', 'تم التحقق من الهوية والبيانات الشخصية عبر البطاقة الموحدة الرسمية. ملف آمن.', 'ناسنامەی سەلمێنراوە لە ڕێگەی کارتی نیشتمانی فەرمی. پڕۆفایلێکی پارێزراوە.')
                              : txt('Undergoing standard verification checks.', 'قيد المراجعة والتحقق الدوري.', 'لە ژێر پڕۆسەی سەلماندنی پێوانەییدایە.')}
                          </span>
                        </div>
                      </div>
                      {activeSelectedMatch.verified && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-[10px] font-mono font-black shrink-0">
                          100% SECURE
                        </span>
                      )}
                    </div>

                    {/* Fingerprint Visual Identity Protection Seal */}
                    <div className="bg-[#F8F5FF] border border-[#C77DFF]/20 rounded-2xl p-4 flex items-center gap-3 text-start">
                      <div className="w-9 h-9 rounded-full bg-[#EBE5FF] flex items-center justify-center shrink-0">
                        <Fingerprint className="w-5 h-5 text-[#9D4DFF]" />
                      </div>
                      <div className="text-xs">
                        <strong className="block text-[#1E1E2F] font-bold">{txt('Verified Trust Seal', 'ختم ثقة الهوية الموثق', 'مۆری متمانەی ناسنامەی فەرمی')}</strong>
                        <span className="text-stone-600 text-[10px] leading-relaxed block mt-0.5">
                          {txt(
                            'This candidate has passed official ID verification and background checks. Biometric data is strictly protected and never collected on our servers.',
                            'تم التحقق من الوثائق الرسمية للمشترك. بصماتك الحقيقية وبياناتك الشخصية آمنة ومحمية تماماً ولا يتم جمعها أبداً.',
                            'ئەم بەربژێرە ناسنامەی نیشتمانی سەلمێنراوە. هیچ زانیارییەکی بایۆمەتری کۆناکرێتەوە و بە تەواوی پارێزراوە.'
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Section 8: Report and Block Administrative buttons */}
                    <div className="border-t border-[#C77DFF]/20 pt-4 flex flex-wrap items-center justify-between gap-3 bg-[#F8F5FF]/30 p-3 rounded-xl border border-[#C77DFF]/15">
                      <span className="text-[10px] font-semibold text-stone-500 font-mono">
                        {txt('REPORTING SERVICES', 'خدمات البلاغ والدعم', 'خزمەتگوزارییەکانی سکاڵا')}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {/* Report action toggle */}
                        {!showReportDialog ? (
                          <button
                            type="button"
                            onClick={() => {
                              setShowReportDialog(true);
                              setReportSuccessMessage(null);
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            ⚠️ {txt('Report Candidate', 'بلاغ عن الملف', 'سکاڵا تۆماربکە')}
                          </button>
                        ) : (
                          <div className="bg-white p-2 rounded-xl border border-red-200 shadow-xs flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <select
                              value={reportReason}
                              onChange={(e) => setReportReason(e.target.value)}
                              className="bg-stone-50 border border-stone-200 rounded px-1.5 py-1 text-xs text-stone-700 font-semibold focus:outline-none"
                            >
                              <option value="unserious">{txt('Unserious candidate', 'شخص غير جاد', 'کەسی ناجدی')}</option>
                              <option value="fake">{txt('Fake profile details', 'بيانات غير صحيحة', 'زانیاری ناڕاست')}</option>
                              <option value="commercial">{txt('Commercial/Ad use', 'ترويج تجاري', 'ڕیکلامی بازرگانی')}</option>
                              <option value="harassment">{txt('Inappropriate conduct', 'سلوك غير لائق', 'ڕەفتاری نەشیاو')}</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                setReportedMatchIds((prev) => [...prev, activeSelectedMatch.id]);
                                setReportSuccessMessage(txt(
                                  `Thank you. Candidate profile has been successfully reported for verification. Reason: ${reportReason.toUpperCase()}`,
                                  `شكراً لك. تم إرسال البلاغ بنجاح للتحقق من المخالفة. السبب: ${reportReason}`,
                                  `سوپاس. سکاڵاکەت بە سەرکەوتوویی تۆمارکرا بۆ پێداچوونەوە. هۆکار: ${reportReason}`
                                ));
                                setShowReportDialog(false);
                              }}
                              className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-black hover:bg-red-700 cursor-pointer"
                            >
                              {txt('Submit', 'إرسال', 'بنێرە')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowReportDialog(false)}
                              className="text-stone-400 text-xs font-bold px-1 cursor-pointer"
                            >
                              {txt('Cancel', 'إلغاء', 'پەشیمانبوونەوە')}
                            </button>
                          </div>
                        )}

                        {/* Block Action */}
                        <button
                          type="button"
                          onClick={() => {
                            setBlockedMatchIds((prev) => [...prev, activeSelectedMatch.id]);
                            setBlockSuccessMessage(txt(
                              'Candidate profile has been safely blocked. This user will no longer be visible to you.',
                              'تم حظر هذا الملف الشخصي بأمان ولن يظهر لك مجدداً في خيارات الترشيح.',
                              'ئەم پڕۆفایلە بە سەرکەوتوویی بلۆک کرا و چیتر پێشاند نادرێتەوە.'
                            ));
                            setTimeout(() => {
                              setSelectedMatch(null);
                              setBlockSuccessMessage(null);
                            }, 2500);
                          }}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          🚫 {txt('Block Candidate', 'حظر المستخدم', 'بلۆک بکە')}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Honest pending state — awaiting receiver decision */}
                {activeSelectedMatch.requestStatus === 'sent' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2 text-start">
                    <AlertCircle className="w-4 h-4 text-[#FF4FD8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">{txt('Request pending', 'الطلب قيد الانتظار', 'داواکاری چاوەڕوانە')}</strong>
                      <span>
                        {txt(
                          'Your introduction was sent. Chat unlocks only if they accept.',
                          'تم إرسال طلب التعارف. تُفعّل المحادثة فقط عند قبول الطرف الآخر.',
                          'داواکاری ناساندن نێردرا. گفتوگۆ تەنها ئەگەر ئەوان قبوڵی بکەن دەکرێتەوە.'
                        )}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer Action Bar */}
              <div className="bg-white border-t border-[#C77DFF]/20 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMatch(null);
                    setReportSuccessMessage(null);
                    setBlockSuccessMessage(null);
                    setShowReportDialog(false);
                  }}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200/90 font-bold text-[#1E1E2F] rounded-xl text-xs transition uppercase font-mono tracking-wider text-center cursor-pointer"
                >
                  {txt('Close Dossier ➔', 'إغلاق الملف ➔', 'داخستنی دۆسیە ➔')}
                </button>

                {activeSelectedMatch.requestStatus === 'none' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onSendRequest(activeSelectedMatch.id);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#FF4FD8] to-[#9D4DFF] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#9D4DFF]/20 hover:opacity-90 active:scale-99 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-white text-white shrink-0" />
                      <span>{txt('Send Respectful Request', 'إرسال طلب تعارف وقور', 'ناردنی داواکارییەکی بەڕێز')}</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="px-4 py-2.5 bg-stone-100 border border-stone-200 text-stone-400 font-semibold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                      title={txt('Messaging unlocks after mutual approval', 'تُفتح المراسلة بعد القبول المتبادل', 'چاتکردن دەکرێتەوە دوای پەسەندکردنی دوولایەنە')}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{txt('Message', 'مراسلة', 'چات')}</span>
                    </button>
                  </>
                )}

                {activeSelectedMatch.requestStatus === 'sent' && (
                  <>
                    <button
                      type="button"
                      disabled
                      className="px-6 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                      <span>{txt('Request Sent', 'تم إرسال الطلب', 'داواکاری نێردرا')}</span>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="px-4 py-2.5 bg-stone-100 border border-stone-200 text-stone-400 font-semibold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                      title={txt('Messaging unlocks after mutual approval', 'تُفتح المراسلة بعد القبول المتبادل', 'چاتکردن دەکرێتەوە دوای پەسەندکردنی دوولایەنە')}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{txt('Message', 'مراسلة', 'چات')}</span>
                    </button>
                  </>
                )}

                {activeSelectedMatch.requestStatus === 'accepted' && (
                  <>
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1 shrink-0 justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {txt('Mutual Approval ✓', 'قبول متبادل ✓', 'پەسەندکردنی دوولایەنە ✓')}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onInitiateChat(activeSelectedMatch.id);
                        setSelectedMatch(null);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#9D4DFF] to-[#FF4FD8] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#9D4DFF]/20 hover:opacity-90 active:scale-99 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-white shrink-0" />
                      <span>{txt('Open Secure Chat', 'فتح المحادثة الآمنة', 'دەستکردن بە چاتی پارێزراو')}</span>
                    </button>
                  </>
                )}

                {activeSelectedMatch.requestStatus === 'declined' && (
                  <button
                    type="button"
                    disabled
                    className="px-5 py-2.5 bg-red-50 text-red-500 border border-red-100 font-bold text-xs rounded-xl cursor-not-allowed text-center"
                  >
                    {txt('Request Declined', 'تم رفض الطلب', 'داواکارییەکە ڕەتکرایەوە')}
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}

    </div>
  );
}
