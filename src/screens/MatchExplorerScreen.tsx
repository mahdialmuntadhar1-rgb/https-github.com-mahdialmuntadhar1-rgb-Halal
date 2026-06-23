import React, { useState } from 'react';
import { MatchProfile, SearchFilters, AppLanguage } from '../types';
import FilterPanel from '../components/FilterPanel';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { ShieldCheck, MapPin, Award, BookOpen, User, Star, Book, Heart, Lock, CheckCircle, X, HelpCircle, Languages, AlertCircle } from 'lucide-react';

interface MatchExplorerScreenProps {
  locale: AppLanguage;
  matches: MatchProfile[];
  onSendRequest: (id: string) => void;
  onInitiateChat: (id: string) => void;
  userGender: 'male' | 'female';
  userGovernorate?: string;
  savedMatchIds?: string[];
  onToggleSaveMatch: (id: string) => void;
}

export default function MatchExplorerScreen({
  locale,
  matches,
  onSendRequest,
  onInitiateChat,
  userGender,
  userGovernorate,
  savedMatchIds = [],
  onToggleSaveMatch
}: MatchExplorerScreenProps) {
  const txt = (en: string, ar: string, ckb: string) => {
    return locale === 'en' ? en : locale === 'ckb' ? ckb : ar;
  };
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

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

  // 1. Thorough Filtering Logic
  const filteredMatches = matches.filter((m) => {
    // Saved Matches Filter
    if (showSavedOnly && !savedMatchIds.includes(m.id)) return false;

    // Gender Filter
    if (filters.gender !== 'all' && m.gender !== filters.gender) return false;

    // Age Spectrum Range
    if (m.age < filters.minAge || m.age > filters.maxAge) return false;

    // Governorate
    if (filters.governorate !== 'All Iraq' && m.governorate !== filters.governorate) return false;

    // City
    if (filters.city && filters.city !== 'All Cities' && m.city && m.city !== filters.city) {
      // Also check simple substring match in case city text was parsed differently
      const inCity = m.city.toLowerCase().includes(filters.city.toLowerCase());
      if (!inCity) return false;
    }

    // Religion
    if (filters.religion !== 'all' && m.religion !== filters.religion) return false;

    // Islamic Sect
    if (filters.sect !== 'all' && m.religion === 'islam' && m.sect !== filters.sect) return false;

    // Ethnicity
    if (filters.ethnicity !== 'all' && m.ethnicity !== filters.ethnicity) return false;

    // Education degree categorization
    if (filters.education && filters.education !== 'All Education Levels') {
      const matchEd = m.education.toLowerCase();
      const filterEd = filters.education.toLowerCase();
      if (filterEd === 'high school' && !matchEd.includes('high school')) return false;
      if (filterEd === 'diploma / institute' && !matchEd.includes('diploma') && !matchEd.includes('institute')) return false;
      if (filterEd === 'bachelor degree' && !matchEd.includes('bachelor') && !matchEd.includes('b.sc') && !matchEd.includes('ba')) return false;
      if (filterEd === 'master degree' && !matchEd.includes('master') && !matchEd.includes('m.a') && !matchEd.includes('m.sc')) return false;
      if (filterEd === 'phd / doctorate' && !matchEd.includes('phd') && !matchEd.includes('doctor') && !matchEd.includes('ph.d')) return false;
    }

    // Profession category search
    if (filters.profession && filters.profession !== 'All Professions' && filters.profession !== 'Other') {
      const profCat = filters.profession.toLowerCase();
      const mProf = m.profession.toLowerCase();
      if (profCat.includes('health') || profCat.includes('medicine')) {
        if (!mProf.includes('doctor') && !mProf.includes('pharmacist') && !mProf.includes('cardiologist') && !mProf.includes('surgeon') && !mProf.includes('nurse') && !mProf.includes('healthcare') && !mProf.includes('clinical')) return false;
      } else if (profCat.includes('education') || profCat.includes('academia')) {
        if (!mProf.includes('teacher') && !mProf.includes('professor') && !mProf.includes('educator') && !mProf.includes('education') && !mProf.includes('school')) return false;
      } else if (profCat.includes('engineering') || profCat.includes('technology')) {
        if (!mProf.includes('engineer') && !mProf.includes('tech') && !mProf.includes('developer') && !mProf.includes('software')) return false;
      } else if (profCat.includes('business') || profCat.includes('finance')) {
        if (!mProf.includes('business') && !mProf.includes('finance') && !mProf.includes('founder') && !mProf.includes('startup') && !mProf.includes('corporate') && !mProf.includes('legal')) return false;
      } else if (profCat.includes('art') || profCat.includes('design')) {
        if (!mProf.includes('art') && !mProf.includes('design') && !mProf.includes('architect') && !mProf.includes('creative')) return false;
      }
    }

    // Wants Children stance
    if (filters.wantsChildren !== 'All') {
      const isYesFilter = filters.wantsChildren === 'Yes';
      const mChildren = m.wantsChildren.toLowerCase();
      const matchWants = mChildren.includes('yes') || mChildren.includes('willing') || mChildren.includes('looking forward') || mChildren.includes('parenting');
      if (isYesFilter && !matchWants) return false;
      if (!isYesFilter && matchWants) return false;
    }

    // Marriage Timeline Filter
    if (filters.timeline && filters.timeline !== 'all') {
      const tFilter = filters.timeline;
      const mTimeline = m.timeline.toLowerCase();
      if (tFilter === 'soon' && !mTimeline.includes('6 months') && !mTimeline.includes('soon')) return false;
      if (tFilter === '1year' && !mTimeline.includes('1 year') && !mTimeline.includes('6 months') && !mTimeline.includes('soon')) return false;
      if (tFilter === '2years' && !mTimeline.includes('1-2 years') && !mTimeline.includes('1 year') && !mTimeline.includes('6 months')) return false;
      if (tFilter === 'flexible' && !mTimeline.includes('flexible')) return false;
    }

    // Smoking status
    if (filters.smoking === 'Strictly Non-smoker') {
      // If dealbreakers explicitly require no smoking, they are non-smokers (and we expect they don't smoke)
      const nonSmoker = m.dealbreakers?.some(d => d.toLowerCase().includes('smoking')) || true;
      if (!nonSmoker) return false;
    }

    // Photo Visibility Status
    if (filters.photoVisibility && filters.photoVisibility !== 'All') {
      if (filters.photoVisibility === 'Blurred Only' && m.photoStatus !== 'blurred') return false;
      if (filters.photoVisibility === 'Visible Only' && m.photoStatus !== 'visible') return false;
    }

    // Verified Status
    if (filters.verifiedOnly && !m.verified) return false;

    return true;
  });

  // 2. Sorting Logic
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const sortBy = filters.sortBy || 'compatibility';

    if (sortBy === 'newest') {
      // Sort newly registered profiles first
      return b.id.localeCompare(a.id);
    }

    if (sortBy === 'closest') {
      // Sort partners in the same governorate higher
      const aClosest = a.governorate && a.governorate === userGov ? 1 : 0;
      const bClosest = b.governorate && b.governorate === userGov ? 1 : 0;
      if (aClosest !== bClosest) {
        return bClosest - aClosest; // same governorate first
      }
      return b.compatibilityScore - a.compatibilityScore; // secondary tie breaker
    }

    if (sortBy === 'completeness') {
      // Sort by richness of their profile fields
      return getCompleteness(b) - getCompleteness(a);
    }

    // Default 'compatibility'
    return b.compatibilityScore - a.compatibilityScore;
  });

  // Synchronized view for selected match to capture live state changes
  const activeSelectedMatch = selectedMatch 
    ? matches.find(m => m.id === selectedMatch.id) || selectedMatch
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
        filteredCount={sortedMatches.length}
        locale={locale}
      />

      {/* Demo Warning Label */}
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-2xl p-3.5 text-center text-xs flex flex-col sm:flex-row items-center justify-center gap-2 font-mono">
        <span className="font-bold flex items-center gap-1 shrink-0">
          ⚠️ {locale === 'en' ? 'Demo profiles for frontend testing.' : locale === 'ar' ? 'الملفات المعروضة تجريبية لاختبار الواجهة.' : 'پڕۆفایلەکان تاقیکارین بۆ تێستکردنی ڕووکاری بەرنامەکە.'}
        </span>
        <span className="opacity-80">
          {locale === 'en' 
            ? 'Candidate search filters conform to strict Iraqi governorate parameters.' 
            : locale === 'ar' 
            ? 'معايير البحث تلتزم بالمحددات الجغرافية للمحافظات العراقية بطريقة مصانة.' 
            : 'پێوەرەکانی گەڕان پابەندە بە سنوورە دیاریکراوەکانی پارێزگاکانی عێراق.'}
        </span>
      </div>

      {/* Browsing modes tabs (All vs Saved portfolios) */}
      <div className="flex gap-2.5 pb-2 border-b border-stone-200 text-left">
        <button
          onClick={() => setShowSavedOnly(false)}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
            !showSavedOnly
              ? 'bg-warm-charcoal text-white shadow-sm'
              : 'bg-stone-50 border text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>📋 {txt('All Candidates', 'جميع المحترمين', 'هەموو بەربژێرەکان')}</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-center shrink-0">
            {matches.filter(m => filters.gender === 'all' || m.gender === filters.gender).length}
          </span>
        </button>

        <button
          onClick={() => setShowSavedOnly(true)}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
            showSavedOnly
              ? 'bg-[#40798C] text-white shadow-sm'
              : 'bg-stone-50 border text-[#40798C] hover:bg-stone-100'
          }`}
          id="saved-portfolios-tab"
        >
          <span>⭐ {txt('Saved Portfolios', 'المدونات المحفوظة', 'پارێزراوەکان')}</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-center shrink-0">
            {savedMatchIds.length}
          </span>
        </button>
      </div>

      {/* Grid of Match Dossier Cards */}
      {sortedMatches.length === 0 ? (
        showSavedOnly ? (
          <EmptyState
            title={txt('Your Bookmarks are Empty', 'لا توجد محفوظات عائلية حالياً', 'هیچ پڕۆفایلێکی پاشەکەوتکراو نییە')}
            description={txt(
              'Click the gold Star icon on any candidate’s card while browsing to save their portfolio here for careful reflection.',
              'انقر رمز النجمة الذهبية في زاوية ملف أي عائلات لتجدها مؤرشفة هنا للتدبر اللاحق والتأمل الوقور.',
              'کلیک لەسەر ئەستێرەی زێڕین بکە لەسەر پڕۆفایلەکان بۆ پاشەکەوتکردنیان لێرە.'
            )}
            actionText={txt('Browse All Candidates', 'عرض كامل الأعضاء', 'بابەتە جیاوازەکان ببینی')}
            onAction={() => setShowSavedOnly(false)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              locale={locale}
              onSendRequest={onSendRequest}
              onInitiateChat={onInitiateChat}
              onOpenDetails={(profile) => setSelectedMatch(profile)}
              savedMatchIds={savedMatchIds}
              onToggleSaveMatch={onToggleSaveMatch}
            />
          ))}
        </div>
      )}

      {/* Structured Courtship Portfolio detail modal (Extremely comprehensive as serious apps) */}
      <Modal
        isOpen={activeSelectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
        title={activeSelectedMatch 
          ? txt(`${activeSelectedMatch.name}'s Serious Portfolio`, `الملف التعريفي للخطوبة: ${activeSelectedMatch.name}`, `پۆرتفۆلیۆی جدی ${activeSelectedMatch.name}`)
          : txt('Courtship Dossier', 'ملف التعارف', 'دۆسیەی هاوسەرگیری')}
      >
        {activeSelectedMatch && (
          <div className="space-y-6 text-left max-h-[75vh] overflow-y-auto pr-1">
            
            {/* Header Identity Row with Demo state warnings */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {activeSelectedMatch.photoStatus === 'hidden' && activeSelectedMatch.requestStatus !== 'accepted' ? (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ECE8E1] to-[#E1DDD5] border-2 border-accent-coral shadow flex items-center justify-center text-stone-600">
                      <Lock className="w-4 h-4 text-[#40798C]" />
                    </div>
                  ) : activeSelectedMatch.photoStatus === 'initials' && activeSelectedMatch.requestStatus !== 'accepted' ? (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E6ECEA] to-[#D5E1DF] border-2 border-accent-coral shadow flex items-center justify-center font-serif font-black text-warm-charcoal text-lg">
                      {activeSelectedMatch.name ? activeSelectedMatch.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  ) : (
                    <>
                      <img
                        src={activeSelectedMatch.avatarUrl}
                        alt={activeSelectedMatch.name}
                        className={`w-14 h-14 rounded-full object-cover border-2 border-accent-coral shadow ${
                          activeSelectedMatch.photoStatus === 'blurred' && activeSelectedMatch.requestStatus !== 'accepted' ? 'filter blur-[10px]' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      {activeSelectedMatch.photoStatus === 'blurred' && activeSelectedMatch.requestStatus !== 'accepted' && (
                        <span className="absolute inset-0 bg-[#2D2A26]/20 rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-black text-warm-charcoal flex items-center flex-wrap gap-1.5">
                    <span>{activeSelectedMatch.name}, {activeSelectedMatch.age}</span>
                    {activeSelectedMatch.verified && (
                      <span className="text-xs bg-[#40798C] text-white px-2 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-white shrink-0" />
                        <span className="text-[9px] font-bold">Demo Verified</span>
                      </span>
                    )}
                    {activeSelectedMatch.isOnline && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9.5px] font-mono uppercase font-black tracking-wide">
                          {txt('Online', 'نشط الآن', 'ئێستا چالاکە')}
                        </span>
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#6B635B] font-semibold mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#40798C] shrink-0" />
                    <span>{activeSelectedMatch.governorate}, Iraq</span>
                  </p>
                  
                  {/* Active badges in modal */}
                  {activeSelectedMatch.badges && activeSelectedMatch.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {activeSelectedMatch.badges.map(badgeKey => {
                        const colors = badgeKey.includes('Serious') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                       badgeKey.includes('Family') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                       badgeKey.includes('Ready') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                       badgeKey.includes('Studying') || badgeKey.includes('studies') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                       'bg-purple-50 text-purple-700 border-purple-200';
                        return (
                          <span key={badgeKey} className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-md border ${colors} shadow-3xs uppercase tracking-wide`}>
                            🛡️ {badgeKey === 'Serious for marriage' ? txt('Serious Match', 'جاد للزواج', 'جدی بۆ هاوسەرگیری') :
                                 badgeKey === 'Family involved' ? txt('Family Aware', 'الأهل عل علم', 'خێزان ئاگادارە') :
                                 badgeKey === 'Ready for engagement' ? txt('Ready', 'جاهز كلياً', 'ئامادەیە') :
                                 badgeKey === 'Studying first' ? txt('Studies First', 'الدراسة أولاً', 'خوێندن لە پێشینەیە') :
                                 txt('Private Profile', 'ملف تحفظي وخاص', 'پڕۆفایلی تایبەتی')}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Compatibility score ribbon */}
              <div className="bg-gradient-to-br from-accent-coral to-accent-pink text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md">
                <Star className="w-4 h-4 fill-white text-white" />
                <span className="text-xs font-mono font-black">{activeSelectedMatch.compatibilityScore}% Compatibility</span>
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

            {/* SECTION 1: Personal Statement & Marital Intention */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-accent-coral uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{txt('Sincere Message & Goal', 'الرسالة الصادقة والهدف', 'نامەی ڕاستگۆیانە و ئامانج')}</span>
              </h4>
              <div className="bg-[#40798C]/5 p-4 rounded-2xl border border-[#40798C]/15 text-[#4A443F] text-xs sm:text-sm leading-relaxed italic font-medium">
                "{activeSelectedMatch.aboutMe}"
              </div>
              {activeSelectedMatch.intention && (
                <div className="p-3.5 bg-white border border-stone-200/80 rounded-2xl border-l-4 border-l-accent-coral shadow-sm">
                  <span className="text-[9px] font-bold text-[#6B635B] uppercase block tracking-wider font-mono">
                    {txt('Marital Intentions Summary', 'ملخص الرؤية للزواج', 'پوختەی خواستەکانی هاوسەرگیری')}
                  </span>
                  <p className="text-xs text-warm-charcoal italic mt-1 leading-relaxed font-semibold">
                    "{activeSelectedMatch.intention}"
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 2: Demographics & Spiritual Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/60 border border-stone-200/60 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wider block">
                  🕌 {txt('Beliefs & Origins', 'المعتقد والأصول', 'باوەڕ و ڕەگەز')}
                </span>
                <ul className="text-xs space-y-1.5 font-bold text-warm-charcoal">
                  <li>
                    <span className="text-stone-500 font-medium">Religion:</span>{' '}
                    {activeSelectedMatch.religion === 'islam' ? 'Islam' : 'Other'}
                  </li>
                  {activeSelectedMatch.sect && (
                    <li>
                      <span className="text-stone-500 font-medium">Islamic Sect:</span>{' '}
                      <span className="capitalize">{activeSelectedMatch.sect}</span>
                    </li>
                  )}
                  <li>
                    <span className="text-stone-500 font-medium">Ethnicity:</span>{' '}
                    <span className="capitalize">{activeSelectedMatch.ethnicity}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/60 border border-stone-200/60 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wider block">
                  🎓 {txt('Education & Career', 'التحصيل الأكاديمي والمهني', 'خوێندن و پیشە')}
                </span>
                <ul className="text-xs space-y-1.5 font-bold text-warm-charcoal">
                  <li className="truncate">
                    <span className="text-stone-500 font-medium">Academics:</span> {activeSelectedMatch.education}
                  </li>
                  <li className="truncate">
                    <span className="text-stone-500 font-medium">Profession:</span> {activeSelectedMatch.profession}
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Timeline, Children, Languages & Dealbreakers */}
            <div className="bg-white/60 border border-stone-200/60 p-4 rounded-2xl space-y-3.5">
              <span className="text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wider block">
                ⚙️ {txt('Courtship Commitments', 'شروط ومتطلبات التعارف', 'بەڵێنەکانی هاوسەرگیری')}
              </span>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-warm-charcoal">
                <div>
                  <span className="text-[9px] text-stone-500 font-medium font-mono uppercase block">Timeline expectation</span>
                  <span>{activeSelectedMatch.timeline}</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-500 font-medium font-mono uppercase block">Want children?</span>
                  <span>{activeSelectedMatch.wantsChildren}</span>
                </div>
              </div>

              {/* Spoken Languages */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <span className="text-[9px] text-[#6B635B] font-mono uppercase font-bold block flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-stone-600" />
                  <span>{txt('Spoken Languages', 'اللغات المتقنة', 'زمانە قسەکراوەکان')}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSelectedMatch.languages.map(l => (
                    <span key={l} className="bg-[#40798C]/10 text-[#40798C] px-2 py-0.5 rounded border border-[#40798C]/15 text-[10px] font-bold">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strict Dealbreakers */}
              {activeSelectedMatch.dealbreakers && activeSelectedMatch.dealbreakers.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <span className="text-[9px] text-[#6B635B] font-mono uppercase font-bold block">
                    🚫 {txt('Absolute Dealbreakers', 'خطوط حمراء مستحيلة', 'هێڵە سوورەکان')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSelectedMatch.dealbreakers.map(db => (
                      <span key={db} className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-lg border border-red-200/50 text-[10px] font-extrabold">
                        No {db}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: Preferences Summary */}
            <div className="bg-white/40 border border-stone-200/50 p-4 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#6B635B] uppercase tracking-wider block">
                🎯 {txt('Ideal Match Preferences', 'المواصفات المطلوبة في الشريك', 'تایبەتمەندییە دڵخوازەکانی هاوبەش')}
              </span>
              <p className="text-xs text-warm-charcoal leading-relaxed font-semibold">
                {txt(
                  `Seeking a ${activeSelectedMatch.gender === 'female' ? 'serious man' : 'serious woman'} located primarily of compatible traditional background, values ${activeSelectedMatch.valuesSummary.slice(0, 3).join(', ')}, with an honest commitment to secure a stable marital environment within ${activeSelectedMatch.timeline.toLowerCase()}.`,
                  `يبحث عن شريك جاد ومسؤول يتوافق مع نمط الحياة العائلية، يلتزم بالقيم الأساسية: ${activeSelectedMatch.valuesSummary.slice(0, 3).join('، ')}، ويستعد لإبرام مودة وسكينة خلال ${activeSelectedMatch.timeline.toLowerCase()}.`,
                  `بەدوای ${activeSelectedMatch.gender === 'female' ? 'پیاوێکی جدی' : 'ئافرەتێکی جدی'}دا دەگەڕێت کە زۆرترین گونجانی خێزانی، بەهاکانی ${activeSelectedMatch.valuesSummary.slice(0, 3).join('، ')}، لەگەڵ بەڵێنی ڕاستگۆیانە بۆ دابینکردنی ژینگەیەکی جێگیری هاوسەرگیری لە ماوەی ${activeSelectedMatch.timeline.toLowerCase()}دایە.`
                )}
              </p>
            </div>

            {/* Photo Privacy & State info */}
            <div className="bg-[#40798C]/5 border border-[#40798C]/10 p-3.5 rounded-xl flex items-start gap-2.5">
              <Lock className="w-4.5 h-4.5 text-[#40798C] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-[#4A443F]">
                <strong>{txt('Respectful Photo Privacy', 'خصوصية الصورة المصونة', 'تایبەتیپارێزیی ڕێزدارانەی وێنە')}</strong>
                <p className="mt-0.5 text-[11px] font-medium text-[#6B635B]">
                  {activeSelectedMatch.photoStatus === 'blurred'
                    ? txt(
                      'This member protects their image. The picture will automatically unlock once you send a request and they mutually accept.', 
                      'يقوم هذا العضو بصون صورته الشخصية. سيتم فك حجب الصورة تلقائياً عندما تبادر بإرسال طلب ويتم القبول.',
                      'ئەم ئەندامە وێنەی خۆی دەپارێزێت. وێنەکە بە شێوەیەکی ئۆتۆماتیکی دەکرێتەوە کاتێک داواکاری دەنێریت و بە دوولایەنە پەسەند دەکرێت.'
                    )
                    : txt(
                      'Directly visible portrait. Communicates with absolute visual and personal transparency.', 
                      'الصورة مكشوفة مباشرة. يتواصل هذا العضو بوضوح تام وشفافية كاملة منذ البداية.',
                      'وێنەی ڕاستەوخۆ دیار. پەیوەندی بە ڕوونی متمانەبەخشی تەواوی وێنە و کەسایەتی دەکات.'
                    )}
                </p>
              </div>
            </div>

            {/* BUTTONS FOR REQUEST ACTION */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-stone-150">
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200/90 font-bold text-[#4A443F] rounded-xl text-xs transition uppercase font-mono tracking-wider"
              >
                {txt('Close Dossier', 'إغلاق الملف', 'داخستنی دۆسیە')}
              </button>

              {activeSelectedMatch.requestStatus === 'none' && (
                <button
                  type="button"
                  onClick={() => {
                    onSendRequest(activeSelectedMatch.id);
                  }}
                  className="px-6 py-2.5 bg-accent-coral text-white font-bold text-xs rounded-xl shadow-lg shadow-accent-coral/20 hover:opacity-90 transition flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white text-white shrink-0" />
                  <span>{txt('Send Marriage Request', 'إرسال طلب تعارف للزواج', 'ناردنی داواکاری هاوسەرگیری')}</span>
                </button>
              )}

              {activeSelectedMatch.requestStatus === 'sent' && (
                <button
                  type="button"
                  disabled
                  className="px-6 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-800 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span>{txt('Pending Review...', 'بانتظار المراجعة...', 'چاوەڕوانی پێداچوونەوە...')}</span>
                </button>
              )}

              {activeSelectedMatch.requestStatus === 'accepted' && (
                <button
                  type="button"
                  onClick={() => {
                    onInitiateChat(activeSelectedMatch.id);
                    setSelectedMatch(null);
                  }}
                  className="px-6 py-2.5 bg-[#40798C] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#40798C]/20 hover:opacity-90 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>{txt('Mutually Connected! Open Chat', 'تم القبول! افتح المحادثة', 'پەیوەستبوون دروستبوو! دەستکردن بە چات')}</span>
                </button>
              )}

              {activeSelectedMatch.requestStatus === 'declined' && (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 bg-red-50 text-red-500 border border-red-100 font-bold text-xs rounded-xl cursor-not-allowed"
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
