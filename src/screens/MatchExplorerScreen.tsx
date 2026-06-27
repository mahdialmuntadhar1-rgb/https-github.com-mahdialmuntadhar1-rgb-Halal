import React, { useState, useEffect, useMemo } from 'react';
import { MatchProfile, SearchFilters, AppLanguage, UserProfile } from '../types';
import { apiClient } from '../services/apiClient';
import FilterPanel from '../components/FilterPanel';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import TodayInZawaj from '../components/TodayInZawaj';
import { 
  ShieldCheck, MapPin, Award, BookOpen, User, Star, Book, Heart, Lock, 
  CheckCircle, X, HelpCircle, Languages, AlertCircle, Fingerprint, 
  MessageSquare, ThumbsUp, ThumbsDown, RefreshCw 
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

  const [filters, setFilters] = useState<SearchFilters>({
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

  const incompleteMatches = useMemo(() => {
    const women = matches.filter(m => m.gender === 'female').slice(0, 2);
    const men = matches.filter(m => m.gender === 'male').slice(0, 2);
    return [...women, ...men];
  }, [matches]);

  // Derived matches after applying client-side bookmark filtering and passes if requested
  const displayedMatches = useMemo(() => {
    if (isProfileIncomplete) return incompleteMatches;
    return (browsingMode === 'saved'
      ? loadedMatches.filter((m) => savedMatchIds.includes(m.id))
      : loadedMatches
    ).filter((m) => !blockedMatchIds.includes(m.id) && !passedMatchIds.includes(m.id));
  }, [isProfileIncomplete, incompleteMatches, loadedMatches, browsingMode, savedMatchIds, blockedMatchIds, passedMatchIds]);

  // Saved portfolios match list (unfiltered by passes)
  const savedMatches = useMemo(() => {
    if (isProfileIncomplete) return incompleteMatches;
    return loadedMatches.filter((m) => 
      savedMatchIds.includes(m.id) && !blockedMatchIds.includes(m.id)
    );
  }, [isProfileIncomplete, incompleteMatches, loadedMatches, savedMatchIds, blockedMatchIds]);

  // Active swipe matches remaining (unpassed, unblocked)
  const swipeMatches = useMemo(() => {
    if (isProfileIncomplete) return incompleteMatches;
    return loadedMatches.filter((m) => 
      !blockedMatchIds.includes(m.id) && !passedMatchIds.includes(m.id)
    );
  }, [isProfileIncomplete, incompleteMatches, loadedMatches, blockedMatchIds, passedMatchIds]);

  // Synchronized view for selected match to capture live state changes
  const activeSelectedMatch = selectedMatch 
    ? loadedMatches.find(m => m.id === selectedMatch.id) || selectedMatch
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="match-explorer-screen">
      
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

      {/* Interactive Profile Completion Progress Card or Incomplete Warning Banner */}
      {isProfileIncomplete ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs animate-fade-in text-start" id="complete-profile-banner">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h4 className="text-base sm:text-lg font-serif font-black text-amber-900">
                {txt("Complete Your Marriage Profile", "أكمل ملف الزواج المبارك", "پڕۆفایلی هاوسەرگیریەکەت تەواو بکە")}
              </h4>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-mono">
                {txt("Limited Access", "وصول محدود", "دەستپێگەیشتنی سنووردار")}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-800 font-medium leading-relaxed max-w-2xl">
              {txt(
                "To ensure a respectful, serious, and Shari'a-compliant matchmaking process, you are currently shown exactly two women and two men. Please complete your marriage profile parameters to unlock full access, custom match lists, and private filters.",
                "لضمان تعارف وقور وجاد متوافق مع الشريعة الغراء، يظهر لك حالياً امرأتان ورجلان فقط. يرجى إكمال بيانات ملفك الشخصي لتتمكن من استكشاف كافة الشركاء المناسبين وتفعيل مرشحات البحث المتقدمة والخاصة.",
                "بۆ دڵنیابوون لەوەی کە پڕۆسەی هاوسەرگیری بە شێوەیەکی ڕێزدار و جدی ئەنجام دەدرێت، لە ئێستادا تەنها دوو ژن و دوو پیاو پیشان دەدرێن. تکایە پڕۆفایلی خۆت تەواو بکە بۆ بەدەستهێنانی دەستپێگەیشتنی تەواو."
              )}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('onboarding')}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-600/10 active:scale-95 transition shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 text-amber-300 animate-pulse fill-amber-300" />
            <span>{txt("Complete Profile Now", "أكمل ملفك الآن", "ئێستا پڕۆفایلەکەت تەواو بکە")}</span>
          </button>
        </div>
      ) : (
        <ProfileCompletionCard
          locale={locale}
          userProfile={userProfile}
          onUpdateProfile={onUpdateUserProfile}
        />
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
            description={locale === 'en' 
              ? 'We enforce strict search constraints to respect seriousness. Try expanding your age limits or searching all Iraqi governorates.'
              : 'نحن نفرض معايير دقيقة لمطابقة حقيقية ومصانة للزواج. يرجى تجربة توسيع المدى العمري أو اختيار محافظات أخرى.'}
            actionText={locale === 'en' ? 'Reset Parameters' : 'إعادة تعيين المعايير'}
            onAction={handleResetFilters}
          />
        )
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedMatches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                locale={locale}
                onSendRequest={onSendRequest}
                onInitiateChat={onInitiateChat}
                onOpenDetails={(profile) => setSelectedMatch(profile)}
                savedMatchIds={savedMatchIds}
                onToggleSaveMatch={onToggleSaveMatch}
                isInterested={interestedMatchIds.includes(m.id)}
                onToggleInterested={handleToggleInterested}
                onPass={handlePass}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4 pb-8" id="matches-load-more-container">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchMatches(nextPage, filters, true);
                }}
                disabled={loadingMore}
                className="px-6 py-3 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-warm-charcoal font-bold rounded-2xl text-xs transition duration-200 border border-stone-200 shadow-sm flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />
                    <span>{txt('Loading...', 'جاري التحميل...', 'باردەکرێتەوە...')}</span>
                  </>
                ) : (
                  <span>{txt('Load More Candidates', 'تحميل المزيد من المحترمين', 'بینینی بەربژێری زیاتر')}</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Today in Zawaj Daily Digest */}
      <TodayInZawaj
        locale={locale}
        onNavigateToTab={(tab) => onNavigateToTab && onNavigateToTab(tab)}
      />

      {/* Structured Courtship Portfolio detail modal (Extremely comprehensive as serious apps) */}
      <Modal
        isOpen={activeSelectedMatch !== null}
        onClose={() => {
          setSelectedMatch(null);
          setReportSuccessMessage(null);
          setBlockSuccessMessage(null);
          setShowReportDialog(false);
        }}
        title={activeSelectedMatch 
          ? txt(`${activeSelectedMatch.name}'s Detailed Courtship Dossier`, `الملف التعريفي للخطوبة: ${activeSelectedMatch.name}`, `پۆرتفۆلیۆی هاوسەرگیری تێر و تەسەلی ${activeSelectedMatch.name}`)
          : txt('Courtship Dossier', 'ملف التعارف', 'دۆسیەی هاوسەرگیری')}
      >
        {activeSelectedMatch && (
          <div className="space-y-6 text-left max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            
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
              
              {/* Left Column: Larger Polaroid Image Frame & Online Status */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="p-4 bg-white shadow-xl border border-stone-200 rounded-2xl w-full max-w-[280px] transform rotate-1 hover:rotate-0 transition-all duration-300 relative">
                  
                  {/* Photo Canvas */}
                  <div className="aspect-[4/5] w-full bg-stone-100 rounded-xl overflow-hidden relative shadow-inner">
                    {activeSelectedMatch.photoStatus === 'hidden' && activeSelectedMatch.requestStatus !== 'accepted' ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#ECE8E1] via-[#E1DDD5] to-[#D5CFB9] flex flex-col items-center justify-center p-4 text-center">
                        <Lock className="w-8 h-8 text-[#40798C] mb-2 animate-bounce" />
                        <p className="text-xs text-warm-charcoal font-black uppercase tracking-wider">
                          {txt('Photo Hidden', 'الصورة مخفية', 'وێنە شاراوەیە')}
                        </p>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {txt('Unlocked upon match approval', 'تظهر عند الموافقة المتبادلة', 'دەکرێتەوە دوای پەسەندکردنی دوولایەنە')}
                        </p>
                      </div>
                    ) : activeSelectedMatch.photoStatus === 'initials' && activeSelectedMatch.requestStatus !== 'accepted' ? (
                      <div className="w-full h-full bg-gradient-to-br from-[#E6ECEA] via-[#D5E1DF] to-[#CAD3D2] flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-accent-coral font-serif font-black text-3xl border border-stone-100 mb-2">
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
                          <div className="absolute inset-0 bg-[#2D2A26]/40 flex flex-col items-center justify-center p-4 text-center">
                            <div className="bg-white/95 p-2 rounded-full shadow-md mb-2">
                              <Lock className="w-5 h-5 text-accent-coral" />
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
                  <div className="pt-3 text-center border-t border-dashed border-stone-100 mt-2">
                    <span className="font-serif font-black text-lg text-warm-charcoal block tracking-tight">
                      {activeSelectedMatch.name}, <span className="font-sans text-stone-500 font-normal">{activeSelectedMatch.age}</span>
                    </span>
                    <span className="text-xs font-mono text-[#6B635B] block mt-0.5 flex items-center justify-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#40798C]" />
                      <span>{activeSelectedMatch.city}, {activeSelectedMatch.governorate}</span>
                    </span>
                  </div>

                </div>

                {/* Sharia Contact Privacy Notice */}
                <div className="mt-4 p-3 bg-[#FAF8F4] border border-[#E3D6C0] rounded-xl text-[10px] leading-relaxed text-stone-500 w-full max-w-[280px]">
                  <p className="font-bold text-[#40798C] mb-1 flex items-center gap-1">
                    <span>🔒</span> {txt('Islamic Privacy Shield', 'درع الخصوصية الشرعي', 'مەڵبەندی پاراستنی تایبەتمەندی')}
                  </p>
                  {txt(
                    'Direct contact channels (phone, email, WhatsApp, wali details) are strictly masked. Communication is only authorized via secure app chat upon mutual consent.',
                    'قنوات الاتصال المباشرة (رقم الهاتف، واتساب، معلومات ولي الأمر) مخفية تماماً. التواصل متاح فقط عبر الدردشة الآمنة في التطبيق بعد قبول الطلب شرعياً.',
                    'پەیوەندی ڕاستەوخۆ (ژمارەی مۆبایل، واتسئەپ، زانیاری ولی الامر) بە تەواوی شاردراوەتەوە. تەنها لە ڕێگەی چاتی پارێزراوی ئەپەکەوە دەبێت دوای پەسەندکردنی داواکاری.'
                  )}
                </div>
              </div>

              {/* Right Column: In-Depth Biography & Credentials */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Section 1: Demographics & Spiritual Identity */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-[#40798C] uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                    <User className="w-4 h-4" />
                    <span>{txt('Spiritual & Personal Status', 'الهوية الشخصية والمذهب', 'ناسنامەی کەسی و مەزهەبی')}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Religion', 'الديانة', 'ئاین')}</span>
                      <span className="font-bold text-stone-700 capitalize">{activeSelectedMatch.religion === 'islam' ? txt('Islam', 'الإسلام', 'ئیسلام') : txt('Other', 'ديانة أخرى', 'ئایینی تر')}</span>
                    </div>
                    {activeSelectedMatch.sect && (
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Islamic Sect', 'المذهب الإسلامي', 'مەزهەبی ئیسلامی')}</span>
                        <span className="font-bold text-[#40798C] capitalize">
                          {activeSelectedMatch.sect === 'sunni' ? txt('Sunni', 'أهل السنة', 'سوننە') : txt('shiaa', 'الشيعة', 'شیعە')}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Ethnicity', 'القومية', 'نەتەوە')}</span>
                      <span className="font-bold text-accent-coral capitalize">
                        {activeSelectedMatch.ethnicity === 'arab' ? txt('Arab', 'عربي', 'عەرەب') : activeSelectedMatch.ethnicity === 'kurdish' ? txt('Kurdish', 'كوردي', 'کورد') : txt('Others', 'قوميات أخرى', 'هیتر')}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Marital Status', 'الحالة الاجتماعية', 'بارودۆخی خێزانی')}</span>
                      <span className="font-bold text-stone-700 capitalize">{activeSelectedMatch.maritalStatus || txt('Never Married', 'أعزب/لم يسبق له الزواج', 'هاوسەرگیری نەکردووە')}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Biography & Intention (Full details) */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-accent-coral uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{txt('About & Marriage Expectations', 'التعريف ورؤية الزواج المتبادلة', 'ناساندن و ڕوانینی هاوسەرگیری')}</span>
                  </h4>
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono mb-1">{txt('Personal Message Note', 'رسالة التعريف الشخصية', 'نامەی ناساندنی کەسی')}</span>
                      <p className="text-xs leading-relaxed text-[#4A443F] bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E3D6C0]/60 italic font-serif">
                        "{activeSelectedMatch.aboutMe}"
                      </p>
                    </div>
                    {activeSelectedMatch.intention && (
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-mono mb-1">{txt('Marital Intentions', 'أهداف ومآرب الزواج', 'خواستەکانی هاوسەرگیری')}</span>
                        <p className="text-xs leading-relaxed text-stone-700 bg-rose-50/40 p-3.5 rounded-xl border border-rose-100 italic font-sans">
                          "{activeSelectedMatch.intention}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Professional & Intellectual Dossier */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-stone-700 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                    <Award className="w-4 h-4" />
                    <span>{txt('Professional & Intellectual Dossier', 'المستوى العلمي والعملي', 'ئاستی زانستی و کارکردن')}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Education level', 'التحصيل الأكاديمي', 'ئاستی خوێندن')}</span>
                      <span className="font-bold text-stone-700">{activeSelectedMatch.education}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Profession / Career', 'المهنة والوظيفة', 'پیشە و کار')}</span>
                      <span className="font-bold text-[#40798C]">{activeSelectedMatch.profession}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-stone-400 block text-[9px] uppercase font-mono mb-1">{txt('Spoken Languages', 'اللغات المتقنة', 'زمانە قسەکراوەکان')}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSelectedMatch.languages.map((l) => (
                          <span key={l} className="bg-stone-50 border border-stone-200 text-stone-600 font-mono px-2 py-0.5 rounded text-[10px] font-bold">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Courtship & Marriage Preferences */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-black text-stone-700 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>{txt('Courtship Preferences', 'خيارات ومحددات الارتباط', 'هەڵبژاردنەکانی هاوسەرگیری')}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Timeline Expectation', 'المدة المطلوبة لإتمام العقد', 'ماوەی دڵخواز بۆ مارەکردن')}</span>
                      <span className="font-bold text-stone-700 block mt-0.5">{activeSelectedMatch.timeline}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Wants Children?', 'الموقف من الإنجاب', 'ویستی منداڵبوون')}</span>
                      <span className="font-bold text-stone-700 block mt-0.5">{activeSelectedMatch.wantsChildren}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Relocation Preference', 'قابلية الانتقال والسكن', 'ئامادەیی گواستنەوەی نیشتەجێبوون')}</span>
                      <span className="font-bold text-stone-700 block mt-0.5">{activeSelectedMatch.relocation || txt('Prefer staying in current governorate', 'يفضل الاستقرار في نفس المحافظة', 'پێی باشە لە هەمان پارێزگادا بێت')}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Communication preference', 'أسلوب تواصل العائلة', 'شێوازی پەیوەندی خێزانی')}</span>
                      <span className="font-bold text-[#40798C] block mt-0.5">{activeSelectedMatch.communicationPreference || txt('Family involvement from the first step', 'إشراك الأهل منذ البداية', 'خێزان ئاگادارە لە یەکەم هەنگاوەوە')}</span>
                    </div>
                    {activeSelectedMatch.familyValues && (
                      <div className="sm:col-span-2">
                        <span className="text-stone-400 block text-[9px] uppercase font-mono">{txt('Family Core Values', 'القيم العائلية الأساسية', 'بەها خێزانییە گرنگەکان')}</span>
                        <span className="font-bold text-stone-700 block mt-0.5 italic">"{activeSelectedMatch.familyValues}"</span>
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
                <div className="bg-[#40798C]/5 border border-[#40798C]/15 rounded-2xl p-4 space-y-2">
                  <h5 className="text-[10px] font-black text-[#40798C] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-accent-coral fill-accent-coral/20" />
                    <span>{txt('Compatibility Match Analysis', 'تحليل التوافق الشرعي والاجتماعي', 'شیکردنەوەی گونجانی شەرعی و کۆمەڵایەتی')}</span>
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                    {txt(
                      `Based on your spiritual and familial parameters, you share a strong compatibility index of ${activeSelectedMatch.compatibilityScore}%. Your alignment on religious principles, family involvement, and marital timeline expectation (${activeSelectedMatch.timeline.toLowerCase()}) demonstrates a highly harmonious courtship potential.`,
                      `بناءً على معاييرك الدينية والاجتماعية، تشترك مع هذا الملف في مؤشر توافق قوي يبلغ ${activeSelectedMatch.compatibilityScore}%. توافقكما حول القيم الدينية وإشراك الأسرة والتوقعات الزمنية (${activeSelectedMatch.timeline.toLowerCase()}) يعكس إمكانية زواج ناجحة جداً.`,
                      `بەگوێرەی پێوەرە ئاینی و کۆمەڵایەتییەکانت، ڕێژەی گونجانی باشتان هەیە کە گەیشتووەتە ${activeSelectedMatch.compatibilityScore}%. هاوتەریبی هاوبەشتان لەسەر بەها گرنگەکان و کاتی هاوسەرگیری دڵخواز (${activeSelectedMatch.timeline.toLowerCase()}) دەرخەری پەیوەندییەکی باشە.`
                    )}
                  </p>
                </div>

                {/* Section 7: Safety, Trust Status & Support Verification */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="block text-stone-700 font-bold">{txt('Verification Level: Active', 'درجة التوثيق: نشط وموثق', 'ئاستی سەلماندن: چالاک')}</strong>
                      <span className="text-stone-500 text-[10px] block">
                        {activeSelectedMatch.verified
                          ? txt('Identity verified via official Iraq civil registry. This profile is secure.', 'تم التحقق من الهوية والبيانات الشخصية عبر البطاقة الموحدة الرسمية. ملف آمن.', 'ناسنامەی سەلمێنراوە لە ڕێگەی کارتی نیشتمانی فەرمی. پڕۆفایلێکی پارێزراوە.')
                          : txt('Undergoing standard verification checks.', 'قيد المراجعة والتحقق الدوري.', 'لە ژێر پڕۆسەی سەلماندنی پێوانەییدایە.')}
                      </span>
                    </div>
                  </div>
                  {activeSelectedMatch.verified && (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-[10px] font-mono font-black shrink-0">
                      100% SECURE
                    </span>
                  )}
                </div>

                {/* Fingerprint Visual Identity Protection Seal (Visual badge only, no biometric collection as requested) */}
                <div className="bg-blue-50/50 border border-blue-150 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Fingerprint className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-xs">
                    <strong className="block text-blue-900 font-bold">{txt('Verified Trust Seal', 'ختم ثقة الهوية الموثق', 'مۆری متمانەی ناسنامەی فەرمی')}</strong>
                    <span className="text-blue-700/80 text-[10px] leading-relaxed block">
                      {txt(
                        'This candidate has passed official ID verification and background checks. Biometric data is strictly protected and never collected on our servers.',
                        'تم التحقق من الوثائق الرسمية للمشترك. بصماتك الحقيقية وبياناتك الشخصية آمنة ومحمية تماماً ولا يتم جمعها أبداً.',
                        'ئەم بەربژێرە ناسنامەی نیشتمانی سەلمێنراوە. هیچ زانیارییەکی بایۆمەتری کۆناکرێتەوە و بە تەواوی پارێزراوە.'
                      )}
                    </span>
                  </div>
                </div>

                {/* Section 8: Report and Block Administrative buttons */}
                <div className="border-t border-stone-200 pt-4 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50 p-3 rounded-xl border">
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
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
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
                          className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-black hover:bg-red-700"
                        >
                          {txt('Submit', 'إرسال', 'بنێرە')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReportDialog(false)}
                          className="text-stone-400 text-xs font-bold px-1"
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
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      🚫 {txt('Block Candidate', 'حظر المستخدم', 'بلۆک بکە')}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Simulated acceptance info strip */}
            {activeSelectedMatch.requestStatus === 'sent' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 text-accent-coral shrink-0 mt-0.5" />
                <div>
                  <strong className="block">{txt('Simulation Active', 'المحاكاة نشطة', 'سیمیولەیشن چالاکە')}</strong>
                  <span>
                    {txt(
                      'Demo: auto-accepting request so you can preview chat flow.',
                      'عرض تجريبي: سيتم قبول الطلب تلقائياً لكي تتمكن من تجربة شاشة المحادثة واستعراض محاكاة الدردشة.',
                      'پێشاندانی تاقیکاری: وەرگرتنی ئۆتۆماتیکی داواکاری بۆ ئەوەی بتوانیت چاتەکە ببینیت.'
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* BUTTONS FOR REQUEST ACTION */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-stone-150">
              <button
                type="button"
                onClick={() => {
                  setSelectedMatch(null);
                  setReportSuccessMessage(null);
                  setBlockSuccessMessage(null);
                  setShowReportDialog(false);
                }}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200/90 font-bold text-[#4A443F] rounded-xl text-xs transition uppercase font-mono tracking-wider text-center"
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
                    className="px-6 py-2.5 bg-accent-coral text-white font-bold text-xs rounded-xl shadow-lg shadow-accent-coral/20 hover:opacity-90 transition flex items-center justify-center gap-1.5"
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
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {txt('Mutual Approval ✓', 'قبول متبادل ✓', 'پەسەندکردنی دوولایەنە ✓')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      onInitiateChat(activeSelectedMatch.id);
                      setSelectedMatch(null);
                    }}
                    className="px-6 py-2.5 bg-[#40798C] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#40798C]/20 hover:opacity-90 transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-300" />
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

          </div>
        )}
      </Modal>

    </div>
  );
}
